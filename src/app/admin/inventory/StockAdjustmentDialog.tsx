'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Minus, Check, Package, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/axios';
import { InventoryItem } from './columns';

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  item,
}: StockAdjustmentDialogProps) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'adjust' | 'set'>('adjust');
  const [adjustType, setAdjustType] = useState<'increment' | 'decrement'>('increment');
  const [amount, setAmount] = useState<string>('10');
  const [exactQuantity, setExactQuantity] = useState<string>('0');

  useEffect(() => {
    if (item && open) {
      setAmount('10');
      setExactQuantity(String(item.quantity));
      setTab('adjust');
      setAdjustType('increment');
    }
  }, [item, open]);

  const adjustMutation = useMutation({
    mutationFn: async () => {
      if (!item) return;

      if (tab === 'adjust') {
        const numericAmount = Math.max(1, parseInt(amount, 10) || 1);
        const endpoint = `/inventory/${item.product_variant_id}/${adjustType}`;
        const res = await api.post(endpoint, { amount: numericAmount });
        return res.data;
      } else {
        const numericQuantity = Math.max(0, parseInt(exactQuantity, 10) || 0);
        const endpoint = `/inventory/${item.product_variant_id}/set`;
        const res = await api.post(endpoint, { quantity: numericQuantity });
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(
        tab === 'adjust'
          ? `Stock ${adjustType === 'increment' ? 'added' : 'reduced'} successfully`
          : 'Stock quantity updated successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    },
  });

  const parsedAmount = Math.max(0, parseInt(amount, 10) || 0);
  const parsedExact = Math.max(0, parseInt(exactQuantity, 10) || 0);
  const currentTotal = item?.quantity ?? 0;
  const currentReserved = item?.reserved_quantity ?? 0;

  const newTotal =
    tab === 'adjust'
      ? adjustType === 'increment'
        ? currentTotal + parsedAmount
        : Math.max(currentReserved, currentTotal - parsedAmount)
      : parsedExact;

  const newAvailable = Math.max(0, newTotal - currentReserved);

  const handleQuickAdd = (val: number) => {
    setAdjustType('increment');
    setAmount(String(val));
  };

  const handleQuickReduce = (val: number) => {
    setAdjustType('decrement');
    setAmount(String(val));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-24px)] sm:max-w-[480px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-gray-700" />
            Inventory Stock Adjustment
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
            {item?.product_title}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
              SKU: {item?.sku}
            </span>
            {item?.category_name && <span>• {item.category_name}</span>}
          </DialogDescription>
        </DialogHeader>

        {/* Current Stock Snapshot */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mt-2">
          <div className="text-center">
            <div className="text-xs text-gray-500 font-medium">Total Qty</div>
            <div className="text-lg font-bold text-gray-900">{currentTotal}</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-xs text-gray-500 font-medium">Reserved</div>
            <div className="text-lg font-bold text-amber-600">{currentReserved}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 font-medium">Available</div>
            <div className="text-lg font-bold text-emerald-600">{currentTotal - currentReserved}</div>
          </div>
        </div>

        {/* Tabs: Adjust vs Set Exact */}
        <div className="flex items-center p-1 bg-gray-100 rounded-2xl mt-4">
          <button
            type="button"
            onClick={() => setTab('adjust')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'adjust'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Adjust (+ / -)
          </button>
          <button
            type="button"
            onClick={() => setTab('set')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'set'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Set Exact Stock
          </button>
        </div>

        {/* Form Body */}
        {tab === 'adjust' ? (
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs font-bold text-gray-700">Adjustment Mode</Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setAdjustType('increment')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    adjustType === 'increment'
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('decrement')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    adjustType === 'decrement'
                      ? 'border-rose-500 bg-rose-50/50 text-rose-700 ring-2 ring-rose-500/20'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Minus className="w-4 h-4 text-rose-600" />
                  Reduce Stock
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="stock-amount" className="text-xs font-bold text-gray-700">
                Quantity to {adjustType === 'increment' ? 'Add' : 'Deduct'}
              </Label>
              <Input
                id="stock-amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5 h-11 rounded-xl bg-gray-50 border-gray-200 text-base font-semibold"
                placeholder="e.g. 20"
              />
            </div>

            {/* Quick chips */}
            <div>
              <div className="text-[11px] font-semibold text-gray-400 mb-1.5">Quick Presets:</div>
              <div className="flex flex-wrap gap-1.5">
                {adjustType === 'increment' ? (
                  <>
                    {[5, 10, 25, 50, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickAdd(val)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          amount === String(val)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        +{val}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[1, 5, 10, 25, 50].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickReduce(val)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          amount === String(val)
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        -{val}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="exact-stock" className="text-xs font-bold text-gray-700">
                New Total Warehouse Quantity
              </Label>
              <Input
                id="exact-stock"
                type="number"
                min={currentReserved}
                value={exactQuantity}
                onChange={(e) => setExactQuantity(e.target.value)}
                className="mt-1.5 h-11 rounded-xl bg-gray-50 border-gray-200 text-base font-semibold"
                placeholder="Enter exact total stock"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Must be at least {currentReserved} (reserved for active orders).
              </p>
            </div>
          </div>
        )}

        {/* Projected Outcome Preview */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs mt-2">
          <div>
            <span className="font-semibold text-emerald-950">Projected Result:</span>
            <div className="text-emerald-700 mt-0.5">
              Total: <strong>{newTotal}</strong> • Available:{' '}
              <strong>{newAvailable} units</strong>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`font-bold px-2 py-0.5 rounded-md ${
                newTotal > currentTotal
                  ? 'bg-emerald-200 text-emerald-800'
                  : newTotal < currentTotal
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {newTotal > currentTotal ? `+${newTotal - currentTotal}` : newTotal - currentTotal}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-5 h-10 border-gray-200 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => adjustMutation.mutate()}
            disabled={adjustMutation.isPending}
            className="rounded-full px-6 h-10 bg-gray-900 text-white hover:bg-gray-800 font-bold shadow-sm"
          >
            {adjustMutation.isPending ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
