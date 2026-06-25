import apiClient from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/auth.types';
import type { Product } from '@/types/product.types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  search?: string;
}

export const productService = {
  getAll: async (filters: ProductFilters = {}) => {
    // Map frontend 'category' to backend 'category_id'
    const apiParams: Record<string, string | number | undefined> = { ...filters };
    if (apiParams.category) {
      apiParams.category_id = apiParams.category;
      delete apiParams.category;
    }
    if (apiParams.search) {
      apiParams.q = apiParams.search;
      delete apiParams.search;
    }
    
    const res = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params: apiParams,
    });
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
    return res.data;
  },

  getFeatured: async () => {
    const res = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params: { limit: 8, sort: 'created_at:desc' },
    });
    return res.data;
  },
};
