"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { wishlistService } from '@/services/wishlist.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Product, ProductVariant } from '@/types/product.types';

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  brand?: { name: string };
  variants: { id: string; price: number; compare_price?: number | null }[];
  images: { url: string; alt_text?: string | null }[];
  base_price?: number;
}

export function ProductCard({ id, title, slug, brand, variants, images, base_price }: ProductCardProps) {
  const price = variants?.[0]?.price ?? (base_price || 0);
  const comparePrice = variants?.[0]?.compare_price;
  const primaryImage = images?.[0]?.url || '/placeholder.jpg';
  const isNew = false;
  
  const discountPercent = comparePrice && comparePrice > price 
    ? Math.round(((comparePrice - price) / comparePrice) * 100) 
    : 0;
  
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

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
      // Optimistic update
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
      // Create full product shape to match store expectations
      const product = { id, title, slug, brand, images, variants } as unknown as Product;
      addItem(product, variants[0] as unknown as ProductVariant, 1);
      toast.success(`Added ${title} to cart`);
      openCart();
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-2xl mb-4 shadow-sm">
        {/* Actual Image */}
        <Link href={`/product/${slug}`} className="absolute inset-0 z-0 block">
          <Image 
            src={primaryImage} 
            alt={title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        </Link>

        {/* Badges container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {isNew && (
            <div className="bg-gray-900 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-sm">
              New
            </div>
          )}
          {discountPercent > 0 && (
            <div className="bg-red-500 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-sm">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all z-10"
        >
          <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>

      </div>

      <div className="flex flex-col mt-2">
        {brand && (
          <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">{brand.name}</span>
        )}
        <Link href={`/product/${slug}`} className="font-bold text-[15px] text-gray-900 hover:text-[#7A915C] transition-colors line-clamp-1 mb-1">
          {title}
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-xs font-bold text-gray-700">4.8</span>
          <span className="text-xs text-gray-400">(64)</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-[16px] text-gray-900">
            ৳{Number(price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="font-medium text-xs text-gray-400 line-through">
              ৳{Number(comparePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#7A915C] text-white text-sm font-bold rounded-lg py-3 hover:bg-[#687C4D] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
