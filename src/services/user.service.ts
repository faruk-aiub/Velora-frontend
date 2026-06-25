import apiClient from '@/lib/axios';
import type { ApiResponse, User } from '@/types/auth.types';

export interface UserAddress {
  id: string;
  type: 'BILLING' | 'SHIPPING';
  address_line1: string;
  address_line2?: string | null;
  city: string;
  postal_code: string;
  is_default: boolean;
}

export type CreateAddressPayload = Omit<UserAddress, 'id'>;

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/users/me');
    return res.data;
  },

  updateProfile: async (payload: Partial<User>) => {
    const res = await apiClient.put<ApiResponse<User>>('/users/me', payload);
    return res.data;
  },

  getAddresses: async () => {
    const res = await apiClient.get<ApiResponse<UserAddress[]>>('/users/address');
    return res.data;
  },

  addAddress: async (payload: CreateAddressPayload) => {
    const res = await apiClient.post<ApiResponse<UserAddress>>('/users/address', payload);
    return res.data;
  },

  updateAddress: async (id: string, payload: Partial<CreateAddressPayload>) => {
    const res = await apiClient.put<ApiResponse<UserAddress>>(`/users/address/${id}`, payload);
    return res.data;
  },

  deleteAddress: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/users/address/${id}`);
    return res.data;
  },
};
