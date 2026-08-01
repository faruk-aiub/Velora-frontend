'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export type AuditLog = {
  id: string;
  user: { email: string } | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  details: any;
  created_at: string;
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="font-medium text-gray-900">
          {user ? user.email : 'System'}
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-gray-50 text-gray-700">
        {row.getValue('action')}
      </Badge>
    ),
  },
  {
    id: 'entity',
    header: 'Entity',
    cell: ({ row }) => {
      const log = row.original;
      if (!log.entity) return <span className="text-gray-400">-</span>;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{log.entity}</span>
          {log.entity_id && (
            <span className="text-[10px] text-gray-500 font-mono">
              ID: {log.entity_id}
            </span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ row }) => {
      const details = row.getValue('details');
      if (!details) return <span className="text-gray-400">-</span>;
      return (
        <div className="max-w-[300px] truncate text-xs text-gray-500 font-mono bg-gray-50 p-1.5 rounded-md border border-gray-100">
          {JSON.stringify(details)}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Timestamp',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return (
        <div className="text-sm text-gray-500">
          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      );
    },
  },
];
