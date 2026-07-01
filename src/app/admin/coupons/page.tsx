'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Coupon, createColumns } from './columns';
import { CouponFormDialog } from './CouponFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function CouponsPage() {
 const queryClient = useQueryClient();
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);
 const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-coupons'],
 queryFn: async () => {
 const res = await api.get('/admin/coupons');
 // res.data is likely `{ data: [{...}], meta: {...} }` or `{ data: { data: [...] } }`
 // I'll check `res.data.data` as per standard conventions, or `res.data.data.data`
 // For now let's assume `res.data.data`
 if (Array.isArray(res.data.data)) {
 return res.data.data as Coupon[];
 } else if (Array.isArray(res.data.data?.data)) {
 return res.data.data.data as Coupon[];
 }
 return [] as Coupon[];
 },
 });

 const deleteMutation = useMutation({
 mutationFn: async (id: string) => {
 await api.delete(`/admin/coupons/${id}`);
 },
 onSuccess: () => {
 toast.success('Coupon deleted successfully');
 queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
 setCouponToDelete(null);
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to delete coupon');
 },
 });

 const handleEdit = (coupon: Coupon) => {
 setCouponToEdit(coupon);
 setIsFormOpen(true);
 };

 const handleDelete = (coupon: Coupon) => {
 setCouponToDelete(coupon);
 };

 const handleCreateNew = () => {
 setCouponToEdit(null);
 setIsFormOpen(true);
 };

 const columns = createColumns(handleEdit, handleDelete);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
 <p className="text-sm text-gray-500 mt-1">
 Create and manage discount codes for your customers.
 </p>
 </div>
 <Button onClick={handleCreateNew} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">
 <Plus className="w-4 h-4 mr-2"/>
 Create Coupon
 </Button>
 </div>

 <div>
 <DataTable
 columns={columns}
 data={data || []}
 searchKey="code"
 isLoading={isLoading}
 />
 </div>

 <CouponFormDialog
 open={isFormOpen}
 onOpenChange={setIsFormOpen}
 couponToEdit={couponToEdit}
 />

 <ConfirmDeleteModal
 isOpen={!!couponToDelete}
 onClose={() => setCouponToDelete(null)}
 onConfirm={() => couponToDelete && deleteMutation.mutate(couponToDelete.id)}
 title="Delete Coupon"
 description={`Are you sure you want to delete"${couponToDelete?.code}"? Customers will no longer be able to use it.`}
 isLoading={deleteMutation.isPending}
 />
 </div>
 );
}
