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

export type Category = {
 id: string;
 name: string;
 slug: string;
 image_url: string | null;
 parent_id: string | null;
 created_at: string;
};

export const createColumns = (
 onEdit: (category: Category) => void,
 onDelete: (category: Category) => void
): ColumnDef<Category>[] => [
 {
 accessorKey: 'image_url',
 header: 'Image',
 cell: ({ row }) => {
 const imageUrl = row.getValue('image_url') as string | null;
 return imageUrl ? (
 <div className="relative w-10 h-10 rounded overflow-hidden border border-zinc-200">
 <Image src={imageUrl} alt={row.getValue('name')} fill className="object-cover"/>
 </div>
 ) : (
 <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center text-xs text-zinc-500 font-medium">
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
 <ArrowUpDown className="ml-2 h-4 w-4"/>
 </Button>
 );
 },
 },
 {
 accessorKey: 'slug',
 header: 'Slug',
 },
 {
 accessorKey: 'parent_id',
 header: 'Parent',
 cell: ({ row }) => {
 const parentId = row.getValue('parent_id') as string | null;
 return <div>{parentId ? <span className="text-xs text-zinc-500 border border-zinc-200 rounded px-2 py-1">Has Parent</span> : <span className="text-xs bg-zinc-100 rounded px-2 py-1">Root</span>}</div>;
 }
 },
 {
 id: 'actions',
 cell: ({ row }) => {
 const category = row.original;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4"/>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Actions</DropdownMenuLabel>
 <DropdownMenuItem onClick={() => onEdit(category)}>
 <Edit className="w-4 h-4 mr-2"/>
 Edit Category
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onDelete(category)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
 <Trash className="w-4 h-4 mr-2"/>
 Delete Category
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
