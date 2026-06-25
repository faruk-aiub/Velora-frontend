import apiClient from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/auth.types';
import type { Order } from '@/types/product.types';

export interface CreateOrderPayload {
  shippingAddressId: string;
  cartItems: {
    variantId: string;
    quantity: number;
  }[];
}

export const orderService = {
  create: async (payload: CreateOrderPayload) => {
    const res = await apiClient.post<ApiResponse<Order>>('/orders/create', payload);
    return res.data;
  },

  getAll: async (page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params: { page, limit },
    });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data;
  },
};
