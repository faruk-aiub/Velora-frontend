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
}

export function ProductCard({ id, title, slug, brand, variants, images }: ProductCardProps) {
  const price = variants?.[0]?.price || 0;
  const comparePrice = variants?.[0]?.compare_price;
  const primaryImage = images?.[0]?.url || '/placeholder.jpg';
  const isNew = false;
  
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
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E1DE] mb-4">
        {/* Actual Image */}
        <Image 
          src={primaryImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
        />

        {isNew && (
          <div className="absolute top-4 left-4 bg-[#BC8477] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">
            New
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#7A7371] hover:text-[#BC8477] hover:bg-white transition-all z-10"
        >
          <Heart size={14} className={isWishlisted ? "fill-[#BC8477] text-[#BC8477]" : ""} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white/90 backdrop-blur-sm text-[#3A3331] text-[10px] font-bold tracking-[0.2em] uppercase py-3 hover:bg-[#3A3331] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {brand && (
          <span className="text-[10px] text-[#7A7371] tracking-widest uppercase mb-1">{brand.name}</span>
        )}
        <Link href={`/product/${slug}`} className="font-serif text-lg text-[#3A3331] group-hover:text-[#BC8477] transition-colors line-clamp-1">
          {title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-sans text-sm font-medium text-[#3A3331]">
            ${Number(price).toFixed(2)}
          </span>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="font-sans text-sm text-[#B5AFAD] line-through">
              ${Number(comparePrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
