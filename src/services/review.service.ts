import apiClient from '@/lib/axios';
import type { PaginatedResponse } from '@/types/auth.types';

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
}

export const reviewService = {
  getProductReviews: async (productId: string, page = 1, limit = 5) => {
    const res = await apiClient.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return res.data;
  },

  getMyReviews: async (page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<Review>>('/reviews/me', {
      params: { page, limit },
    });
    return res.data;
  },

  createReview: async (productId: string, rating: number, comment?: string) => {
    const res = await apiClient.post('/reviews', {
      product_id: productId,
      rating,
      comment,
    });
    return res.data;
  },
};
