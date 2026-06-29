'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export type Product = {
  id: string;
  title: string;
  slug: string;
  is_active: boolean;
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  images?: { id: string; url: string; sort_order: number }[];
  created_at: string;
};

export const createColumns = (
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as { name: string } | null;
      return <div>{category?.name || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ row }) => {
      const brand = row.getValue('brand') as { name: string } | null;
      return <div>{brand?.name || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-600' : ''}>
          {isActive ? 'Active' : 'Draft'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
              <Trash className="w-4 h-4 mr-2" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
