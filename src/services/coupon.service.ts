import apiClient from '@/lib/axios';

export interface ValidateCouponPayload {
  code: string;
  cart_total: number;
}

export interface CouponValidationResult {
  discount_amount: number;
  final_total: number;
  type: 'PERCENT' | 'FIXED';
  value: number;
}

export const couponService = {
  validateCoupon: async (payload: ValidateCouponPayload) => {
    const res = await apiClient.post<{ message: string; data: CouponValidationResult }>('/coupons/validate', payload);
    return res.data;
  }
};
