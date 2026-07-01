'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Order = {
 id: string;
 customer: string;
 date: string;
 total: string;
 status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
};

export const columns: ColumnDef<Order>[] = [
 {
 accessorKey: 'id',
 header: 'Order ID',
 cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
 },
 {
 accessorKey: 'customer',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 >
 Customer
 <ArrowUpDown className="ml-2 h-4 w-4"/>
 </Button>
 );
 },
 },
 {
 accessorKey: 'date',
 header: 'Date',
 },
 {
 accessorKey: 'total',
 header: () => <div className="text-right">Total</div>,
 cell: ({ row }) => {
 return <div className="text-right font-medium">{row.getValue('total')}</div>;
 },
 },
 {
 accessorKey: 'status',
 header: 'Status',
 cell: ({ row }) => {
 const status = row.getValue('status') as string;
 const statusVariant = 
 status === 'DELIVERED' ? 'default' :
 status === 'PROCESSING' ? 'secondary' :
 status === 'SHIPPED' ? 'outline' :
 status === 'PENDING' ? 'secondary' : 'destructive';
 
 const badgeColor = 
 status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-100' :
 status === 'PROCESSING' ? 'bg-blue-100 text-blue-700 border-none hover:bg-blue-100' :
 status === 'SHIPPED' ? 'bg-purple-100 text-purple-700 border-none hover:bg-purple-100' :
 status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-none hover:bg-amber-100' : 
 'bg-rose-100 text-rose-700 border-none hover:bg-rose-100';

 return (
 <Badge className={badgeColor}>
 {status}
 </Badge>
 );
 },
 },
 {
 id: 'actions',
 cell: ({ row }) => {
 const order = row.original;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4"/>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Actions</DropdownMenuLabel>
 <DropdownMenuItem
 onClick={() => navigator.clipboard.writeText(order.id)}
 >
 Copy payment ID
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem>View customer</DropdownMenuItem>
 <DropdownMenuItem>View order details</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
