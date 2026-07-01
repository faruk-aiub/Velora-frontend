'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Review, createColumns } from './columns';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function ReviewsPage() {
 const queryClient = useQueryClient();
 const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

 const { data, isLoading } = useQuery({
 queryKey: ['admin-reviews'],
 queryFn: async () => {
 const res = await api.get('/admin/reviews');
 if (Array.isArray(res.data.data)) {
 return res.data.data as Review[];
 } else if (Array.isArray(res.data.data?.data)) {
 return res.data.data.data as Review[];
 }
 return [] as Review[];
 },
 });

 const deleteMutation = useMutation({
 mutationFn: async (id: string) => {
 await api.delete(`/admin/reviews/${id}`);
 },
 onSuccess: () => {
 toast.success('Review deleted successfully');
 queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
 setReviewToDelete(null);
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to delete review');
 },
 });

 const updateStatusMutation = useMutation({
 mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
 await api.put(`/admin/reviews/${id}/status`, { is_approved });
 },
 onSuccess: () => {
 toast.success('Review status updated');
 queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || 'Failed to update review status');
 },
 });

 const handleUpdateStatus = (review: Review, is_approved: boolean) => {
 updateStatusMutation.mutate({ id: review.id, is_approved });
 };

 const handleDelete = (review: Review) => {
 setReviewToDelete(review);
 };

 const columns = createColumns(handleUpdateStatus, handleDelete);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
 <p className="text-sm text-gray-500 mt-1">
 Moderate product reviews and customer feedback.
 </p>
 </div>
 </div>

 <div>
 <DataTable
 columns={columns}
 data={data || []}
 searchKey="comment"
 isLoading={isLoading}
 />
 </div>

 <ConfirmDeleteModal
 isOpen={!!reviewToDelete}
 onClose={() => setReviewToDelete(null)}
 onConfirm={() => reviewToDelete && deleteMutation.mutate(reviewToDelete.id)}
 title="Delete Review"
 description={`Are you sure you want to delete this review by ${reviewToDelete?.user?.full_name}?`}
 isLoading={deleteMutation.isPending}
 />
 </div>
 );
}
