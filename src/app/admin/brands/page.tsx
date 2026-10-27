'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Brand, createColumns } from './columns';
import { BrandFormDialog } from './BrandFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

type BrandFilter = 'all' | 'with_logo' | 'without_logo';

export default function BrandsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<BrandFilter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: async () => {
      const res = await api.get('/brands');
      if (Array.isArray(res.data?.data)) {
        return res.data.data as Brand[];
      } else if (Array.isArray(res.data?.data?.data)) {
        return res.data.data.data as Brand[];
      }
      return [] as Brand[];
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

  const items = data || [];

  // Summary Metrics
  const stats = useMemo(() => {
    let withLogo = 0;
    let withoutLogo = 0;

    for (const item of items) {
      if (item.logo_url) {
        withLogo++;
      } else {
        withoutLogo++;
      }
    }

    return {
      total: items.length,
      withLogo,
      withoutLogo,
    };
  }, [items]);

  // Filtered Brands
  const filteredItems = useMemo(() => {
    if (filter === 'with_logo') {
      return items.filter((b) => !!b.logo_url);
    }
    if (filter === 'without_logo') {
      return items.filter((b) => !b.logo_url);
    }
    return items;
  }, [items, filter]);

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Brands Management</h1>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {items.length} total brands
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store's authorized brand partners, manufacturers, and logos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full px-4 h-10 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin text-gray-900' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 h-10 font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Brands */}
        <div
          onClick={() => setFilter('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Brands
            </span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-3">{stats.total}</div>
          <div className="text-xs text-gray-400 mt-1">All retail partnerships</div>
        </div>

        {/* With Official Logo */}
        <div
          onClick={() => setFilter('with_logo')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'with_logo'
              ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              With Logo
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">{stats.withLogo}</div>
          <div className="text-xs text-emerald-700/80 mt-1">Branded with graphic logo</div>
        </div>

        {/* Missing Logo */}
        <div
          onClick={() => setFilter('without_logo')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'without_logo'
              ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-500'
              : 'bg-white border-gray-100 hover:border-amber-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Missing Logo
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-3">{stats.withoutLogo}</div>
          <div className="text-xs text-amber-700/80 mt-1">
            {stats.withoutLogo > 0 ? 'Upload image suggested' : 'All logos uploaded'}
          </div>
        </div>

        {/* Brand Portfolio Health */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Coverage
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-3">
            {stats.total > 0 ? `${Math.round((stats.withLogo / stats.total) * 100)}%` : '100%'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Branding completeness score</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Brands ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setFilter('with_logo')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'with_logo'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          With Logo ({stats.withLogo})
        </button>
        <button
          type="button"
          onClick={() => setFilter('without_logo')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'without_logo'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Missing Logo ({stats.withoutLogo})
        </button>
      </div>

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={filteredItems}
          searchKey="name"
          isLoading={isLoading}
          defaultPageSize={10}
        />
      </div>

      {/* Create / Edit Dialog */}
      <BrandFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        brandToEdit={brandToEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        onConfirm={() => brandToDelete && deleteMutation.mutate(brandToDelete.id)}
        title="Delete Brand"
        description={`Are you sure you want to delete "${brandToDelete?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
