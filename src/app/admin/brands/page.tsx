'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Brand, createColumns } from './columns';
import { BrandFormDialog } from './BrandFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function BrandsPage() {
 const queryClient = useQueryClient();
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
 const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-brands'],
 queryFn: async () => {
 const res = await api.get('/brands');
 return res.data.data as Brand[];
 },
 });

 const deleteMutation = useMutation({
 mutationFn: async (id: string) => {
 await api.delete(`/brands/${id}`);
 },
 onSuccess: () => {
 toast.success('Brand deleted successfully');
 queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
 setBrandToDelete(null);
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to delete brand');
 },
 });

 const handleEdit = (brand: Brand) => {
 setBrandToEdit(brand);
 setIsFormOpen(true);
 };

 const handleDelete = (brand: Brand) => {
 setBrandToDelete(brand);
 };

 const handleCreateNew = () => {
 setBrandToEdit(null);
 setIsFormOpen(true);
 };

 const columns = createColumns(handleEdit, handleDelete);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
 <p className="text-sm text-gray-500 mt-1">
 Manage your store's brands and their logos.
 </p>
 </div>
 <Button onClick={handleCreateNew} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">
 <Plus className="w-4 h-4 mr-2"/>
 Add Brand
 </Button>
 </div>

 <div>
 <DataTable
 columns={columns}
 data={data || []}
 searchKey="name"
 isLoading={isLoading}
 />
 </div>

 <BrandFormDialog
 open={isFormOpen}
 onOpenChange={setIsFormOpen}
 brandToEdit={brandToEdit}
 />

 <ConfirmDeleteModal
 isOpen={!!brandToDelete}
 onClose={() => setBrandToDelete(null)}
 onConfirm={() => brandToDelete && deleteMutation.mutate(brandToDelete.id)}
 title="Delete Brand"
 description={`Are you sure you want to delete"${brandToDelete?.name}"? This action cannot be undone.`}
 isLoading={deleteMutation.isPending}
 />
 </div>
 );
}
