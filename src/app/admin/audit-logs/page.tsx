'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs');
      return res.data.data;
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Track admin actions and system events.</p>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Loading audit logs...</TableCell></TableRow>
            ) : logs?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">No audit logs found.</TableCell></TableRow>
            ) : (
              logs?.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {log.user ? log.user.email : 'System'}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 border text-gray-800">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.entity} {log.entity_id ? `(${log.entity_id})` : ''}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-xs text-gray-500">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
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
