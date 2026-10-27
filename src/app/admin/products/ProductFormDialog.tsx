'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Package,
  Trash,
  Tag,
  CheckCircle2,
  Clock,
  ImageIcon,
  Plus,
} from 'lucide-react';
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
import api from '@/lib/axios';
import { flattenCategoryTree, FlatCategory } from '@/lib/categories';
import { FileUpload } from '@/components/admin/FileUpload';
import { Product } from './columns';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  discount_percent: z.coerce.number().min(0).max(100).optional(),
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
  const [images, setImages] = useState<{ id?: string; url: string; sort_order: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-flat'],
    queryFn: async () => {
      const res = await api.get('/categories/tree');
      return flattenCategoryTree(res.data.data);
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
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      base_price: 0,
      discount_percent: 0,
      category_id: '',
      brand_id: 'none',
      is_active: true,
    },
  });

  useEffect(() => {
    if (productToEdit && open) {
      form.reset({
        title: productToEdit.title,
        description: (productToEdit as any).description || '',
        base_price: (productToEdit as any).base_price || 0,
        discount_percent: (productToEdit as any).discount_percent || 0,
        category_id: productToEdit.category?.id || '',
        brand_id: productToEdit.brand?.id || 'none',
        is_active: productToEdit.is_active,
      });

      api.get(`/products/admin/${productToEdit.id}`).then((res) => {
        setImages(res.data.data.images || []);
        if (res.data.data.base_price !== undefined) {
          form.setValue('base_price', res.data.data.base_price);
        }
        if (res.data.data.discount_percent !== undefined) {
          form.setValue('discount_percent', res.data.data.discount_percent);
        }
      });
    } else if (open) {
      form.reset({
        title: '',
        description: '',
        base_price: 0,
        discount_percent: 0,
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
        base_price: values.base_price !== undefined ? Number(values.base_price) : 0,
        discount_percent: values.discount_percent !== undefined ? Number(values.discount_percent) : 0,
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

      if (productId) {
        const newImages = images.filter((img) => !img.id);
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
    },
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
        toast.success('Image removed');
      } catch {
        toast.error('Failed to remove image');
        return;
      }
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const titleWatch = form.watch('title') || 'Product Title';
  const priceWatch = Number(form.watch('base_price')) || 0;
  const discountWatch = Number(form.watch('discount_percent')) || 0;
  const isActiveWatch = form.watch('is_active');
  const finalPrice = discountWatch > 0 ? priceWatch * (1 - discountWatch / 100) : priceWatch;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-3xl bg-white border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-gray-700" />
            Catalog & Inventory Product
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
            {productToEdit ? `Edit: ${productToEdit.title}` : 'Add New Product'}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 mt-1">
            {productToEdit
              ? 'Update catalog specifications, retail pricing, discounts, and visual media.'
              : 'Register a new store product with category, brand, and media gallery.'}
          </DialogDescription>
        </DialogHeader>

        {/* Live Snapshot Card */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mt-2 shrink-0">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Effective Price
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-bold text-base text-gray-900">৳{finalPrice.toFixed(2)}</span>
              {discountWatch > 0 && (
                <span className="text-xs text-gray-400 line-through">৳{priceWatch.toFixed(2)}</span>
              )}
            </div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Store Visibility
            </div>
            <div className="mt-1">
              {isActiveWatch ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-200 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3 h-3 text-gray-500" />
                  Draft
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Media Gallery
            </div>
            <div className="font-bold text-sm text-gray-900 mt-1 flex items-center justify-end gap-1">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span>{images.length} photos</span>
            </div>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <div className="overflow-y-auto flex-1 pr-1 pb-2 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form {...form}>
              <form id="product-form" onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                <FormField
                  control={form.control as any}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">Product Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Leather Jacket, Helmets"
                          className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-medium focus:bg-white"
                          {...field}
                        />
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
                      <FormLabel className="text-xs font-bold text-gray-700">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed product highlights..."
                          className="min-h-[90px] rounded-xl bg-gray-50 border-gray-200 text-sm focus:bg-white resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control as any}
                    name="base_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-gray-700">Base Price (৳)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-semibold focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="discount_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-gray-700">Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            className="h-11 rounded-xl bg-gray-50 border-gray-200 text-sm font-semibold focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control as any}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-gray-700">Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs font-medium focus:bg-white">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 rounded-2xl p-1 bg-white border border-gray-100 shadow-xl">
                            {categories?.map((cat: FlatCategory) => (
                              <SelectItem key={cat.id} value={cat.id} className="rounded-xl text-xs font-medium">
                                {cat.displayName}
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
                        <FormLabel className="text-xs font-bold text-gray-700">Brand</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs font-medium focus:bg-white">
                              <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 rounded-2xl p-1 bg-white border border-gray-100 shadow-xl">
                            <SelectItem value="none" className="rounded-xl text-xs font-semibold text-gray-500">
                              No Brand
                            </SelectItem>
                            {brands?.map((brand: any) => (
                              <SelectItem key={brand.id} value={brand.id} className="rounded-xl text-xs font-medium">
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
                    <FormItem className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div>
                        <FormLabel className="text-xs font-bold text-gray-900">Active Visibility</FormLabel>
                        <FormDescription className="text-[11px] text-gray-500 mt-0.5">
                          Make this product instantly purchasable in store.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* Right Column: Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Product Images</span>
                <span className="text-[11px] text-gray-400 font-medium">{images.length} photos</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group rounded-2xl overflow-hidden border border-gray-200/60 aspect-square shadow-xs bg-gray-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-md"
                        onClick={() => removeImage(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="col-span-2">
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-3">
                    <FileUpload onUploadSuccess={handleImageUploaded} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
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
            form="product-form"
            disabled={isSubmitting}
            className="rounded-full px-6 h-10 bg-gray-900 text-white hover:bg-gray-800 font-bold shadow-sm"
          >
            {isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
