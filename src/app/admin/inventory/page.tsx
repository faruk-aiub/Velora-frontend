'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { InventoryItem, createColumns } from './columns';
import { StockAdjustmentDialog } from './StockAdjustmentDialog';

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [actionType, setActionType] = useState<'increment' | 'decrement' | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const res = await api.get('/inventory/all');
      return res.data.data as InventoryItem[];
    },
  });

  const handleAdjustStock = (item: InventoryItem, action: 'increment' | 'decrement') => {
    setSelectedItem(item);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const columns = createColumns(handleAdjustStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage product stock levels across all variants.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={data || []}
          searchKey="product_title"
          isLoading={isLoading}
        />
      </div>

      <StockAdjustmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        action={actionType}
      />
    </div>
  );
}
