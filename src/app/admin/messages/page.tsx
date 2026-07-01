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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Contact Messages</h1>
          <p className="text-gray-500">View and manage customer inquiries.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#EAF0E2] text-[#7A915C] px-4 py-2 rounded-2xl font-bold">
          <Mail size={18} />
          {unreadCount} Unread
        </div>
      </div>

      <Card className="rounded-[32px] border-none shadow-sm">
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
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
