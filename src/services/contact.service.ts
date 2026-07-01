import api from '@/lib/axios';

export interface CreateContactDto {
  first_name: string;
  last_name: string;
  email: string;
  subject?: string;
  message: string;
  user_id?: string;
}

export const contactService = {
  sendMessage: async (data: CreateContactDto) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/contact/unread-count');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  },

  markAsUnread: async (id: string) => {
    const response = await api.patch(`/contact/${id}/unread`);
    return response.data;
  },

  deleteMessage: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  reply: async (id: string, message: string) => {
    const response = await api.post(`/contact/${id}/reply`, { message });
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data;
  }
};
