'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { contactService } from '@/services/contact.service';
import { createColumns, ContactMessage } from './columns';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await contactService.getMessages();
      setMessages(res.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const columns = createColumns(fetchMessages);

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Contact Messages</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">View and manage customer inquiries.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#EAF0E2] text-[#7A915C] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm w-fit">
          <Mail size={16} />
          {unreadCount} Unread
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-[32px] border-none shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold">Inbox</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <DataTable
            columns={columns}
            data={messages}
            searchKey="email"
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
