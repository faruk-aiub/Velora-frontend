'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, SlidersHorizontal, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type InventoryItem = {
  product_variant_id: string;
  product_id?: string;
  product_title: string;
  sku: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  price?: number;
  image_url?: string | null;
  category_name?: string | null;
};

export const createColumns = (
  onOpenAdjustModal: (item: InventoryItem) => void
): ColumnDef<InventoryItem>[] => [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string | undefined;
      return (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-xs shrink-0">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imageUrl} alt={row.original.product_title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400 font-medium">No Img</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'product_title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Product Details
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="max-w-[280px]">
          <div className="font-semibold text-gray-900 text-sm truncate" title={item.product_title}>
            {item.product_title}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {item.category_name && (
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                {item.category_name}
              </span>
            )}
            {item.price !== undefined && item.price !== null && (
              <span className="text-xs font-semibold text-gray-700">
                ৳{Number(item.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono text-xs text-gray-600 bg-gray-50 border-gray-200">
          {row.getValue('sku')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Total Stock
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="font-semibold text-gray-900 text-sm">
          {row.getValue('quantity')} <span className="text-xs text-gray-400 font-normal">units</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'reserved_quantity',
    header: 'Reserved',
    cell: ({ row }) => {
      const reserved = Number(row.getValue('reserved_quantity')) || 0;
      return reserved > 0 ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          {reserved} pending
        </span>
      ) : (
        <span className="text-xs text-gray-400">0</span>
      );
    },
  },
  {
    accessorKey: 'available_quantity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Available
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const available = Number(row.getValue('available_quantity')) || 0;
      if (available <= 0) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Out of Stock
          </span>
        );
      }
      if (available < 10) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Low Stock ({available})
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {available} in stock
        </span>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Action',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenAdjustModal(item)}
          className="h-9 px-3 rounded-xl border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Adjust Stock
        </Button>
      );
    },
  },
];
