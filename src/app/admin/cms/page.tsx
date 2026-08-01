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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CMS & Banners</h1>
          <p className="text-gray-500">Manage your homepage banners and content.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#F9F0E6] text-[#B58A63] px-4 py-2 rounded-2xl font-bold">
            <Layout size={18} />
            {banners.length} Banners
          </div>
          <Button onClick={handleCreate} className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add Banner
          </Button>
        </div>
      </div>

      <Card className="rounded-[32px] border-none shadow-sm">
        <CardHeader>
          <CardTitle>Homepage Banners</CardTitle>
        </CardHeader>
        <CardContent>
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
