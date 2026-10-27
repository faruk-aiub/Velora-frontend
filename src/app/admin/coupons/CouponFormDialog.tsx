'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Ticket, Percent, Banknote, Calendar, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Coupon } from './columns';
import api from '@/lib/axios';

const formSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  discount_type: z.enum(['PERCENT', 'FIXED']),
  discount_value: z.coerce.number().min(0.01, 'Discount value must be greater than 0'),
  min_order_value: z.coerce.number().min(0).optional().or(z.literal('')),
  usage_limit: z.coerce.number().min(1).optional().or(z.literal('')),
  expires_at: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponToEdit: Coupon | null;
}

export function CouponFormDialog({ open, onOpenChange, couponToEdit }: CouponFormDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: '',
      discount_type: 'PERCENT',
      discount_value: 10,
      min_order_value: '',
      usage_limit: '',
      expires_at: '',
    },
  });

  useEffect(() => {
    if (couponToEdit && open) {
      form.reset({
        code: couponToEdit.code,
        discount_type: couponToEdit.discount_type,
        discount_value: couponToEdit.discount_value,
        min_order_value: couponToEdit.min_order_value ?? '',
        usage_limit: couponToEdit.usage_limit ?? '',
        expires_at: couponToEdit.expires_at
          ? new Date(couponToEdit.expires_at).toISOString().slice(0, 16)
          : '',
      });
    } else if (open) {
      form.reset({
        code: '',
        discount_type: 'PERCENT',
        discount_value: 10,
        min_order_value: '',
        usage_limit: '',
        expires_at: '',
      });
    }
  }, [couponToEdit, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: any = {
        code: values.code.toUpperCase().trim(),
        discount_type: values.discount_type,
        discount_value: Number(values.discount_value),
      };

      if (values.min_order_value !== '' && values.min_order_value !== undefined) {
        payload.min_order_value = Number(values.min_order_value);
      }
      if (values.usage_limit !== '' && values.usage_limit !== undefined) {
        payload.usage_limit = Number(values.usage_limit);
      }
      if (values.expires_at) {
        payload.expires_at = new Date(values.expires_at).toISOString();
      }

      if (couponToEdit) {
        const res = await api.put(`/admin/coupons/${couponToEdit.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/admin/coupons', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(couponToEdit ? 'Coupon updated successfully' : 'Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  const discountType = form.watch('discount_type');
  const codeWatch = form.watch('code') || 'YOUR_CODE';
  const valWatch = form.watch('discount_value') || 0;
  const minOrderWatch = form.watch('min_order_value');

  const handleSelectPreset = (val: number) => {
    form.setValue('discount_value', val);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl bg-white border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4 text-gray-700" />
            Promotions & Vouchers
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
            {couponToEdit ? `Edit Coupon: ${couponToEdit.code}` : 'Create Promotional Coupon'}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 mt-1">
            {couponToEdit
              ? 'Update discount rate, redemption thresholds, and expiration schedule.'
              : 'Launch a new customer incentive code for checkout cart discounts.'}
          </DialogDescription>
        </DialogHeader>

        {/* Live Snapshot Card */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mt-2 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Voucher Preview
            </div>
            <div className="font-mono font-bold text-sm text-gray-900 mt-0.5 tracking-wider uppercase">
              {codeWatch}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                discountType === 'PERCENT'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {discountType === 'PERCENT' ? (
                <>
                  <Percent className="w-3 h-3 text-purple-600" />
                  {valWatch}% OFF
                </>
              ) : (
                <>
                  <Banknote className="w-3 h-3 text-blue-600" />
                  ৳{Number(valWatch).toFixed(2)} Flat OFF
                </>
              )}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Discount Type Selector Buttons */}
            <div>
              <label className="text-xs font-bold text-gray-700">Discount Calculation Mode</label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => form.setValue('discount_type', 'PERCENT')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    discountType === 'PERCENT'
                      ? 'border-purple-500 bg-purple-50/50 text-purple-700 ring-2 ring-purple-500/20'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Percent className="w-4 h-4 text-purple-600" />
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('discount_type', 'FIXED')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    discountType === 'FIXED'
                      ? 'border-blue-500 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-blue-600" />
                  Fixed Amount (৳)
                </button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700">Coupon Promo Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. VELORA20, SUMMER50"
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-mono font-bold tracking-wider uppercase focus:bg-white"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">
                      {discountType === 'PERCENT' ? 'Percentage Rate (%)' : 'Deduction Amount (৳)'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={discountType === 'PERCENT' ? '1' : '0.01'}
                        min="0"
                        max={discountType === 'PERCENT' ? '100' : undefined}
                        className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-semibold focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] font-semibold text-gray-400">Presets:</span>
                {discountType === 'PERCENT'
                  ? [5, 10, 15, 20, 25, 50].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSelectPreset(rate)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                          Number(valWatch) === rate
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))
                  : [100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                          Number(valWatch) === amt
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_order_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">
                      Min Order Value (৳)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-medium focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usage_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">Usage Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="∞ Unlimited"
                        className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-medium focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700">
                    Expiration Date & Time (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-medium focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-full px-5 h-10 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 h-10 bg-gray-900 text-white hover:bg-gray-800 font-bold shadow-sm"
              >
                {isSubmitting ? 'Saving...' : couponToEdit ? 'Save Changes' : 'Create Coupon'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
