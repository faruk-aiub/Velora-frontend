'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MailOpen, Mail, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { contactService } from '@/services/contact.service';
import { MessageThreadDialog } from '@/components/admin/MessageThreadDialog';

export type ContactMessage = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const createColumns = (refreshData: () => void): ColumnDef<ContactMessage>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const msg = row.original;
      return (
        <div className="font-medium text-gray-900">
          {msg.first_name} {msg.last_name}
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => row.getValue('subject') || <span className="text-gray-400 italic">No Subject</span>,
  },
  {
    accessorKey: 'is_read',
    header: 'Status',
    cell: ({ row }) => {
      const isRead = row.getValue('is_read') as boolean;
      return (
        <Badge variant={isRead ? 'secondary' : 'default'} className={!isRead ? "bg-[#7A915C] text-white" : ""}>
          {isRead ? 'Read' : 'Unread'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <div className="text-gray-500">{date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const msg = row.original;

      const toggleReadStatus = async () => {
        try {
          if (msg.is_read) {
            await contactService.markAsUnread(msg.id);
            toast.success("Marked as unread");
          } else {
            await contactService.markAsRead(msg.id);
            toast.success("Marked as read");
          }
          refreshData();
        } catch (error) {
          toast.error("Failed to update status");
        }
      };

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
          await contactService.deleteMessage(msg.id);
          toast.success("Message deleted");
          refreshData();
        } catch (error) {
          toast.error("Failed to delete message");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <MessageThreadDialog msg={msg} refreshData={refreshData} />

          <Button variant="ghost" size="icon" onClick={toggleReadStatus} title={msg.is_read ? "Mark as unread" : "Mark as read"}>
            {msg.is_read ? <Mail className="w-4 h-4 text-gray-500" /> : <MailOpen className="w-4 h-4 text-[#7A915C]" />}
          </Button>

          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
