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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payments Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time view of all transactions and payment statuses.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Live Updates</span>
            {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />}
          </div>
          {lastUpdated && (
            <span className="text-xs text-gray-400 ml-2 border-l pl-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Volume</CardTitle>
            <div className="p-2 bg-rose-50 rounded-2xl">
              <CreditCard className="h-5 w-5 text-[#BC8477]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">৳{totalVolume.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Recent 100 transactions</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Successful</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-2xl">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{successCount}</div>
            <p className="text-xs text-emerald-500 mt-2 font-bold">Payments completed</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Pending</CardTitle>
            <div className="p-2 bg-amber-50 rounded-2xl">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pendingCount}</div>
            <p className="text-xs text-amber-500 mt-2 font-bold">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Failed / Refunds</CardTitle>
            <div className="p-2 bg-red-50 rounded-2xl">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{failedCount}</div>
            <p className="text-xs text-red-500 mt-2 font-bold">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-600">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-600">Order</TableHead>
                  <TableHead className="font-semibold text-gray-600">Provider</TableHead>
                  <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-600">Date</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Status</TableHead>
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
                      <TableCell className="font-medium text-xs font-mono text-gray-600">
                        {payment.transaction_id || payment.id}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {payment.order?.order_number || payment.order_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-700 capitalize">
                            {payment.provider.toLowerCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        ৳{Number(payment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(payment.created_at).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase
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
