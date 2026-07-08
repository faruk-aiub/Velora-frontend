import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService, AppNotification } from '../services/notification.service';
import { useAuthStore } from '../store/auth.store';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
    enabled: !!user,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: notificationService.getUnreadCount,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const authStorage = localStorage.getItem('velora-auth');
    let token = '';
    try {
      if (authStorage) token = JSON.parse(authStorage)?.state?.accessToken || '';
    } catch (e) {}

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    const sseUrl = `${baseUrl}/notifications/stream?token=${token}`;
    
    const eventSource = new EventSource(sseUrl);
    
    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        // Invalidate queries so that new notifications and count are refetched
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
        
        // Show a small toast notification for real-time feel
        if (newNotification.title) {
          toast(newNotification.title, {
            description: newNotification.message,
          });
        }
      } catch (e) {
        console.error('Failed to parse SSE notification', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Notifications Error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [user, queryClient]);

  const notifications: AppNotification[] = notificationsData?.data || [];

  return { notifications, unreadCount, isLoading };
};
