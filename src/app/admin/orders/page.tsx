'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, ShoppingBag, Truck, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Order, createColumns } from './columns';

type OrderFilter = 'all' | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<OrderFilter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      if (Array.isArray(res.data?.data)) {
        return res.data.data as Order[];
      } else if (Array.isArray(res.data?.data?.data)) {
        return res.data.data.data as Order[];
      }
      return [] as Order[];
    },
    refetchInterval: 15000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });

  const handleUpdateStatus = (order: Order, status: string) => {
    updateStatusMutation.mutate({ id: order.id, status });
  };

  const items = data || [];

  // Summary Metrics
  const stats = useMemo(() => {
    let pending = 0;
    let processing = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;
    let totalRevenue = 0;

    for (const order of items) {
      const s = order.status;
      if (s === 'PENDING') pending++;
      else if (s === 'PROCESSING') processing++;
      else if (s === 'SHIPPED') shipped++;
      else if (s === 'DELIVERED') {
        delivered++;
        totalRevenue += Number(order.total_amount) || 0;
      } else if (s === 'CANCELLED') cancelled++;
    }

    return {
      total: items.length,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      activeFulfillment: processing + shipped,
      totalRevenue,
    };
  }, [items]);

  // Filtered orders
  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((order) => order.status === filter);
  }, [items, filter]);

  const columns = createColumns(handleUpdateStatus);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {items.length} total
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track customer orders, update delivery milestones, and manage fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full px-3.5 sm:px-4 h-9 sm:h-10 border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${isFetching ? 'animate-spin text-gray-900' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Orders */}
        <div
          onClick={() => setFilter('all')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 mt-2 sm:mt-3 truncate">{stats.total}</div>
          <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">All customer transactions</div>
        </div>

        {/* Pending Action */}
        <div
          onClick={() => setFilter('PENDING')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'PENDING'
              ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-500'
              : 'bg-white border-gray-100 hover:border-amber-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Action
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-600 mt-2 sm:mt-3 truncate">{stats.pending}</div>
          <div className="text-[11px] sm:text-xs text-amber-700/80 mt-0.5 sm:mt-1 truncate">
            {stats.pending > 0 ? 'Requires action' : 'Zero backlog'}
          </div>
        </div>

        {/* In Fulfillment / Shipped */}
        <div
          onClick={() => setFilter('PROCESSING')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'PROCESSING' || filter === 'SHIPPED'
              ? 'bg-blue-50/60 border-blue-500 shadow-md ring-1 ring-blue-500'
              : 'bg-white border-gray-100 hover:border-blue-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-blue-700 uppercase tracking-wider">
              In Transit / Prep
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-blue-600 mt-2 sm:mt-3 truncate">{stats.activeFulfillment}</div>
          <div className="text-[11px] sm:text-xs text-blue-700/80 mt-0.5 sm:mt-1 truncate">Processing & on route</div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => setFilter('DELIVERED')}
          className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'DELIVERED'
              ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Delivered
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 mt-2 sm:mt-3 truncate">{stats.delivered}</div>
          <div className="text-[11px] sm:text-xs text-emerald-700/80 mt-0.5 sm:mt-1 truncate">Completed</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 overscroll-x-contain">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Orders ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setFilter('PENDING')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'PENDING'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending ({stats.pending})
        </button>
        <button
          type="button"
          onClick={() => setFilter('PROCESSING')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'PROCESSING'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Processing ({stats.processing})
        </button>
        <button
          type="button"
          onClick={() => setFilter('SHIPPED')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'SHIPPED'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Shipped ({stats.shipped})
        </button>
        <button
          type="button"
          onClick={() => setFilter('DELIVERED')}
          className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'DELIVERED'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Delivered ({stats.delivered})
        </button>
        {stats.cancelled > 0 && (
          <button
            type="button"
            onClick={() => setFilter('CANCELLED')}
            className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'CANCELLED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancelled ({stats.cancelled})
          </button>
        )}
      </div>

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={filteredItems}
          searchKey="order_number"
          isLoading={isLoading}
          defaultPageSize={10}
        />
      </div>
    </div>
  );
}
