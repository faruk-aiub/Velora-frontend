import apiClient from '@/lib/axios';
import type {
  ApiResponse,
  AuthTokens,
  User,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/types/auth.types';

export const authService = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post<ApiResponse<AuthTokens & { user: User }>>(
      '/auth/login',
      payload
    );
    return res.data;
  },

  register: async (payload: RegisterPayload) => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/register', payload);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', payload);
    return res.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/reset-password', payload);
    return res.data;
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/verify-email', payload);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/users/me');
    return res.data;
  },

  refreshToken: async () => {
    const res = await apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh-token');
    return res.data;
  },
};
