'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Coupon = {
 id: string;
 code: string;
 discount_type: 'PERCENT' | 'FIXED';
 discount_value: number;
 min_order_value: number | null;
 usage_limit: number | null;
 used_count: number;
 expires_at: string | null;
 is_active: boolean;
 created_at: string;
};

export const createColumns = (
 onEdit: (coupon: Coupon) => void,
 onDelete: (coupon: Coupon) => void
): ColumnDef<Coupon>[] => [
 {
 accessorKey: 'code',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 >
 Code
 <ArrowUpDown className="ml-2 h-4 w-4"/>
 </Button>
 );
 },
 cell: ({ row }) => <span className="font-mono font-bold">{row.getValue('code')}</span>
 },
 {
 accessorKey: 'discount_type',
 header: 'Type',
 cell: ({ row }) => (
 <Badge variant="outline">{row.getValue('discount_type')}</Badge>
 )
 },
 {
 accessorKey: 'discount_value',
 header: 'Value',
 cell: ({ row }) => {
 const type = row.original.discount_type;
 const val = row.getValue('discount_value') as number;
 return <span>{type === 'PERCENT' ? `${val}%` : `$${val}`}</span>;
 }
 },
 {
 accessorKey: 'usage',
 header: 'Usage',
 cell: ({ row }) => {
 const used = row.original.used_count;
 const limit = row.original.usage_limit;
 return <span>{used} / {limit ? limit : '∞'}</span>;
 }
 },
 {
 accessorKey: 'is_active',
 header: 'Status',
 cell: ({ row }) => {
 const isActive = row.getValue('is_active') as boolean;
 return (
 <Badge className={isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border-none'}>
 {isActive ? 'Active' : 'Inactive'}
 </Badge>
 );
 },
 },
 {
 id: 'actions',
 cell: ({ row }) => {
 const coupon = row.original;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4"/>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Actions</DropdownMenuLabel>
 <DropdownMenuItem onClick={() => onEdit(coupon)}>
 <Edit className="w-4 h-4 mr-2"/>
 Edit Coupon
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onDelete(coupon)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
 <Trash className="w-4 h-4 mr-2"/>
 Delete Coupon
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
