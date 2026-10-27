'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import api from '@/lib/axios';
import { InventoryItem, createColumns } from './columns';
import { StockAdjustmentDialog } from './StockAdjustmentDialog';

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const res = await api.get('/inventory/all?limit=10000');
      if (Array.isArray(res.data?.data)) {
        return res.data.data as InventoryItem[];
      } else if (Array.isArray(res.data?.data?.data)) {
        return res.data.data.data as InventoryItem[];
      }
      return [] as InventoryItem[];
    },
  });

  const items = data || [];

  // Summary Metrics
  const stats = useMemo(() => {
    let totalUnits = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let inStock = 0;

    for (const item of items) {
      totalUnits += Number(item.quantity) || 0;
      const available = Number(item.available_quantity) || 0;
      if (available <= 0) {
        outOfStock++;
      } else if (available < 10) {
        lowStock++;
      } else {
        inStock++;
      }
    }

    return {
      totalSkus: items.length,
      totalUnits,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [items]);

  // Filtered Items based on quick pill selector
  const filteredItems = useMemo(() => {
    if (stockFilter === 'out_of_stock') {
      return items.filter((item) => (Number(item.available_quantity) || 0) <= 0);
    }
    if (stockFilter === 'low_stock') {
      return items.filter((item) => {
        const available = Number(item.available_quantity) || 0;
        return available > 0 && available < 10;
      });
    }
    if (stockFilter === 'in_stock') {
      return items.filter((item) => (Number(item.available_quantity) || 0) >= 10);
    }
    return items;
  }, [items, stockFilter]);

  const handleOpenAdjustModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const columns = createColumns(handleOpenAdjustModal);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {items.length} total SKUs
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time warehouse tracking, stock levels, and replenishment adjustments.
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
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total SKUs */}
        <div
          onClick={() => setStockFilter('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'all'
              ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total SKUs
            </span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-3">{stats.totalSkus}</div>
          <div className="text-xs text-gray-400 mt-1">All catalog variants</div>
        </div>

        {/* Total Units */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Units
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-3">
            {stats.totalUnits.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Units currently in warehouse</div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setStockFilter('low_stock')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'low_stock'
              ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-500'
              : 'bg-white border-gray-100 hover:border-amber-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Low Stock (&lt;10)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-3">{stats.lowStock}</div>
          <div className="text-xs text-amber-700/80 mt-1">
            {stats.lowStock > 0 ? 'Needs reordering soon' : 'All stocks healthy'}
          </div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setStockFilter('out_of_stock')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'out_of_stock'
              ? 'bg-rose-50/60 border-rose-500 shadow-md ring-1 ring-rose-500'
              : 'bg-white border-gray-100 hover:border-rose-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-3">{stats.outOfStock}</div>
          <div className="text-xs text-rose-700/80 mt-1">
            {stats.outOfStock > 0 ? 'Urgent attention required' : 'Zero depleted items'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setStockFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            stockFilter === 'all'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Items ({stats.totalSkus})
        </button>
        <button
          type="button"
          onClick={() => setStockFilter('in_stock')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            stockFilter === 'in_stock'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          In Stock ({stats.inStock})
        </button>
        <button
          type="button"
          onClick={() => setStockFilter('low_stock')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            stockFilter === 'low_stock'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Low Stock ({stats.lowStock})
        </button>
        <button
          type="button"
          onClick={() => setStockFilter('out_of_stock')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            stockFilter === 'out_of_stock'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Out of Stock ({stats.outOfStock})
        </button>
      </div>

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={filteredItems}
          searchKey="product_title"
          isLoading={isLoading}
          defaultPageSize={10}
        />
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
      />
    </div>
  );
}
