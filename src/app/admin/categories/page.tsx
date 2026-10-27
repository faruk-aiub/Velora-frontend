'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, FolderTree, Layers, GitFork, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { CategoryTree as Category } from '@/lib/categories';
import { createColumns } from './columns';
import { CategoryFormDialog } from './CategoryFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

type CategoryFilter = 'all' | 'root' | 'with_image';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories/tree');
      return (res.data?.data || []) as Category[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setCategoryToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });

  const items = data || [];

  // Summary Metrics
  const stats = useMemo(() => {
    let rootCount = 0;
    let subCount = 0;
    let withImage = 0;

    const traverse = (cats: Category[]) => {
      for (const cat of cats) {
        if (!cat.parent_id) {
          rootCount++;
        } else {
          subCount++;
        }
        if (cat.image_url) {
          withImage++;
        }
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children);
        }
      }
    };

    traverse(items);

    return {
      total: rootCount + subCount,
      root: rootCount,
      sub: subCount,
      withImage,
    };
  }, [items]);

  // Filtered categories
  const filteredItems = useMemo(() => {
    if (filter === 'with_image') {
      return items.filter((cat) => cat.image_url);
    }
    return items;
  }, [items, filter]);

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleCreateNew = () => {
    setCategoryToEdit(null);
    setIsFormOpen(true);
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
            {stats.total > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {stats.total} total categories
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Organize catalog hierarchy, root departments, and nested subcategories.
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
            Add Category
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
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
              Total Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-3">{stats.total}</div>
          <div className="text-xs text-gray-400 mt-1">All departments & sub-tiers</div>
        </div>

        {/* Root Departments */}
        <div
          onClick={() => setFilter('root')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'root'
              ? 'bg-blue-50/60 border-blue-500 shadow-md ring-1 ring-blue-500'
              : 'bg-white border-gray-100 hover:border-blue-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Root Departments
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-3">{stats.root}</div>
          <div className="text-xs text-blue-700/80 mt-1">Top-level categories</div>
        </div>

        {/* Subcategories */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Subcategories
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 mt-3">{stats.sub}</div>
          <div className="text-xs text-purple-700/80 mt-1">Nested catalog child groups</div>
        </div>

        {/* With Media / Banners */}
        <div
          onClick={() => setFilter('with_image')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'with_image'
              ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              With Media
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">{stats.withImage}</div>
          <div className="text-xs text-emerald-700/80 mt-1">Has thumbnail or banner</div>
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
          Hierarchy Tree ({stats.root} Roots)
        </button>
        <button
          type="button"
          onClick={() => setFilter('with_image')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'with_image'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          With Media ({stats.withImage})
        </button>
      </div>

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns as any}
          data={filteredItems}
          searchKey="name"
          isLoading={isLoading}
          getSubRows={(row) => row.children}
          defaultPageSize={10}
        />
      </div>

      {/* Create / Edit Dialog */}
      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categoryToEdit={categoryToEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => categoryToDelete && deleteMutation.mutate(categoryToDelete.id)}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? Products in this category will be orphaned or deleted based on your database cascade settings.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
