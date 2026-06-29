'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Category, createColumns } from './columns';
import { CategoryFormDialog } from './CategoryFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data as Category[];
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage product categories and subcategories.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={data || []}
          searchKey="name"
          isLoading={isLoading}
        />
      </div>

      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categoryToEdit={categoryToEdit}
      />

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
