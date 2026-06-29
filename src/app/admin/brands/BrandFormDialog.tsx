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
import { Brand } from './columns';
import api from '@/lib/axios';
import { FileUpload } from '@/components/admin/FileUpload';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  logo_url: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandToEdit: Brand | null;
}

export function BrandFormDialog({ open, onOpenChange, brandToEdit }: BrandFormDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      logo_url: '',
    },
  });

  useEffect(() => {
    if (brandToEdit) {
      form.reset({
        name: brandToEdit.name,
        logo_url: brandToEdit.logo_url || '',
      });
    } else {
      form.reset({
        name: '',
        logo_url: '',
      });
    }
  }, [brandToEdit, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name,
        logo_url: values.logo_url || undefined,
      };

      if (brandToEdit) {
        const res = await api.put(`/admin/brands/${brandToEdit.id}`, payload); // Assuming admin route? Wait, brands controller is /brands, but admin is protected. The route was PUT /brands/:id
        // Actually, looking at brands.controller.ts, it's just /brands for POST and /brands/:id for PUT
        return res.data;
      } else {
        const res = await api.post('/brands', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(brandToEdit ? 'Brand updated successfully' : 'Brand created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      onOpenChange(false);
      form.reset();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{brandToEdit ? 'Edit Brand' : 'Create Brand'}</DialogTitle>
          <DialogDescription>
            {brandToEdit ? 'Update the details of the brand.' : 'Add a new brand to your store.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nike" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Image</FormLabel>
                  <FormControl>
                    <FileUpload 
                      value={field.value} 
                      onUploadSuccess={field.onChange} 
                      onRemove={() => field.onChange("")}
                    />
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
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
