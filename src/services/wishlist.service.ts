import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/auth.types';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    slug: string;
    brand?: { name: string };
    images: { url: string; alt_text?: string | null }[];
    variants: { id: string; price: number; compare_price: number | null }[];
  };
}

export interface ToggleWishlistResponse {
  message: string;
  status: 'added' | 'removed';
}

export const wishlistService = {
  getWishlist: async () => {
    const res = await apiClient.get<ApiResponse<WishlistItem[]>>('/wishlist');
    return res.data;
  },

  toggleWishlist: async (productId: string) => {
    const res = await apiClient.post<ToggleWishlistResponse>(`/wishlist/${productId}/toggle`);
    return res.data;
  }
};
