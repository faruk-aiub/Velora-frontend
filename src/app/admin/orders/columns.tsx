'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  MoreHorizontal,
  Truck,
  XCircle,
  User as UserIcon,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  contact_number: string;
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
  user: {
    email: string;
  };
  items?: { product_name: string; quantity?: number; price?: number }[];
};

export const createColumns = (
  onUpdateStatus: (order: Order, status: string) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: 'order_number',
    header: 'Order & Items',
    cell: ({ row }) => {
      const order = row.original;
      let displayName = `Order #${order.order_number}`;
      if (order.items && order.items.length > 0) {
        const firstProductName = order.items[0].product_name;
        const otherItemsCount = order.items.length - 1;
        displayName =
          otherItemsCount > 0 ? `${firstProductName} +${otherItemsCount} more` : firstProductName;
      }

      return (
        <div className="max-w-[280px]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
              #{order.order_number.slice(-8)}
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900 mt-1 truncate" title={displayName}>
            {displayName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    header: 'Customer Info',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
            <span>{order.customer_name || 'Guest Customer'}</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {order.contact_number || order.user?.email || 'No contact provided'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Total Amount
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue('total_amount')) || 0;
      return <div className="font-bold text-gray-900 text-sm">৳{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Fulfillment Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      if (status === 'DELIVERED') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </span>
        );
      }
      if (status === 'SHIPPED') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            Shipped
          </span>
        );
      }
      if (status === 'PROCESSING') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Processing
          </span>
        );
      }
      if (status === 'PENDING') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Cancelled
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date Placed
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return (
        <div className="text-xs text-gray-600 font-medium">
          {date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl shadow-xl border border-gray-100 bg-white">
            <DropdownMenuLabel className="px-2.5 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Order Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(order.order_number);
                toast.success('Order number copied to clipboard');
              }}
              className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
              Copy Order #
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-gray-100" />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 cursor-pointer">
                <Truck className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40 p-1.5 rounded-2xl shadow-xl border border-gray-100 bg-white">
                <DropdownMenuItem
                  onClick={() => onUpdateStatus(order, 'PENDING')}
                  className="rounded-xl px-2.5 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 mr-2 text-amber-500" /> Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateStatus(order, 'PROCESSING')}
                  className="rounded-xl px-2.5 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 mr-2 text-blue-500" /> Processing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateStatus(order, 'SHIPPED')}
                  className="rounded-xl px-2.5 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 mr-2 text-purple-500" /> Shipped
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateStatus(order, 'DELIVERED')}
                  className="rounded-xl px-2.5 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Delivered
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-gray-100" />
                <DropdownMenuItem
                  onClick={() => onUpdateStatus(order, 'CANCELLED')}
                  className="rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 mr-2 text-red-600" /> Cancelled
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
