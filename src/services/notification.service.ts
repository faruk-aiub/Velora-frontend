import api from '@/lib/axios';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data || { data: [] };
  },
  
  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res.data?.count ?? 0;
  },
  
  markAsRead: async (notificationIds?: string[]) => {
    const res = await api.post('/notifications/mark-read', { notificationIds });
    return res.data;
  },
  
  delete: async (id: string) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }
};
