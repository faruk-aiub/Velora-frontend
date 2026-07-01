'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Check, MoreHorizontal, Trash, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Review = {
 id: string;
 rating: number;
 comment: string | null;
 is_approved: boolean;
 created_at: string;
 user: {
 full_name: string;
 email: string;
 };
 product: {
 title: string;
 };
};

export const createColumns = (
 onUpdateStatus: (review: Review, is_approved: boolean) => void,
 onDelete: (review: Review) => void
): ColumnDef<Review>[] => [
 {
 accessorKey: 'product',
 header: 'Product',
 cell: ({ row }) => (
 <div className="font-medium max-w-[200px] truncate"title={row.original.product?.title}>
 {row.original.product?.title || 'Unknown Product'}
 </div>
 )
 },
 {
 accessorKey: 'user',
 header: 'Reviewer',
 cell: ({ row }) => (
 <div>
 <div className="font-medium text-sm">{row.original.user?.full_name}</div>
 <div className="text-xs text-zinc-500">{row.original.user?.email}</div>
 </div>
 )
 },
 {
 accessorKey: 'rating',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 >
 Rating
 <ArrowUpDown className="ml-2 h-4 w-4"/>
 </Button>
 );
 },
 cell: ({ row }) => (
 <div className="flex text-amber-500 font-bold">
 {row.getValue('rating')} ★
 </div>
 )
 },
 {
 accessorKey: 'comment',
 header: 'Comment',
 cell: ({ row }) => (
 <div className="max-w-[300px] truncate text-sm"title={row.getValue('comment') as string}>
 {row.getValue('comment') || '-'}
 </div>
 )
 },
 {
 accessorKey: 'is_approved',
 header: 'Status',
 cell: ({ row }) => {
 const isApproved = row.getValue('is_approved') as boolean;
 return (
 <Badge className={isApproved ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none' : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-none'}>
 {isApproved ? 'Approved' : 'Pending'}
 </Badge>
 );
 },
 },
 {
 id: 'actions',
 cell: ({ row }) => {
 const review = row.original;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4"/>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Actions</DropdownMenuLabel>
 {!review.is_approved ? (
 <DropdownMenuItem onClick={() => onUpdateStatus(review, true)} className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
 <Check className="w-4 h-4 mr-2"/>
 Approve Review
 </DropdownMenuItem>
 ) : (
 <DropdownMenuItem onClick={() => onUpdateStatus(review, false)} className="text-amber-600 focus:text-amber-600 focus:bg-amber-50">
 <X className="w-4 h-4 mr-2"/>
 Reject / Hide
 </DropdownMenuItem>
 )}
 
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onDelete(review)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
 <Trash className="w-4 h-4 mr-2"/>
 Delete Review
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
