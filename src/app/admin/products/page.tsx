'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Product, createColumns } from './columns';
import { ProductFormDialog } from './ProductFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function ProductsPage() {
 const queryClient = useQueryClient();
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [productToEdit, setProductToEdit] = useState<Product | null>(null);
 const [productToDelete, setProductToDelete] = useState<Product | null>(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-products'],
 queryFn: async () => {
 const res = await api.get('/products/admin/list');
 return res.data.data as Product[];
 },
 });

 const deleteMutation = useMutation({
 mutationFn: async (id: string) => {
 await api.delete(`/products/${id}`);
 },
 onSuccess: () => {
 toast.success('Product deleted successfully');
 queryClient.invalidateQueries({ queryKey: ['admin-products'] });
 setProductToDelete(null);
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to delete product');
 },
 });

 const handleEdit = (product: Product) => {
 setProductToEdit(product);
 setIsFormOpen(true);
 };

 const handleDelete = (product: Product) => {
 setProductToDelete(product);
 };

 const handleCreateNew = () => {
 setProductToEdit(null);
 setIsFormOpen(true);
 };

 const columns = createColumns(handleEdit, handleDelete);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Products</h1>
 <p className="text-sm text-gray-500 mt-1">
 Manage your store's products, details, and status.
 </p>
 </div>
 <Button onClick={handleCreateNew} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">
 <Plus className="w-4 h-4 mr-2"/>
 Add Product
 </Button>
 </div>

 <div>
 <DataTable
 columns={columns}
 data={data || []}
 searchKey="title"
 isLoading={isLoading}
 />
 </div>

 <ProductFormDialog
 open={isFormOpen}
 onOpenChange={setIsFormOpen}
 productToEdit={productToEdit}
 />

 <ConfirmDeleteModal
 isOpen={!!productToDelete}
 onClose={() => setProductToDelete(null)}
 onConfirm={() => productToDelete && deleteMutation.mutate(productToDelete.id)}
 title="Delete Product"
 description={`Are you sure you want to delete"${productToDelete?.title}"along with its variants and images? This action cannot be undone.`}
 isLoading={deleteMutation.isPending}
 />
 </div>
 );
}
