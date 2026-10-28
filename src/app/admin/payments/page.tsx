'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  RefreshCw, 
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PaymentsPage() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { data: payments = [], isLoading, isFetching } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => {
      const res = await api.get('/admin/payments?limit=100'); // Fetch more for better stats
      // Extract data from PaginatedResponse format
      if (Array.isArray(res.data?.data)) {
        setLastUpdated(new Date());
        return res.data.data;
      }
      return [];
    },
    refetchInterval: 10000, // Real-time polling every 10 seconds
  });

  // Calculate dynamic stats from the current payments view
  const totalVolume = payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
  const successCount = payments.filter((p: any) => p.status === 'SUCCESS').length;
  const pendingCount = payments.filter((p: any) => p.status === 'PENDING').length;
  const failedCount = payments.filter((p: any) => p.status === 'FAILED').length;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-75">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Payments Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time view of all transactions and payment statuses.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm border border-gray-100 w-fit text-xs sm:text-sm">
          <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-medium text-gray-700">Live Updates</span>
            {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />}
          </div>
          {lastUpdated && (
            <span className="text-[10px] sm:text-xs text-gray-400 ml-1.5 sm:ml-2 border-l pl-2 sm:pl-3">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Total Volume</span>
            <div className="p-1.5 sm:p-2 bg-rose-50 rounded-xl sm:rounded-2xl shrink-0">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[#BC8477]" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 mt-2 sm:mt-3 truncate">৳{totalVolume.toLocaleString()}</div>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">Recent 100 txns</p>
        </Card>
        
        <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">Successful</span>
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-xl sm:rounded-2xl shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 mt-2 sm:mt-3 truncate">{successCount}</div>
          <p className="text-[11px] sm:text-xs text-emerald-600/80 mt-0.5 sm:mt-1 truncate">Completed</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-amber-700 uppercase tracking-wider truncate">Pending</span>
            <div className="p-1.5 sm:p-2 bg-amber-50 rounded-xl sm:rounded-2xl shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-600 mt-2 sm:mt-3 truncate">{pendingCount}</div>
          <p className="text-[11px] sm:text-xs text-amber-600/80 mt-0.5 sm:mt-1 truncate">Awaiting</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-red-700 uppercase tracking-wider truncate">Failed / Refunds</span>
            <div className="p-1.5 sm:p-2 bg-red-50 rounded-xl sm:rounded-2xl shrink-0">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-red-600 mt-2 sm:mt-3 truncate">{failedCount}</div>
          <p className="text-[11px] sm:text-xs text-red-500 mt-0.5 sm:mt-1 truncate">Needs attention</p>
        </Card>
      </div>

      <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="border border-gray-100 rounded-2xl overflow-x-auto overscroll-x-contain">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Order</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Provider</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Date</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && !payments.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-48">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#BC8477]" />
                        <span>Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-48 text-gray-500 font-medium">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment: any) => (
                    <TableRow key={payment.id} className="border-gray-50 transition-colors hover:bg-gray-50/50">
                      <TableCell className="font-medium text-xs font-mono text-gray-600 whitespace-nowrap">
                        {payment.transaction_id || payment.id}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                        {payment.order?.order_number || payment.order_id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs sm:text-sm text-gray-700 capitalize">
                            {payment.provider.toLowerCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        ৳{Number(payment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(payment.created_at).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase
                          ${payment.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 
                            payment.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                            payment.status === 'REFUNDED' ? 'bg-purple-100 text-purple-800' : 
                            'bg-amber-100 text-amber-800'}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
