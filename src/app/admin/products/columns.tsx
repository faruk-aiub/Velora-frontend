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
 base_price?: number;
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
    <div className="w-10 h-10 rounded overflow-hidden bg-zinc-100 flex items-center justify-center">
    {imageUrl ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
    ) : (
      <span className="text-xs text-zinc-400">No Img</span>
    )}
    </div>
  );
  }
  },
 {
 accessorKey: 'title',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 >
 Title
 <ArrowUpDown className="ml-2 h-4 w-4"/>
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
 accessorKey: 'base_price',
 header: 'Price',
 cell: ({ row }) => {
 const price = row.getValue('base_price') as number;
 return <div>${price !== undefined ? price.toFixed(2) : '0.00'}</div>;
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
 <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4"/>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Actions</DropdownMenuLabel>
 <DropdownMenuItem onClick={() => onEdit(product)}>
 <Edit className="w-4 h-4 mr-2"/>
 Edit Product
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
 <Trash className="w-4 h-4 mr-2"/>
 Delete Product
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
