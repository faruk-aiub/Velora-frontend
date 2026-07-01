import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/auth.types';

export interface InitiatePaymentPayload {
  orderId: string;
  provider: 'STRIPE' | 'COD';
}

export interface PaymentResponse {
  paymentId: string;
  paymentUrl?: string;
  message?: string;
}

export const paymentService = {
  initiate: async (payload: InitiatePaymentPayload) => {
    const res = await apiClient.post<ApiResponse<PaymentResponse>>('/payments/initiate', payload);
    return res.data;
  },
};
