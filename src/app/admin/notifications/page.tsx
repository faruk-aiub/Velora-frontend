'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Bell, Clock, Info, AlertTriangle, Tag, Search, RefreshCw, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', user_id: 'all', type: 'SYSTEM' });
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { data: notifications = [], isLoading, isFetching } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      const res = await api.get('/notifications/admin/all');
      return res.data.data;
    },
    refetchInterval: 3000, // Real-time polling without delay
  });

  const createMutation = useMutation({
    mutationFn: (newNotification: any) => api.post('/notifications/admin/send', newNotification),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }); 
      setIsDialogOpen(false); 
      setFormData({ title: '', message: '', user_id: 'all', type: 'SYSTEM' });
      toast.success('Notification sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (!mounted) return null;

  const filteredNotifications = notifications.filter((n: any) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = n?.title?.toLowerCase().includes(q) || false;
    const msgMatch = n?.message?.toLowerCase().includes(q) || false;
    const emailMatch = n?.user?.email?.toLowerCase().includes(q) || false;
    return titleMatch || msgMatch || emailMatch;
  });

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-75">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Bell size={20} />
            </div>
            Notifications Panel
          </h1>
          <p className="text-sm text-gray-500 mt-2">Manage and broadcast real-time system alerts, promotions, and notifications.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 font-bold shadow-sm h-11 flex items-center gap-2">
              <Send size={16} /> Send Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Bell size={20} className="text-[#BC8477]" /> New Notification
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-semibold">Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  placeholder="e.g., Summer Sale is Live!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-semibold">Message</Label>
                <Textarea 
                  id="message" 
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  required 
                  className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors min-h-[100px]"
                  placeholder="Notification content goes here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700 font-semibold">Notification Type</Label>
                  <select 
                    id="type" 
                    className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="SYSTEM">System Alert</option>
                    <option value="PROMO">Promotion</option>
                    <option value="ALERT">Warning</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_id" className="text-gray-700 font-semibold">Target User</Label>
                  <Input 
                    id="user_id" 
                    value={formData.user_id} 
                    onChange={e => setFormData({...formData, user_id: e.target.value})} 
                    required 
                    className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                  <p className="text-[10px] text-gray-500 pl-1">Leave as 'all' for broadcast</p>
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full rounded-full bg-[#BC8477] hover:bg-[#9A6B60] text-white font-bold h-11" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <><Loader2 size={16} className="animate-spin mr-2"/> Sending...</> : 'Launch Notification'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-gray-50 border-gray-200 focus:bg-white h-11"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            {isFetching && !isLoading ? (
              <><RefreshCw size={14} className="animate-spin text-blue-500" /> Live Syncing</>
            ) : (
              <><Clock size={14} className="text-green-500" /> Real-time active</>
            )}
          </div>
        </div>

        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-gray-600">Type & Title</TableHead>
                <TableHead className="font-semibold text-gray-600">Target User</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right">Time Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center h-32"><Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" /></TableCell></TableRow>
              ) : filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Bell size={24} className="mb-2 text-gray-300" />
                      <p>No notifications found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((notification: any) => (
                  <TableRow key={notification.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex gap-3">
                        <div className="mt-1 shrink-0">
                          {notification.type === 'PROMO' ? (
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Tag size={14} /></div>
                          ) : notification.type === 'ALERT' ? (
                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle size={14} /></div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Info size={14} /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{notification.title || 'Untitled Notification'}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{notification.message}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {(!notification.user_id || notification.user_id === 'all') ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-gray-900 text-white shadow-sm">
                            Broadcast
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-600 truncate max-w-[150px]" title={notification.user?.email || notification.user_id}>
                            {notification.user?.email || 'Specific User'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                        notification.is_read 
                          ? 'bg-green-50 text-green-700 border-green-200/50' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200/50'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${notification.is_read ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {notification.is_read ? 'Read' : 'Unread'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-900">
                          {new Date(notification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-end gap-1">
                          <Clock size={10} />
                          {new Date(notification.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
