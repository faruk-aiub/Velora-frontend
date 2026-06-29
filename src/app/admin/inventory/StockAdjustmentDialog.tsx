'use client';

import { useState } from 'react';
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
import api from '@/lib/axios';
import { InventoryItem } from './columns';

const formSchema = z.object({
  amount: z.any(),
});

type FormValues = z.infer<typeof formSchema>;

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  action: 'increment' | 'decrement' | null;
}

export function StockAdjustmentDialog({ open, onOpenChange, item, action }: StockAdjustmentDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!item || !action) return;
      
      const payload = { amount: Number(values.amount) };
      const endpoint = `/inventory/${item.product_variant_id}/${action}`;
      
      const res = await api.post(endpoint, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`Stock ${action === 'increment' ? 'added' : 'reduced'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
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
          <DialogTitle>
            {action === 'increment' ? 'Add Stock' : 'Reduce Stock'}
          </DialogTitle>
          <DialogDescription>
            {action === 'increment' ? 'Increase' : 'Decrease'} inventory for <strong>{item?.product_title}</strong> (SKU: {item?.sku}).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity to {action === 'increment' ? 'Add' : 'Remove'}</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
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
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
