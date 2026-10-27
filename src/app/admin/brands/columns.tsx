'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, MoreHorizontal, Trash, Award, Calendar, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

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
      const name = (row.getValue('name') as string) || 'Brand';
      return (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-xs shrink-0">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 font-bold text-xs uppercase">
              {name.slice(0, 2)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Brand Name
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div>
          <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-gray-400" />
            <span>{brand.name}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Brand Partner</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs text-gray-600 bg-gray-50 border-gray-200">
        {row.getValue('slug')}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Registered Date
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(brand)}
            className="h-8 px-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
            title="Edit Brand"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-2xl shadow-xl border border-gray-100 bg-white">
              <DropdownMenuLabel className="px-2.5 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Brand Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEdit(brand)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Edit Brand
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`/shop?brand=${brand.slug}`, '_blank')}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 mr-2 text-gray-500" />
                View Brand in Store
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                onClick={() => onDelete(brand)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5 mr-2 text-red-600" />
                Delete Brand
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
