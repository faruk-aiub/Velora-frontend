'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FolderTree, Layers, Tag, Image as ImageIcon } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from './columns';
import api from '@/lib/axios';
import { flattenCategoryTree, FlatCategory } from '@/lib/categories';
import { FileUpload } from '@/components/admin/FileUpload';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image_url: z.string().optional().or(z.literal('')),
  parent_id: z.string().optional().or(z.literal('none')),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit: Category | null;
}

export function CategoryFormDialog({ open, onOpenChange, categoryToEdit }: CategoryFormDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useQuery<FlatCategory[]>({
    queryKey: ['admin-categories-flat'],
    queryFn: async () => {
      const res = await api.get('/categories/tree');
      return flattenCategoryTree(res.data.data);
    },
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      image_url: '',
      parent_id: 'none',
    },
  });

  useEffect(() => {
    if (categoryToEdit && open) {
      form.reset({
        name: categoryToEdit.name,
        image_url: categoryToEdit.image_url || '',
        parent_id: categoryToEdit.parent_id || 'none',
      });
    } else if (open) {
      form.reset({
        name: '',
        image_url: '',
        parent_id: 'none',
      });
    }
  }, [categoryToEdit, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name,
        image_url: values.image_url === '' ? '' : values.image_url,
        parent_id: values.parent_id === 'none' ? '' : values.parent_id,
      };

      if (categoryToEdit) {
        const res = await api.put(`/categories/${categoryToEdit.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/categories', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(categoryToEdit ? 'Category updated successfully' : 'Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
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
  const parentWatch = form.watch('parent_id') || 'none';
  const isRoot = parentWatch === 'none' || !parentWatch;
  const slugPreview = nameWatch
    ? nameWatch
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : 'auto-generated';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl bg-white border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4 text-gray-700" />
            Category Management
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
            {categoryToEdit ? categoryToEdit.name : 'Create New Category'}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 mt-1">
            {categoryToEdit
              ? 'Update category details, taxonomy level, and banner graphics.'
              : 'Add a new root department or nested subcategory to your store.'}
          </DialogDescription>
        </DialogHeader>

        {/* Live Snapshot Card */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mt-2">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Category Type
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 mt-1">
              {isRoot ? (
                <>
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Root Department</span>
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700">Subcategory</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              URL Slug
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
                  <FormLabel className="text-xs font-bold text-gray-700">Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Helmets & Riding Gear"
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
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700">
                    Parent Department (Optional)
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-medium focus:bg-white">
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 rounded-2xl p-1 bg-white border border-gray-100 shadow-xl">
                      <SelectItem value="none" className="rounded-xl text-xs font-semibold text-gray-700">
                        None (Root Department)
                      </SelectItem>
                      {categories
                        ?.filter((c) => c.id !== categoryToEdit?.id)
                        .map((category: FlatCategory) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="rounded-xl text-xs font-medium text-gray-700"
                          >
                            {category.displayName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700">
                    Banner / Thumbnail Image
                  </FormLabel>
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
                {isSubmitting ? 'Saving...' : categoryToEdit ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
