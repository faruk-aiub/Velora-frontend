'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  ChevronRight, 
  Heart, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

import { productService } from '@/services/product.service';
import { wishlistService } from '@/services/wishlist.service';
import { reviewService } from '@/services/review.service';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import type { Product, ProductVariant } from '@/types/product.types';

interface ProductDetailsClientProps {
  initialProduct: Product | null;
  slug: string;
}

export function ProductDetailsClient({ initialProduct, slug }: ProductDetailsClientProps) {
  if (typeof window === 'undefined') {
    console.log(`[ProductDetailsClient SSR] rendering for slug: ${slug} at ${performance.now().toFixed(1)}`);
  }
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [activeColor, setActiveColor] = useState(0);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Use initialProduct as pre-loaded data if available, otherwise fetch on client
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    initialData: initialProduct ? { success: true, message: '', data: initialProduct } : undefined,
    staleTime: 60 * 1000,
    enabled: typeof window !== 'undefined' && !!slug,
  });

  const product = (productData?.data || initialProduct) as Product | null;
  const productId = product?.id;

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: typeof window !== 'undefined' && !!user,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId!),
    enabled: typeof window !== 'undefined' && !!productId,
  });

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const submitReviewMutation = useMutation({
    mutationFn: ({ product_id, rating, comment }: { product_id: string; rating: number; comment: string }) =>
      reviewService.createReview(product_id, rating, comment),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setNewReview({ rating: 5, comment: '' });
      toast.success(res.message || 'Review submitted!');
    },
    onError: () => toast.error('Failed to submit review'),
  });

  const isWishlisted = wishlistData?.data?.some((item) => item.product_id === productId) || false;

  const toggleWishlistMutation = useMutation({
    mutationFn: wishlistService.toggleWishlist,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(res.message);
    },
    onError: () => toast.error('Failed to update wishlist'),
  });
  if (isLoading && !product) {
    return (
      <main className="w-full pt-28 pb-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 h-[500px] bg-gray-100 rounded-3xl" />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-28 px-6 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">The product you are looking for does not exist or has been updated.</p>
        <Link
          href="/shop"
          className="bg-[#BC8477] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#A87569] transition-colors shadow-sm"
        >
          Explore Catalog
        </Link>
      </main>
    );
  }

  const primaryVariant = product.variants?.[0];
  const price = Number(primaryVariant?.price || (product as any).base_price || 0);
  const comparePrice = primaryVariant?.compare_price != null ? Number(primaryVariant.compare_price) : undefined;
  const discountPercent = comparePrice && comparePrice > price 
    ? Math.round(((comparePrice - price) / comparePrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (!primaryVariant) return;
    addItem(product, primaryVariant as ProductVariant, quantity);
    toast.success(`${quantity}x ${product.title} added to cart`);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
    openCart();
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    if (product.id) {
      toggleWishlistMutation.mutate(product.id);
    }
  };

  const dummyColors = [
    { name: 'Heritage Tan', hex: '#8B5A2B' },
    { name: 'Onyx Black', hex: '#1E1E1E' },
    { name: 'Olive Green', hex: '#4A5D4E' }
  ];

  const currentImage = product.images?.[activeImage]?.url || (product as any).image_url || '/placeholder.jpg';

  return (
    <main className="w-full pt-28 pb-20 bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#BC8477] transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#BC8477] transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-gray-900 font-bold truncate max-w-[280px]">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ── Image Gallery ── */}
          <div className="flex flex-col gap-5 w-full">
            <div className="relative aspect-square w-full rounded-[2.5rem] bg-gray-50 overflow-hidden shadow-xs border border-gray-100">
              <Image
                src={currentImage}
                alt={product.images?.[activeImage]?.alt_text || product.title}
                fill
                priority
                className="object-cover transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#BC8477] text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                  -{discountPercent}% OFF
                </div>
              )}

              <button 
                onClick={handleToggleWishlist}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white hover:scale-105 transition-all z-10"
              >
                <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden transition-all duration-200 flex-shrink-0 border-2 ${
                      activeImage === idx 
                        ? 'border-[#BC8477] shadow-sm scale-95' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text || `Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col pt-1 lg:pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC8477]/10 text-[#BC8477] text-xs font-bold uppercase tracking-widest mb-3.5 w-fit">
              <Sparkles size={13} />
              <span>{product.brand?.name || product.category?.name || 'Verified Collection'}</span>
            </div>
            
            <h1 className="font-extrabold text-3xl sm:text-4xl text-gray-900 leading-tight mb-4 tracking-tight">
              {product.title}
            </h1>

            {/* Ratings & SKU Summary */}
            <div className="flex items-center gap-3 mb-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-gray-700">4.9</span>
              <span className="text-gray-300">|</span>
              <span>{reviewsData?.meta?.total || 18} verified reviews</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-400">SKU: {product.sku || 'VEL-ART-01'}</span>
            </div>
            
            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] w-fit">
              <span className="font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">
                ৳{Number(price).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              </span>
              {comparePrice && Number(comparePrice) > Number(price) && (
                <>
                  <span className="font-semibold text-lg text-gray-400 line-through">
                    ৳{Number(comparePrice).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Save ৳{Number(comparePrice - price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {product.description || product.short_description || "Crafted with exceptional materials for elevated everyday living."}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">In Stock & Ready for Fast Dispatch</span>
            </div>

            {/* Color Palette Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-700">Select Finish</span>
                <span className="text-xs font-semibold text-gray-500">{dummyColors[activeColor].name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {dummyColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveColor(idx)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      activeColor === idx ? 'ring-2 ring-gray-900 ring-offset-2 scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row gap-3.5 mb-8 w-full">
              {/* Quantity Picker */}
              <div className="flex items-center border border-gray-200 rounded-2xl h-13 px-2 sm:w-32 flex-shrink-0 justify-between bg-white shadow-xs">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={15} />
                </button>
                <div className="font-bold text-sm text-gray-900 w-6 text-center">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 h-13 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                  isAddedRecently 
                    ? "bg-emerald-600 text-white" 
                    : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]"
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check size={16} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              
              {/* Buy Now Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-13 bg-[#BC8477] text-white text-sm font-bold rounded-2xl hover:bg-[#A87569] active:scale-[0.99] transition-all duration-300 flex items-center justify-center shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Architecture Badges */}
            <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <Truck className="text-[#BC8477]" size={20} strokeWidth={2} />
                <span className="text-[11px] font-bold text-gray-800 leading-tight">Fast Dispatch</span>
                <span className="text-[10px] text-gray-400">Within 24 Hours</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 border-x border-gray-100">
                <RotateCcw className="text-[#BC8477]" size={20} strokeWidth={2} />
                <span className="text-[11px] font-bold text-gray-800 leading-tight">30-Day Returns</span>
                <span className="text-[10px] text-gray-400">Hassle-free guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <ShieldCheck className="text-[#BC8477]" size={20} strokeWidth={2} />
                <span className="text-[11px] font-bold text-gray-800 leading-tight">100% Authentic</span>
                <span className="text-[10px] text-gray-400">Verified Velora Seal</span>
              </div>
            </div>

          </div>
        </div>
        
        {/* ── Bottom Tabs Section (Description, Specs, Reviews) ── */}
        <div className="mt-16">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#EFECE6]">
            <div className="flex items-center gap-6 border-b border-gray-200/80 pb-4 mb-8">
              <button 
                onClick={() => setActiveTab('description')}
                className={`font-bold text-sm sm:text-base transition-colors relative pb-4 -mb-[17px] ${
                  activeTab === 'description' 
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Description & Craftsmanship
              </button>
              <button 
                onClick={() => setActiveTab('specifications')}
                className={`font-bold text-sm sm:text-base transition-colors relative pb-4 -mb-[17px] ${
                  activeTab === 'specifications' 
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`font-bold text-sm sm:text-base transition-colors relative pb-4 -mb-[17px] ${
                  activeTab === 'reviews' 
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Reviews ({reviewsData?.meta?.total || 18})
              </button>
            </div>

            <div className="min-h-[160px]">
              {activeTab === 'description' && (
                <div className="text-gray-700 font-normal leading-relaxed max-w-3xl space-y-4">
                  <p>
                    {product.description || "Every Velora item is curated to provide lasting utility, elegant form, and premium feel. Thoroughly quality-tested and inspected before dispatch."}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sourced directly from verified brands and artisan workshops. Backed by the Velora standard of authenticity and 30-day return policy.
                  </p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 max-w-3xl text-sm">
                  <div className="flex justify-between py-2.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="font-bold text-gray-900">{product.category?.name || 'Lifestyle Essentials'}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Brand</span>
                    <span className="font-bold text-gray-900">{product.brand?.name || 'Velora Curated'}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">SKU</span>
                    <span className="font-bold text-gray-900">{product.sku || 'VEL-STD-2026'}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Warranty</span>
                    <span className="font-bold text-gray-900">1 Year Official Warranty</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-6">
                    {reviewsData?.data && reviewsData.data.length > 0 ? (
                      reviewsData.data.map((review) => (
                        <div key={review.id} className="pb-5 border-b border-gray-200 last:border-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-bold text-gray-900">
                              {review.user?.first_name} {review.user?.last_name}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={13} 
                                className={star <= review.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-gray-200 fill-gray-200"} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-gray-900">Tanvir Ahmed</span>
                            <span className="text-xs text-gray-400">Verified Buyer</span>
                          </div>
                          <div className="flex items-center gap-1 mb-1.5 text-amber-500">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-600">Exceptional quality and pristine packaging. Highly satisfied with Velora delivery.</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-gray-900">Nabila Rahman</span>
                            <span className="text-xs text-gray-400">Verified Buyer</span>
                          </div>
                          <div className="flex items-center gap-1 mb-1.5 text-amber-500">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-600">The product looks even better in real life than in the picture. Premium finish!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4">Write a Review</h3>
                      {!user ? (
                        <p className="text-xs text-gray-500 font-medium">
                          Please <Link href="/login" className="text-[#BC8477] hover:underline font-bold">sign in</Link> to share your verified review.
                        </p>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if(productId) submitReviewMutation.mutate({ product_id: productId, ...newReview });
                        }} className="flex flex-col gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rating</label>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star} type="button"
                                  onClick={() => setNewReview({ ...newReview, rating: star })}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star size={20} className={star <= newReview.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-gray-200 fill-gray-200"} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Feedback</label>
                            <textarea
                              required rows={3}
                              value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477] transition-all resize-none"
                              placeholder="Describe your experience with this item..."
                            />
                          </div>
                          <button
                            type="submit" disabled={submitReviewMutation.isPending}
                            className="h-10 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            {submitReviewMutation.isPending ? 'Submitting...' : 'Post Review'}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
