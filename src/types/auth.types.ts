// =============================
// Auth Types
// =============================
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'CUSTOMER' | 'ADMIN';
  is_active: boolean;
  is_email_verified: boolean;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

// =============================
// API Response Types
// =============================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
