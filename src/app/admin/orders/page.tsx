'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Order, createColumns } from './columns';

export default function OrdersPage() {
 const queryClient = useQueryClient();

 const { data, isLoading } = useQuery({
 queryKey: ['admin-orders'],
 queryFn: async () => {
 const res = await api.get('/admin/orders');
 if (Array.isArray(res.data.data)) {
 return res.data.data as Order[];
 } else if (Array.isArray(res.data.data?.data)) {
 return res.data.data.data as Order[];
 }
 return [] as Order[];
 },
 refetchInterval: 5000,
 });

 const updateStatusMutation = useMutation({
 mutationFn: async ({ id, status }: { id: string; status: string }) => {
 await api.put(`/admin/orders/${id}/status`, { status });
 },
 onSuccess: () => {
 toast.success('Order status updated');
 queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to update order status');
 },
 });

 const handleUpdateStatus = (order: Order, status: string) => {
 updateStatusMutation.mutate({ id: order.id, status });
 };

 const columns = createColumns(handleUpdateStatus);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
 <p className="text-sm text-gray-500 mt-1">
 View and manage customer orders and fulfillments.
 </p>
 </div>
 </div>

 <div>
 <DataTable
 columns={columns}
 data={data || []}
 searchKey="order_number"
 isLoading={isLoading}
 />
 </div>
 </div>
 );
}
