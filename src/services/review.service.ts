import apiClient from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/auth.types';

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

export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  getProductReviews: async (productId: string, page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return res.data;
  },

  createReview: async (payload: CreateReviewPayload) => {
    const res = await apiClient.post<ApiResponse<Review>>('/reviews', payload);
    return res.data;
  },
};
