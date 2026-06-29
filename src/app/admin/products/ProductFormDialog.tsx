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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from './columns';
import api from '@/lib/axios';
import { FileUpload } from '@/components/admin/FileUpload';
import { Trash } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  brand_id: z.string().optional().or(z.literal('none')),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit: Product | null;
}

export function ProductFormDialog({ open, onOpenChange, productToEdit }: ProductFormDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ id?: string, url: string, sort_order: number }[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
    enabled: open,
  });

  const { data: brands } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: async () => {
      const res = await api.get('/brands');
      return res.data.data;
    },
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      brand_id: 'none',
      is_active: true,
    },
  });

  useEffect(() => {
    if (productToEdit) {
      form.reset({
        title: productToEdit.title,
        description: (productToEdit as any).description || '',
        category_id: productToEdit.category?.id || '',
        brand_id: productToEdit.brand?.id || 'none',
        is_active: productToEdit.is_active,
      });
      // Fetch full product details including images
      api.get(`/products/${productToEdit.slug}`).then(res => {
        setImages(res.data.data.images || []);
      });
    } else {
      form.reset({
        title: '',
        description: '',
        category_id: '',
        brand_id: 'none',
        is_active: true,
      });
      setImages([]);
    }
  }, [productToEdit, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        category_id: values.category_id,
        brand_id: values.brand_id === 'none' ? undefined : values.brand_id,
        is_active: values.is_active,
      };

      let productId = productToEdit?.id;

      if (productToEdit) {
        await api.put(`/products/${productToEdit.id}`, payload);
      } else {
        const res = await api.post('/products', payload);
        productId = res.data.data.id;
      }

      // Handle un-uploaded images (those without ID)
      if (productId) {
        const newImages = images.filter(img => !img.id);
        for (const img of newImages) {
          await api.post(`/products/${productId}/images`, {
            url: img.url,
            sort_order: img.sort_order,
          });
        }
      }
    },
    onSuccess: () => {
      toast.success(productToEdit ? 'Product updated successfully' : 'Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onOpenChange(false);
      form.reset();
      setImages([]);
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

  const handleImageUploaded = (url: string) => {
    setImages([...images, { url, sort_order: images.length }]);
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id) {
      try {
        await api.delete(`/products/images/${img.id}`);
        toast.success("Image removed");
      } catch (e: any) {
        toast.error("Failed to remove image");
        return;
      }
    }
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productToEdit ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogDescription>
            {productToEdit ? 'Update product details and manage images.' : 'Add a new product entry.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Form {...form}>
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Velvet Sofa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product description..." {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="brand_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Brand</SelectItem>
                          {brands?.map((brand: any) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Make this product visible in the store.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Right Side: Images */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Product Images</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="col-span-1">
                <FileUpload onUploadSuccess={handleImageUploaded} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
