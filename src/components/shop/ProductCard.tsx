"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { wishlistService } from '@/services/wishlist.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { Product, ProductVariant } from '@/types/product.types';

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  brand?: { name: string };
  category?: { name: string; slug: string };
  variants: { id: string; price: number; compare_price?: number | null }[];
  images: { url: string; alt_text?: string | null }[];
  base_price?: number;
  discount_percent?: number;
}

export function ProductCard({ 
  id, 
  title, 
  slug, 
  brand, 
  category,
  variants, 
  images, 
  base_price, 
  discount_percent = 0 
}: ProductCardProps) {
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const primaryVariant = variants?.[0];
  const price = Number(primaryVariant?.price ?? base_price ?? 0);
  const comparePrice = primaryVariant?.compare_price != null 
    ? Number(primaryVariant.compare_price)
    : (discount_percent > 0 ? Math.round(price / (1 - discount_percent / 100)) : undefined);

  const rawImage = images?.[0]?.url || '/placeholder.jpg';
  // Use unoptimized if placeholder
  const isPlaceholder = rawImage.includes('picsum.photos');
  
  const calculatedDiscountPercent = comparePrice && comparePrice > price 
    ? Math.round(((comparePrice - price) / comparePrice) * 100) 
    : (discount_percent || 0);
  
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Wishlist Logic
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: !!user,
  });

  const isWishlisted = wishlistData?.data?.some((item) => item.product_id === id) || false;

  const toggleWishlistMutation = useMutation({
    mutationFn: wishlistService.toggleWishlist,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData(['wishlist']);
      queryClient.setQueryData(['wishlist'], (old: { data: { product_id: string }[] } | undefined) => {
        if (!old?.data) return old;
        const exists = old.data.find((item) => item.product_id === productId);
        if (exists) {
          return { ...old, data: old.data.filter((item) => item.product_id !== productId) };
        } else {
          return { ...old, data: [...old.data, { product_id: productId }] };
        }
      });
      return { previousWishlist };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['wishlist'], context?.previousWishlist);
      toast.error('Failed to update wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    toggleWishlistMutation.mutate(id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (variants && variants.length > 0) {
      const product = { id, title, slug, brand, images, variants } as unknown as Product;
      addItem(product, variants[0] as unknown as ProductVariant, 1);
      toast.success(`Added "${title}" to cart`);
      setIsAddedRecently(true);
      setTimeout(() => setIsAddedRecently(false), 1500);
      openCart();
    }
  };

  return (
    <div 
      onMouseEnter={() => router.prefetch(`/product/${slug}`)}
      className="group flex flex-col bg-white rounded-[24px] p-3 sm:p-4 border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:border-[#BC8477]/30 transition-all duration-300"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-[18px] mb-3 shadow-inner">
        <Link href={`/product/${slug}`} prefetch={true} className="absolute inset-0 z-0 block">
          <Image 
            src={rawImage} 
            alt={title} 
            fill 
            unoptimized={isPlaceholder}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-108" 
          />
        </Link>

        {/* Badges container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {calculatedDiscountPercent > 0 && (
            <div className="bg-[#BC8477] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider">
              -{calculatedDiscountPercent}%
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          aria-label="Add to wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110 transition-all z-10"
        >
          <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      {/* Product Info & Actions */}
      <div className="flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Brand or Category tag */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            <span>{brand?.name || category?.name || 'Verified Collection'}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-gray-700 font-bold">4.9</span>
            </div>
          </div>

          {/* Product Title */}
          <Link 
            href={`/product/${slug}`} 
            prefetch={true}
            title={title}
            className="font-bold text-sm text-gray-900 hover:text-[#BC8477] transition-colors line-clamp-2 leading-snug mb-2 block"
          >
            {title}
          </Link>
          
          {/* Price Area */}
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base text-gray-900 tracking-tight">
              ৳{Number(price).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
            </span>
            {comparePrice && Number(comparePrice) > Number(price) && (
              <span className="font-medium text-xs text-gray-400 line-through">
                ৳{Number(comparePrice).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
            isAddedRecently
              ? "bg-emerald-600 text-white"
              : "bg-[#BC8477] text-white hover:bg-[#A87569] active:scale-[0.98]"
          }`}
        >
          {isAddedRecently ? (
            <>
              <Check size={14} />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
