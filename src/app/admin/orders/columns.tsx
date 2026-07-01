'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CheckCircle, Clock, FileText, MoreHorizontal, Truck, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
 DropdownMenuSub,
 DropdownMenuSubTrigger,
 DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';

export type Order = {
 id: string;
 order_number: string;
 total_amount: number;
 status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
 created_at: string;
 user: {
 full_name: string;
 email: string;
 };
};

export const createColumns = (
 onUpdateStatus: (order: Order, status: string) => void
): ColumnDef<Order>[] => [
 {
 accessorKey: 'order_number',
 header: 'Order #',
 cell: ({ row }) => <span className="font-mono font-medium">{row.getValue('order_number')}</span>
 },
 {
 accessorKey: 'user',
 header: 'Customer',
 cell: ({ row }) => (
 <div>
 <div className="font-medium text-sm">{row.original.user?.full_name || 'Guest'}</div>
 <div className="text-xs text-zinc-500">{row.original.user?.email || ''}</div>
 </div>
 )
 },
 {
 accessorKey: 'total_amount',
 header: 'Total',
 cell: ({ row }) => <span className="font-medium">${Number(row.getValue('total_amount')).toFixed(2)}</span>
 },
 {
 accessorKey: 'status',
 header: 'Status',
 cell: ({ row }) => {
 const status = row.getValue('status') as string;
 const statusVariant = 
 status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 ' :
 status === 'PROCESSING' ? 'bg-blue-100 text-blue-700 ' :
 status === 'SHIPPED' ? 'bg-purple-100 text-purple-700 ' :
 status === 'PENDING' ? 'bg-amber-100 text-amber-700 ' : 
 'bg-rose-100 text-rose-700 ';

 return (
 <Badge className={`border-none hover:${statusVariant.split(' ')[0]} ${statusVariant}`}>
 {status}
 </Badge>
 );
 },
 },
 {
 accessorKey: 'created_at',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 >
 Date
 <ArrowUpDown className="ml-2 h-4 w-4"/>
 </Button>
 );
 },
 cell: ({ row }) => {
 const date = new Date(row.getValue('created_at'));
 return <span className="text-sm">{date.toLocaleDateString()}</span>;
 }
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
 <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.order_number)}>
 <FileText className="w-4 h-4 mr-2"/>
 Copy Order #
 </DropdownMenuItem>
 
 <DropdownMenuSeparator />
 <DropdownMenuSub>
 <DropdownMenuSubTrigger>
 Update Status
 </DropdownMenuSubTrigger>
 <DropdownMenuSubContent>
 <DropdownMenuItem onClick={() => onUpdateStatus(order, 'PENDING')}>
 <Clock className="w-4 h-4 mr-2 text-amber-500"/> Pending
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => onUpdateStatus(order, 'PROCESSING')}>
 <FileText className="w-4 h-4 mr-2 text-blue-500"/> Processing
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => onUpdateStatus(order, 'SHIPPED')}>
 <Truck className="w-4 h-4 mr-2 text-purple-500"/> Shipped
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => onUpdateStatus(order, 'DELIVERED')}>
 <CheckCircle className="w-4 h-4 mr-2 text-emerald-500"/> Delivered
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onUpdateStatus(order, 'CANCELLED')} className="text-red-600">
 <XCircle className="w-4 h-4 mr-2 text-red-600"/> Cancelled
 </DropdownMenuItem>
 </DropdownMenuSubContent>
 </DropdownMenuSub>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
