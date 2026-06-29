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
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
        status === 'Delivered' ? 'default' :
        status === 'Processing' ? 'secondary' :
        status === 'Shipped' ? 'outline' :
        status === 'Pending' ? 'secondary' : 'destructive';
      
      const badgeColor = 
        status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none hover:bg-emerald-100' :
        status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none hover:bg-blue-100' :
        status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none hover:bg-purple-100' :
        status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none hover:bg-amber-100' : 
        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-none hover:bg-rose-100';

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
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
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
