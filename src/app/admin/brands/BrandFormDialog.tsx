'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Award, CheckCircle2, Clock, Globe } from 'lucide-react';
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
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      logo_url: '',
    },
  });

  useEffect(() => {
    if (brandToEdit && open) {
      form.reset({
        name: brandToEdit.name,
        logo_url: brandToEdit.logo_url || '',
      });
    } else if (open) {
      form.reset({
        name: '',
        logo_url: '',
      });
    }
  }, [brandToEdit, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name,
        logo_url: values.logo_url || undefined,
      };

      if (brandToEdit) {
        const res = await api.put(`/brands/${brandToEdit.id}`, payload);
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
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  const nameWatch = form.watch('name') || '';
  const logoWatch = form.watch('logo_url');
  const slugPreview = nameWatch
    ? nameWatch
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : 'auto-generated';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-24px)] sm:max-w-[480px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-gray-700" />
            Brand Management
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
            {brandToEdit ? brandToEdit.name : 'Register Brand Partner'}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 mt-1">
            {brandToEdit
              ? 'Update brand profile, authorized retailer naming, and official logo.'
              : 'Add an authorized brand manufacturer or retail partner to your store.'}
          </DialogDescription>
        </DialogHeader>

        {/* Live Snapshot Card */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mt-2">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Logo Status
            </div>
            <div className="flex items-center gap-1.5 font-bold text-xs mt-1">
              {logoWatch ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Logo Uploaded
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  No Logo
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Store URL Slug
            </div>
            <div className="font-mono text-xs font-semibold text-gray-700 mt-1 truncate">
              {slugPreview}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700">Brand Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Zenith, Nova, Sony"
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
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700">Brand Logo Graphic</FormLabel>
                  <FormControl>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3">
                      <FileUpload
                        value={field.value}
                        onUploadSuccess={field.onChange}
                        onRemove={() => field.onChange('')}
                      />
                    </div>
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
                {isSubmitting ? 'Saving...' : brandToEdit ? 'Save Changes' : 'Register Brand'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
