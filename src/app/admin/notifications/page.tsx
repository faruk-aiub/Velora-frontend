'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', user_id: 'all', type: 'SYSTEM' });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      const res = await api.get('/admin/all'); // From notifications controller
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newNotification: any) => api.post('/admin/send', newNotification),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }); 
      setIsDialogOpen(false); 
      setFormData({ title: '', message: '', user_id: 'all', type: 'SYSTEM' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p className="text-sm text-gray-500 mt-1">Send and manage system notifications.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_id">Target User (UUID or 'all')</Label>
                <Input id="user_id" value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select id="type" className="w-full border rounded p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="SYSTEM">System</option>
                  <option value="PROMO">Promo</option>
                  <option value="ALERT">Alert</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Sending...' : 'Send Notification'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Read</TableHead>
              <TableHead>Sent At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Loading notifications...</TableCell></TableRow>
            ) : notifications?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">No notifications found.</TableCell></TableRow>
            ) : (
              notifications?.map((notification: any) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium text-xs">
                    {notification.user ? notification.user.email : notification.user_id}
                  </TableCell>
                  <TableCell>
                    <div>{notification.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{notification.message}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {notification.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${notification.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {notification.is_read ? 'Read' : 'Unread'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
