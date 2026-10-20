'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    let isAuth = false;
    let userRole = '';
    
    try {
      const authStorage = localStorage.getItem('velora-auth');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        isAuth = parsed?.state?.isAuthenticated;
        userRole = parsed?.state?.user?.role || '';
      }
    } catch (e) {}

    if (isAuth) {
      if (['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/account');
      }
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginBackend, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const user = data.data.user;
      setAuth(user, data.data.accessToken);
      
      if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        toast.success('Welcome to Admin Panel');
        router.push('/admin/dashboard');
      } else {
        toast.success('Welcome back to Velora!');
        router.push('/account');
      }
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    loginBackend({ email: data.email, password: data.password });
  };

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl text-gray-900 tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Sign in to Velora
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={18} strokeWidth={1.5} />
          </div>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 focus:border-[#B58A63] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            style={{ borderColor: errors.email ? '#E46962' : undefined }}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.email.message}</p>
          )}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Lock size={18} strokeWidth={1.5} />
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full h-14 bg-white rounded-2xl pl-12 pr-12 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 focus:border-[#B58A63] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              style={{ borderColor: errors.password ? '#E46962' : undefined }}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-3.5 h-3.5 rounded-sm border-[#D5CFCD] text-[#B58A63] focus:ring-[#B58A63] transition-colors"
            />
            <label htmlFor="remember" className="text-xs text-[#7A7371] cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <Link 
            href="/forgot-password" 
            className="text-xs text-[#B58A63] hover:text-[#9A6B60] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-[#B58A63] text-white text-[15px] font-semibold rounded-2xl hover:bg-[#A37B55] transition-all duration-300 relative flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-[#B58A63]/20 mt-4 cursor-pointer"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Sign In
                <div className="absolute right-6">
                  <ArrowRight size={20} strokeWidth={2} />
                </div>
              </>
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-8 font-medium">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#B58A63] font-semibold hover:text-[#9A6B60] transition-colors ml-1">
          Create one
        </Link>
      </p>
    </div>
  );
}
