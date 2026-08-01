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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Audit Logs</h1>
          <p className="text-gray-500">Track admin actions and system events.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#F9F0E6] text-[#B58A63] px-4 py-2 rounded-2xl font-bold">
          <ShieldAlert size={18} />
          {logs.length} Records
        </div>
      </div>

      <Card className="rounded-[32px] border-none shadow-sm">
        <CardHeader>
          <CardTitle>System Log</CardTitle>
        </CardHeader>
        <CardContent>
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
