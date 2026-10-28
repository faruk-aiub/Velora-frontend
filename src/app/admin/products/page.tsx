'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Package, CheckCircle2, Clock, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Product, createColumns } from './columns';
import { ProductFormDialog } from './ProductFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

type ProductFilter = 'all' | 'active' | 'draft' | 'discounted';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/products/admin/list?limit=10000');
      if (Array.isArray(res.data?.data)) {
        return res.data.data as Product[];
      } else if (Array.isArray(res.data?.data?.data)) {
        return res.data.data.data as Product[];
      }
      return [] as Product[];
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

  const items = data || [];

  // Summary Metrics
  const stats = useMemo(() => {
    let active = 0;
    let draft = 0;
    let discounted = 0;

    for (const item of items) {
      if (item.is_active) {
        active++;
      } else {
        draft++;
      }

      if (Number(item.discount_percent) > 0) {
        discounted++;
      }
    }

    return {
      total: items.length,
      active,
      draft,
      discounted,
    };
  }, [items]);

  // Filtered items based on quick filter tab
  const filteredItems = useMemo(() => {
    if (productFilter === 'active') {
      return items.filter((item) => item.is_active);
    }
    if (productFilter === 'draft') {
      return items.filter((item) => !item.is_active);
    }
    if (productFilter === 'discounted') {
      return items.filter((item) => Number(item.discount_percent) > 0);
    }
    return items;
  }, [items, productFilter]);

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products Management</h1>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {items.length} total
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your store catalog, pricing, stock visibility, and details.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full px-3.5 sm:px-4 h-9 sm:h-10 border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${isFetching ? 'animate-spin text-gray-900' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Products */}
        <div
          onClick={() => setProductFilter('all')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            productFilter === 'all'
              ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 mt-2 sm:mt-3 truncate">{stats.total}</div>
          <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">All catalog items</div>
        </div>

        {/* Active Products */}
        <div
          onClick={() => setProductFilter('active')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            productFilter === 'active'
              ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Active in Store
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 mt-2 sm:mt-3 truncate">{stats.active}</div>
          <div className="text-[11px] sm:text-xs text-emerald-700/80 mt-0.5 sm:mt-1 truncate">Live & visible</div>
        </div>

        {/* Draft / Inactive */}
        <div
          onClick={() => setProductFilter('draft')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            productFilter === 'draft'
              ? 'bg-slate-100 border-gray-800 shadow-md ring-1 ring-gray-800'
              : 'bg-white border-gray-100 hover:border-gray-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Draft / Hidden
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-800 mt-2 sm:mt-3 truncate">{stats.draft}</div>
          <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
            {stats.draft > 0 ? 'Not published' : 'All published'}
          </div>
        </div>

        {/* On Sale / Discounted */}
        <div
          onClick={() => setProductFilter('discounted')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            productFilter === 'discounted'
              ? 'bg-purple-50/60 border-purple-500 shadow-md ring-1 ring-purple-500'
              : 'bg-white border-gray-100 hover:border-purple-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-purple-700 uppercase tracking-wider">
              On Sale / Deals
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-purple-600 mt-2 sm:mt-3 truncate">{stats.discounted}</div>
          <div className="text-[11px] sm:text-xs text-purple-700/80 mt-0.5 sm:mt-1 truncate">Active discounts</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 overscroll-x-contain">
        <button
          type="button"
          onClick={() => setProductFilter('all')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            productFilter === 'all'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Products ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setProductFilter('active')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            productFilter === 'active'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active ({stats.active})
        </button>
        <button
          type="button"
          onClick={() => setProductFilter('draft')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            productFilter === 'draft'
              ? 'bg-gray-800 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Draft ({stats.draft})
        </button>
        <button
          type="button"
          onClick={() => setProductFilter('discounted')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            productFilter === 'discounted'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          On Sale ({stats.discounted})
        </button>
      </div>

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={filteredItems}
          searchKey="title"
          isLoading={isLoading}
          defaultPageSize={10}
        />
      </div>

      {/* Create / Edit Dialog */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        productToEdit={productToEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => productToDelete && deleteMutation.mutate(productToDelete.id)}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.title}" along with its variants and images? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
