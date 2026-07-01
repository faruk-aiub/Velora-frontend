'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth.schema';
import apiClient from '@/lib/axios';

const item = (delay: number) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/admin/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (res.data) {
        toast.success('Login successful');
        localStorage.setItem('admin_access_token', res.data.data.accessToken);
        
        // Wait a brief moment to ensure cookie is processed
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 300);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F9F7F6] selection:bg-[#BC8477] selection:text-white">
      <div className="w-full max-w-[420px] mx-auto p-6">
        <motion.div {...item(0)} className="text-center mb-8">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#BC8477] uppercase mb-4">
            Velora Staff Only
          </h3>
          <h1 className="font-bold text-4xl text-[#3A3331] font-light mb-4">
            Admin <span className="text-[#BC8477] italic">Portal</span>
          </h1>
          <p className="text-sm text-[#7A7371] font-light">
            Enter your credentials to manage the store.
          </p>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-16 h-[1px] bg-[#E8E1DE]" />
            <div className="w-1 h-1 rounded-full bg-[#BC8477]" />
            <div className="w-16 h-[1px] bg-[#E8E1DE]" />
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div {...item(0.1)} className="space-y-1 relative group">
            <label htmlFor="email" className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@velora.com"
              className="w-full h-10 bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] transition-colors focus:outline-none focus:border-[#BC8477] placeholder:text-[#B5AFAD]"
              style={{ borderColor: errors.email ? '#E46962' : undefined }}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div {...item(0.2)} className="space-y-1 relative pt-2">
            <label htmlFor="password" className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full h-10 bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] transition-colors focus:outline-none focus:border-[#BC8477] placeholder:text-[#B5AFAD] pr-10"
                style={{ borderColor: errors.password ? '#E46962' : undefined }}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#B5AFAD] hover:text-[#3A3331] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.password.message}</p>
            )}
          </motion.div>

          <motion.div {...item(0.4)} className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#BC8477] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none shadow-sm"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  AUTHORIZE ACCESS
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </motion.div>
        </form>

      </div>
    </div>
  );
}
