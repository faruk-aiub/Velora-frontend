'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
};

export const createColumns = (
  onEdit: (brand: Brand) => void,
  onDelete: (brand: Brand) => void
): ColumnDef<Brand>[] => [
  {
    accessorKey: 'logo_url',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.getValue('logo_url') as string | null;
      return logoUrl ? (
        <div className="relative w-10 h-10 rounded overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <Image src={logoUrl} alt={row.getValue('name')} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-medium">
          N/A
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(brand)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Brand
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(brand)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
              <Trash className="w-4 h-4 mr-2" />
              Delete Brand
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
