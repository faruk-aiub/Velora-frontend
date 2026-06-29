'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type InventoryItem = {
  product_variant_id: string;
  product_title: string;
  sku: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
};

export const createColumns = (
  onAdjustStock: (item: InventoryItem, action: 'increment' | 'decrement') => void
): ColumnDef<InventoryItem>[] => [
  {
    accessorKey: 'product_title',
    header: 'Product',
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue('sku')}</Badge>;
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Total Qty',
  },
  {
    accessorKey: 'reserved_quantity',
    header: 'Reserved',
  },
  {
    accessorKey: 'available_quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Available
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const available = row.getValue('available_quantity') as number;
      const isLow = available < 10;
      return (
        <span className={isLow ? 'text-red-600 font-bold' : ''}>
          {available}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Adjust Stock',
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAdjustStock(item, 'increment')} title="Add Stock">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAdjustStock(item, 'decrement')} title="Reduce Stock">
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
