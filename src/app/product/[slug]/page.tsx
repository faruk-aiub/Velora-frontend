'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Loader2, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

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
    mutationFn: reviewService.createReview,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setNewReview({ rating: 5, comment: '' });
      toast.success(res.message);
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
        <p className="mt-4 text-xs tracking-widest uppercase text-[#7A7371]">Loading details...</p>
      </div>
    );
  }

  if (isError || !productData?.data) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-[#3A3331] mb-2">Product Not Found</h2>
        <p className="text-[#7A7371] mb-6">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-[#BC8477] text-white px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60] transition-colors"
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

  return (
    <main className="w-full pt-24 pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A7371]">
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
          <span className="text-[#3A3331] truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-[#F5F2F0] overflow-hidden">
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
              <button 
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#7A7371] hover:text-[#BC8477] hover:bg-white transition-all"
              >
                <Heart size={18} className={isWishlisted ? "fill-[#BC8477] text-[#BC8477]" : ""} />
              </button>
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-[4/5] bg-[#F5F2F0] overflow-hidden transition-all duration-300 ${activeImage === idx ? 'ring-1 ring-[#BC8477] opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text || `Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-4 lg:pt-10">
            {product.brand && (
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#BC8477] mb-3">
                {product.brand.name}
              </span>
            )}
            
            <h1 className="font-serif text-3xl md:text-5xl text-[#3A3331] font-light leading-tight mb-4">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="fill-[#3A3331] text-[#3A3331]" />
                ))}
              </div>
              <span className="text-sm text-[#7A7371]">
                ({reviewsData?.meta?.total || 0} Reviews)
              </span>
            </div>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="font-sans text-3xl text-[#3A3331] font-medium">
                ${Number(price).toFixed(2)}
              </span>
              {comparePrice && Number(comparePrice) > Number(price) && (
                <span className="font-sans text-xl text-[#B5AFAD] line-through mb-1">
                  ${Number(comparePrice).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-[#7A7371] leading-relaxed font-light mb-10">
              {product.description || product.short_description || "No description available for this product."}
            </p>

            <div className="w-full h-[1px] bg-[#E8E1DE] mb-10" />

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-[#E8E1DE] h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-full flex items-center justify-center text-[#7A7371] hover:text-[#3A3331] hover:bg-[#F5F2F0] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <div className="w-14 h-full flex items-center justify-center font-sans text-sm text-[#3A3331]">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-full flex items-center justify-center text-[#7A7371] hover:text-[#3A3331] hover:bg-[#F5F2F0] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-[#3A3331] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <ShoppingBag size={16} className="transition-transform group-hover:scale-110" />
                Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-[#E8E1DE]">
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck className="text-[#BC8477]" size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#3A3331]">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Truck className="text-[#BC8477]" size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#3A3331]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <RotateCcw className="text-[#BC8477]" size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#3A3331]">30-Day Returns</span>
              </div>
            </div>

            {/* Accordion Info Placeholder */}
            <div className="mt-8 space-y-4">
              <details className="group border-b border-[#E8E1DE] pb-4">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-bold tracking-widest uppercase text-[#3A3331] list-none">
                  Product Details
                  <Plus size={16} className="transition-transform group-open:rotate-45" />
                </summary>
                <div className="mt-4 text-sm text-[#7A7371] font-light leading-relaxed">
                  Carefully crafted with premium materials to ensure longevity and elegance. 
                  Designed specifically to meet the high standards of the Velora collection.
                </div>
              </details>
              <details className="group border-b border-[#E8E1DE] pb-4">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-bold tracking-widest uppercase text-[#3A3331] list-none">
                  Shipping & Returns
                  <Plus size={16} className="transition-transform group-open:rotate-45" />
                </summary>
                <div className="mt-4 text-sm text-[#7A7371] font-light leading-relaxed">
                  Enjoy complimentary standard shipping on all orders. Returns are accepted within 30 days of delivery for a full refund.
                </div>
              </details>
            </div>

          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-20 pt-20 border-t border-[#E8E1DE]">
          <h2 className="font-serif text-3xl text-[#3A3331] font-light mb-10 text-center">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Reviews List */}
            <div className="flex flex-col gap-8">
              {reviewsData?.data && reviewsData.data.length > 0 ? (
                reviewsData.data.map((review) => (
                  <div key={review.id} className="border-b border-[#E8E1DE] pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold tracking-widest uppercase text-[#3A3331]">
                        {review.user.first_name} {review.user.last_name}
                      </span>
                      <span className="text-xs text-[#7A7371]">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} className={star <= review.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-[#D5CFCD]"} />
                      ))}
                    </div>
                    <p className="text-sm text-[#7A7371] font-light leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#7A7371]">No reviews yet. Be the first to review this product!</p>
              )}
            </div>

            {/* Write a Review */}
            <div>
              <div className="bg-[#FAF8F5] p-8 border border-[#E8E1DE]">
                <h3 className="text-lg font-serif text-[#3A3331] mb-6">Write a Review</h3>
                {!user ? (
                  <p className="text-sm text-[#7A7371]">
                    You must be <Link href="/login" className="text-[#BC8477] hover:underline">logged in</Link> to post a review.
                  </p>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if(productId) submitReviewMutation.mutate({ product_id: productId, ...newReview });
                  }} className="flex flex-col gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase mb-2">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star} type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star size={24} className={star <= newReview.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-[#D5CFCD]"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase mb-2">Your Review</label>
                      <textarea
                        required rows={4}
                        value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-white border border-[#E8E1DE] p-4 text-sm text-[#3A3331] focus:outline-none focus:border-[#BC8477] transition-colors resize-none"
                        placeholder="Share your thoughts about this product..."
                      />
                    </div>
                    <button
                      type="submit" disabled={submitReviewMutation.isPending}
                      className="h-12 bg-[#3A3331] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] transition-colors disabled:opacity-50"
                    >
                      {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
