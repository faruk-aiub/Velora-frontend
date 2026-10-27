'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, MoreHorizontal, Trash, CheckCircle2, Clock, Eye } from 'lucide-react';
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
  base_price?: number;
  discount_percent?: number;
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
    accessorKey: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const images = row.getValue('images') as { url: string }[] | undefined;
      const imageUrl = images?.[0]?.url;
      return (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-xs shrink-0">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imageUrl} alt={row.original.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400 font-medium">No Img</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
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
      const product = row.original;
      return (
        <div className="max-w-[280px]">
          <div className="font-semibold text-gray-900 text-sm truncate" title={product.title}>
            {product.title}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {product.category?.name && (
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                {product.category.name}
              </span>
            )}
            {product.brand?.name && (
              <span className="text-xs text-gray-400 font-medium">
                • {product.brand.name}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as { name: string } | null;
      return (
        <span className="text-sm text-gray-600 font-medium">
          {category?.name || 'Uncategorized'}
        </span>
      );
    },
  },
  {
    accessorKey: 'base_price',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Price
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawPrice = row.getValue('base_price');
      const numPrice = Number(rawPrice) || 0;
      const discount = Number(row.original.discount_percent) || 0;

      if (discount > 0) {
        const discountedPrice = numPrice * (1 - discount / 100);
        return (
          <div>
            <div className="font-bold text-gray-900 text-sm">
              ৳{discountedPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 line-through">
              ৳{numPrice.toFixed(2)}
            </div>
          </div>
        );
      }

      return (
        <div className="font-bold text-gray-900 text-sm">
          ৳{numPrice.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: 'discount_percent',
    header: 'Discount',
    cell: ({ row }) => {
      const discount = Number(row.getValue('discount_percent')) || 0;
      if (discount > 0) {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {discount}% OFF
          </span>
        );
      }
      return <span className="text-xs text-gray-400">None</span>;
    },
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ row }) => {
      const brand = row.getValue('brand') as { name: string } | null;
      return (
        <span className="text-sm text-gray-600 font-medium">
          {brand?.name || 'Generic'}
        </span>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      if (isActive) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Active
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          Draft
        </span>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            className="h-8 px-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-xs flex items-center gap-1"
            title="Edit Product"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="sr-only">More options</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-2xl shadow-xl border border-gray-100 bg-white">
              <DropdownMenuLabel className="px-2.5 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Product Options
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEdit(product)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 mr-2 text-gray-500" />
                View on Store
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                onClick={() => onDelete(product)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5 mr-2 text-red-600" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
