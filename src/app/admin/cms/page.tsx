'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { createColumns, type Banner } from './columns';
import { BannerFormDialog } from './BannerFormDialog';

export default function CMSPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);

  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['adminBanners'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/banners');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/cms/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      toast.success('Banner deleted successfully');
    },
    onError: () => toast.error('Failed to delete banner'),
  });

  const handleEdit = (banner: Banner) => {
    setBannerToEdit(banner);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    setBannerToEdit(null);
    setIsDialogOpen(true);
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">CMS & Banners</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your homepage banners and content.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[#F9F0E6] text-[#B58A63] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm">
            <Layout size={16} />
            {banners.length} Banners
          </div>
          <Button onClick={handleCreate} className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm font-bold flex-1 sm:flex-none justify-center shadow-sm">
            <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add Banner
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-[32px] border-none shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold">Homepage Banners</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <DataTable
            columns={columns}
            data={banners}
            searchKey="title"
            loading={isLoading}
          />
        </CardContent>
      </Card>

      <BannerFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        bannerToEdit={bannerToEdit} 
      />
    </div>
  );
}
