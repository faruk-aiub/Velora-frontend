'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { User, createColumns } from './columns';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function UsersPage() {
 const queryClient = useQueryClient();
 const [userToDelete, setUserToDelete] = useState<User | null>(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-users'],
 queryFn: async () => {
 const res = await api.get('/users');
 // Pagination might be wrapped, adjust according to actual backend response
 if (Array.isArray(res.data.data)) {
 return res.data.data as User[];
 } else if (Array.isArray(res.data.data?.data)) {
 return res.data.data.data as User[];
 }
 return [] as User[];
 },
 });

 const deleteMutation = useMutation({
 mutationFn: async (id: string) => {
 await api.delete(`/users/${id}`);
 },
 onSuccess: () => {
 toast.success('User deleted successfully');
 queryClient.invalidateQueries({ queryKey: ['admin-users'] });
 setUserToDelete(null);
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to delete user');
 },
 });

 const handleDelete = (user: User) => {
 setUserToDelete(user);
 };

 const columns = createColumns(handleDelete);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Users</h1>
 <p className="text-sm text-gray-500 mt-1">
 View and manage customer accounts.
 </p>
 </div>
 </div>

 <div>
 <DataTable
 columns={columns}
 data={data || []}
 searchKey="email"
 isLoading={isLoading}
 />
 </div>

 <ConfirmDeleteModal
 isOpen={!!userToDelete}
 onClose={() => setUserToDelete(null)}
 onConfirm={() => userToDelete && deleteMutation.mutate(userToDelete.id)}
 title="Delete User"
 description={`Are you sure you want to delete"${userToDelete?.email}"? Their account will be deactivated and anonymized.`}
 isLoading={deleteMutation.isPending}
 />
 </div>
 );
}
