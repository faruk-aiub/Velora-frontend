'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';
import { Coupon } from './columns';

const formSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  discount_type: z.enum(['PERCENT', 'FIXED']),
  discount_value: z.coerce.number().min(0, 'Must be positive'),
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
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      discount_type: 'PERCENT',
      discount_value: 0,
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
        expires_at: couponToEdit.expires_at ? new Date(couponToEdit.expires_at).toISOString().slice(0,16) : '',
      });
    } else if (open) {
      form.reset({
        code: '',
        discount_type: 'PERCENT',
        discount_value: 0,
        min_order_value: '',
        usage_limit: '',
        expires_at: '',
      });
    }
  }, [couponToEdit, open, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: any = {
        code: values.code,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
      };

      if (values.min_order_value !== '' && values.min_order_value !== undefined) {
        payload.min_order_value = values.min_order_value;
      }
      if (values.usage_limit !== '' && values.usage_limit !== undefined) {
        payload.usage_limit = values.usage_limit;
      }
      if (values.expires_at) {
        payload.expires_at = new Date(values.expires_at).toISOString();
      }

      if (couponToEdit) {
        // Backend doesn't currently expose PUT /admin/coupons/:id, we'll implement later or delete/recreate
        toast.info('Editing coupons is not fully supported on the backend yet.');
        return null;
      } else {
        const res = await api.post('/admin/coupons', payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      if (data) {
        toast.success(couponToEdit ? 'Coupon updated' : 'Coupon created');
        queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
        onOpenChange(false);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{couponToEdit ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SUMMER2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENT">Percentage</SelectItem>
                        <SelectItem value="FIXED">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_order_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Order Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Optional" {...field} />
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
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Optional" {...field} />
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
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Coupon'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
