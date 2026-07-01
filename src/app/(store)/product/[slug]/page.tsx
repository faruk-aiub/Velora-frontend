'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Loader2, Star, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';

import { productService } from '@/services/product.service';
import { wishlistService } from '@/services/wishlist.service';
import { reviewService } from '@/services/review.service';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [activeColor, setActiveColor] = useState(0);

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });

  const productId = productData?.data?.id;

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: !!user,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId!),
    enabled: !!productId,
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

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#BC8477]" />
        <p className="mt-4 text-xs font-bold tracking-widest uppercase text-[#7A7371]">Loading details...</p>
      </div>
    );
  }

  if (isError || !productData?.data) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#3A3331] mb-2">Product Not Found</h2>
        <p className="text-[#7A7371] mb-6">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-[#BC8477] rounded-full text-white px-6 py-3 text-sm font-bold transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const product = productData.data;
  const primaryVariant = product.variants?.[0];
  const price = primaryVariant?.price || 0;
  const comparePrice = primaryVariant?.compare_price;
  const discountPercent = comparePrice && comparePrice > price 
    ? Math.round(((comparePrice - price) / comparePrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (!primaryVariant) return;
    addItem(product, primaryVariant, quantity);
    toast.success(`${quantity}x ${product.title} added to cart`);
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
    { name: 'Green', hex: '#4B7B83' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Navy', hex: '#1E1B4B' }
  ];

  return (
    <main className="w-full pt-20 pb-20 bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#BC8477] transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#BC8477] transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-bold truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-6 w-full max-w-[700px]">
            <div className="relative aspect-square w-full rounded-[2rem] bg-gray-100 overflow-hidden shadow-sm">
              {product.images?.[activeImage] ? (
                <Image
                  src={product.images[activeImage].url}
                  alt={product.images[activeImage].alt_text || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#B5AFAD]">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden transition-all duration-300 flex-shrink-0 ${activeImage === idx ? 'ring-2 ring-gray-900 ring-offset-2 opacity-100' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text || `Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-2 lg:pt-6">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#BC8477] mb-3">
              LIMITED EDITION
            </span>
            
            <h1 className="font-bold text-4xl md:text-[2.75rem] text-gray-900 leading-tight mb-4 tracking-tight">
              {product.title}
            </h1>

            {/* Ratings & SKU Summary */}
            <div className="flex items-center gap-3 mb-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-gray-300" strokeWidth={1.5} />
                ))}
              </div>
              <span>{reviewsData?.meta?.total || 0} reviews</span>
              <span className="text-gray-300">|</span>
              <span>SKU: {product.sku || 'AEV-LTD-AT'}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="font-bold text-4xl text-gray-900 tracking-tight">
                ৳{Number(price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
              {comparePrice && Number(comparePrice) > Number(price) && (
                <>
                  <span className="font-medium text-xl text-gray-400 line-through">
                    ৳{Number(comparePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="text-gray-600 text-[15px] font-medium leading-relaxed mb-8 max-w-[90%]">
              {product.description || product.short_description || "Limited edition pilot chronograph made of Grade-5 titanium."}
            </p>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-gray-900">Color</span>
                <span className="text-sm text-gray-500 font-medium">{dummyColors[activeColor].name}</span>
              </div>
              <div className="flex items-center gap-3">
                {dummyColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveColor(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeColor === idx ? 'ring-2 ring-gray-900 ring-offset-2' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Movement</span>
                <span className="text-sm font-bold text-gray-800">Swiss Sellita SW510 Automatic</span>
              </div>
              <div className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Case Size</span>
                <span className="text-sm font-bold text-gray-800">44mm</span>
              </div>
              <div className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Water Res.</span>
                <span className="text-sm font-bold text-gray-800">200m</span>
              </div>
              <div className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Glass</span>
                <span className="text-sm font-bold text-gray-800">AR-Coated Sapphire</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-bold text-green-500">In Stock</span>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full">
              <div className="flex items-center border border-gray-200 rounded-full h-14 px-2 sm:w-32 flex-shrink-0 justify-between">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="font-bold text-[15px] text-gray-900 w-6 text-center">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-gray-900 text-white text-[15px] font-bold rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
              >
                Add to Cart
              </button>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-[#BC8477] text-white text-[15px] font-bold rounded-full hover:bg-[#9A6B60] transition-all duration-300 flex items-center justify-center"
              >
                Buy Now
              </button>

              <button 
                onClick={handleToggleWishlist}
                className="w-14 h-14 flex-shrink-0 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all"
              >
                <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-between py-6 border-t border-b border-gray-100">
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <ShoppingBag className="text-gray-400" size={20} strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-gray-400 max-w-[100px] leading-tight">Free Shipping over ৳200.00</span>
              </div>
              <div className="w-[1px] h-10 bg-gray-100 self-center" />
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <RotateCcw className="text-gray-400" size={20} strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-gray-400 max-w-[80px] leading-tight">30-Day Returns</span>
              </div>
              <div className="w-[1px] h-10 bg-gray-100 self-center" />
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <ShieldCheck className="text-gray-400" size={20} strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-gray-400 max-w-[100px] leading-tight">5 Years International</span>
              </div>
            </div>

          </div>
        </div>
        
        {/* Bottom Tabs Section */}
        <div className="mt-20">
          <div className="bg-[#FAF8F5] rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-8 border-b border-gray-200 pb-4 mb-8">
              <button 
                onClick={() => setActiveTab('description')}
                className={`font-bold text-[15px] transition-colors relative pb-4 -mb-[17px] ${activeTab === 'description' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab('specifications')}
                className={`font-bold text-[15px] transition-colors relative pb-4 -mb-[17px] ${activeTab === 'specifications' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`font-bold text-[15px] transition-colors relative pb-4 -mb-[17px] ${activeTab === 'reviews' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Reviews ({reviewsData?.meta?.total || 0})
              </button>
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <div className="text-gray-600 font-medium leading-relaxed max-w-3xl">
                  Limited to 250 pieces worldwide. Made in partnership with aerospace designers, featuring a brushed matte titanium case, carbon fiber dial, and extremely precise Swiss movement. It is designed to be both incredibly durable and exceptionally light.
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-3xl text-sm">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Case Material</span>
                    <span className="font-bold text-gray-900">Grade 5 Titanium</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Strap Material</span>
                    <span className="font-bold text-gray-900">Italian Calf Leather</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Crystal</span>
                    <span className="font-bold text-gray-900">Domed Sapphire</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Warranty</span>
                    <span className="font-bold text-gray-900">5 Years</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-8">
                    {reviewsData?.data && reviewsData.data.length > 0 ? (
                      reviewsData.data.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">
                              {review.user.first_name} {review.user.last_name}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={14} className={star <= review.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-gray-200 fill-gray-200"} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 font-medium leading-relaxed">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>

                  <div>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Write a Review</h3>
                      {!user ? (
                        <p className="text-sm text-gray-500 font-medium">
                          You must be <Link href="/login" className="text-[#BC8477] hover:underline font-bold">logged in</Link> to post a review.
                        </p>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if(productId) submitReviewMutation.mutate({ product_id: productId, ...newReview });
                        }} className="flex flex-col gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rating</label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star} type="button"
                                  onClick={() => setNewReview({ ...newReview, rating: star })}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star size={24} className={star <= newReview.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-gray-200 fill-gray-200"} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Review</label>
                            <textarea
                              required rows={4}
                              value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477] transition-all resize-none"
                              placeholder="Share your thoughts about this product..."
                            />
                          </div>
                          <button
                            type="submit" disabled={submitReviewMutation.isPending}
                            className="h-12 bg-gray-900 text-white text-[13px] font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
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
