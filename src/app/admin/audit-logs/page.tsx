'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns, type AuditLog } from './columns';
import { ShieldAlert } from 'lucide-react';

export default function AuditLogsPage() {
  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs');
      return res.data.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Audit Logs</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Track admin actions and system events.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#F9F0E6] text-[#B58A63] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm w-fit">
          <ShieldAlert size={16} />
          {logs.length} Records
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-[32px] border-none shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold">System Log</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <DataTable
            columns={columns}
            data={logs}
            searchKey="action"
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
