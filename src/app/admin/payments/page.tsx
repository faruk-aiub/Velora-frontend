'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => {
      const res = await api.get('/admin/payments');
      // Extract data from PaginatedResponse format
      if (Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      return [];
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all transactions and payment statuses.
          </p>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Loading payments...</TableCell></TableRow>
            ) : payments?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">No payments found.</TableCell></TableRow>
            ) : (
              payments?.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium text-xs">
                    {payment.transaction_id || payment.id}
                  </TableCell>
                  <TableCell>{payment.order?.order_number || payment.order_id}</TableCell>
                  <TableCell>{payment.provider}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                        payment.status === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
