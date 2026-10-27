'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Trash,
  Ticket,
  Copy,
  CheckCircle2,
  Clock,
  Percent,
  Banknote,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Coupon Code
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const code = row.getValue('code') as string;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-gray-100 text-gray-900 px-2.5 py-1 rounded-lg border border-gray-200 tracking-wider inline-flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-gray-500" />
            {code}
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast.success(`Coupon code ${code} copied!`);
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Copy Code"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    },
  },
  {
    accessorKey: 'discount_value',
    header: 'Discount',
    cell: ({ row }) => {
      const type = row.original.discount_type;
      const val = Number(row.getValue('discount_value')) || 0;

      if (type === 'PERCENT') {
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Percent className="w-3 h-3 text-purple-600" />
            {val}% OFF
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Banknote className="w-3 h-3 text-blue-600" />
          ৳{val.toFixed(2)} Flat OFF
        </span>
      );
    },
  },
  {
    accessorKey: 'discount_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('discount_type') as string;
      return (
        <span className="text-xs font-semibold text-gray-600">
          {type === 'PERCENT' ? 'Percentage' : 'Fixed Amount'}
        </span>
      );
    },
  },
  {
    accessorKey: 'min_order_value',
    header: 'Min Order',
    cell: ({ row }) => {
      const min = row.getValue('min_order_value');
      const numMin = Number(min);
      return (
        <div className="text-xs font-medium text-gray-700">
          {numMin > 0 ? `৳${numMin.toFixed(2)}` : <span className="text-gray-400">No minimum</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'usage',
    header: 'Redemptions',
    cell: ({ row }) => {
      const used = row.original.used_count || 0;
      const limit = row.original.usage_limit;

      return (
        <div className="text-xs font-medium text-gray-900">
          <span className="font-bold">{used}</span>
          <span className="text-gray-400"> / {limit ? limit : '∞'} used</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      const expiresAt = row.original.expires_at ? new Date(row.original.expires_at) : null;
      const isExpired = expiresAt && expiresAt.getTime() < Date.now();

      if (isExpired) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            Expired
          </span>
        );
      }

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
          Inactive
        </span>
      );
    },
  },
  {
    accessorKey: 'expires_at',
    header: 'Validity',
    cell: ({ row }) => {
      const expiresAt = row.getValue('expires_at') as string | null;
      if (!expiresAt) {
        return <span className="text-xs text-gray-400 font-medium">Never expires</span>;
      }
      const date = new Date(expiresAt);
      return (
        <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row }) => {
      const coupon = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(coupon)}
            className="h-8 px-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
            title="Edit Coupon"
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
                Coupon Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEdit(coupon)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Edit Coupon
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  toast.success(`Coupon code ${coupon.code} copied!`);
                }}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Copy Code
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                onClick={() => onDelete(coupon)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5 mr-2 text-red-600" />
                Delete Coupon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
