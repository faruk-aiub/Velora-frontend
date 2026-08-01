'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import api from '@/lib/axios';

export type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};

export const createColumns = (
  handleEdit: (banner: Banner) => void,
  handleDelete: (id: string) => void
): ColumnDef<Banner>[] => [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return (
        <div className="relative w-24 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {imageUrl ? (
            <Image src={imageUrl} alt={row.original.title || 'Banner'} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">N/A</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => <span className="text-gray-500">{row.getValue('position')}</span>,
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant="outline" className={isActive ? "bg-[#EAF0E2] text-[#7A915C] border-none" : "bg-gray-100 text-gray-500 border-none"}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)}>
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(banner.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
