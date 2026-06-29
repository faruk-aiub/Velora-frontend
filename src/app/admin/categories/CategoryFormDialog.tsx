'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from './columns';
import api from '@/lib/axios';
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

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data as Category[];
    },
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image_url: '',
      parent_id: 'none',
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      form.reset({
        name: categoryToEdit.name,
        image_url: categoryToEdit.image_url || '',
        parent_id: categoryToEdit.parent_id || 'none',
      });
    } else {
      form.reset({
        name: '',
        image_url: '',
        parent_id: 'none',
      });
    }
  }, [categoryToEdit, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name,
        image_url: values.image_url || undefined,
        parent_id: values.parent_id === 'none' ? undefined : values.parent_id,
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
          <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogDescription>
            {categoryToEdit ? 'Update the details of the category.' : 'Add a new category to your store.'}
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
                    <Input placeholder="e.g. Smartphones" {...field} />
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
                  <FormLabel>Parent Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Root Category)</SelectItem>
                      {categories
                        ?.filter(c => c.id !== categoryToEdit?.id) // Prevent self-referencing
                        .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
                  <FormLabel>Category Image</FormLabel>
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
