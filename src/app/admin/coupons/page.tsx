'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Ticket, CheckCircle2, Percent, Banknote, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { Coupon, createColumns } from './columns';
import { CouponFormDialog } from './CouponFormDialog';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

type CouponFilter = 'all' | 'active' | 'inactive' | 'percent' | 'fixed';

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [filter, setFilter] = useState<CouponFilter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await api.get('/admin/coupons');
      if (Array.isArray(res.data?.data)) {
        return res.data.data as Coupon[];
      } else if (Array.isArray(res.data?.data?.data)) {
        return res.data.data.data as Coupon[];
      }
      return [] as Coupon[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      toast.success('Coupon deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setCouponToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });

  const items = data || [];

  // Summary Metrics
  const stats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let percent = 0;
    let fixed = 0;
    const now = Date.now();

    for (const item of items) {
      const isExpired = item.expires_at ? new Date(item.expires_at).getTime() < now : false;
      if (item.is_active && !isExpired) {
        active++;
      } else {
        inactive++;
      }

      if (item.discount_type === 'PERCENT') {
        percent++;
      } else {
        fixed++;
      }
    }

    return {
      total: items.length,
      active,
      inactive,
      percent,
      fixed,
    };
  }, [items]);

  // Filtered coupons
  const filteredItems = useMemo(() => {
    const now = Date.now();
    if (filter === 'active') {
      return items.filter(
        (c) => c.is_active && (!c.expires_at || new Date(c.expires_at).getTime() >= now)
      );
    }
    if (filter === 'inactive') {
      return items.filter(
        (c) => !c.is_active || (c.expires_at && new Date(c.expires_at).getTime() < now)
      );
    }
    if (filter === 'percent') {
      return items.filter((c) => c.discount_type === 'PERCENT');
    }
    if (filter === 'fixed') {
      return items.filter((c) => c.discount_type === 'FIXED');
    }
    return items;
  }, [items, filter]);

  const handleEdit = (coupon: Coupon) => {
    setCouponToEdit(coupon);
    setIsFormOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setCouponToDelete(coupon);
  };

  const handleCreateNew = () => {
    setCouponToEdit(null);
    setIsFormOpen(true);
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {items.length} total coupons
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Create promotional campaigns, voucher codes, and customer discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full px-4 h-10 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin text-gray-900' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 h-10 font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coupons */}
        <div
          onClick={() => setFilter('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Coupons
            </span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-3">{stats.total}</div>
          <div className="text-xs text-gray-400 mt-1">All promotional codes</div>
        </div>

        {/* Active Codes */}
        <div
          onClick={() => setFilter('active')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'active'
              ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Active & Valid
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">{stats.active}</div>
          <div className="text-xs text-emerald-700/80 mt-1">Currently redeemable in checkout</div>
        </div>

        {/* Percentage Discounts */}
        <div
          onClick={() => setFilter('percent')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'percent'
              ? 'bg-purple-50/60 border-purple-500 shadow-md ring-1 ring-purple-500'
              : 'bg-white border-gray-100 hover:border-purple-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Percentage (%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 mt-3">{stats.percent}</div>
          <div className="text-xs text-purple-700/80 mt-1">% off order total</div>
        </div>

        {/* Fixed Discounts */}
        <div
          onClick={() => setFilter('fixed')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'fixed'
              ? 'bg-blue-50/60 border-blue-500 shadow-md ring-1 ring-blue-500'
              : 'bg-white border-gray-100 hover:border-blue-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Fixed (৳)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-3">{stats.fixed}</div>
          <div className="text-xs text-blue-700/80 mt-1">Flat deduction vouchers</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Coupons ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'active'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active ({stats.active})
        </button>
        <button
          type="button"
          onClick={() => setFilter('percent')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'percent'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          Percentage ({stats.percent})
        </button>
        <button
          type="button"
          onClick={() => setFilter('fixed')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'fixed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          Fixed ({stats.fixed})
        </button>
        {stats.inactive > 0 && (
          <button
            type="button"
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'inactive'
                ? 'bg-gray-800 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Inactive ({stats.inactive})
          </button>
        )}
      </div>

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={filteredItems}
          searchKey="code"
          isLoading={isLoading}
          defaultPageSize={10}
        />
      </div>

      {/* Create / Edit Dialog */}
      <CouponFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        couponToEdit={couponToEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={() => couponToDelete && deleteMutation.mutate(couponToDelete.id)}
        title="Delete Coupon"
        description={`Are you sure you want to delete "${couponToDelete?.code}"? Customers will no longer be able to use it.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
