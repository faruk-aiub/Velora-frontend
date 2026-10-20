'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowRight, User, Mail, Lock, Phone } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!acceptedTerms) {
      toast.error('You must accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsPending(true);
    try {
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      await authService.register({
        email: data.email,
        password: data.password,
        first_name: firstName,
        last_name: lastName,
      });

      toast.success('Registration successful! You can now log in.');
      router.push('/login');
    } catch (error: any) {
      setIsPending(false);
      const msg = error.response?.data?.message || 'Failed to register.';
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl text-gray-900 tracking-tight mb-2">
          Create Your Account
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Welcome to Velora
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={18} strokeWidth={1.5} />
          </div>
          <input
            id="fullName"
            placeholder="Full Name"
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 focus:border-[#B58A63] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            style={{ borderColor: errors.fullName ? '#E46962' : undefined }}
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.fullName.message}</p>}
        </div>

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
          {errors.email && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.email.message}</p>}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Phone size={18} strokeWidth={1.5} />
          </div>
          <input
            id="phone"
            type="tel"
            placeholder="Phone Number"
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 focus:border-[#B58A63] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            style={{ borderColor: errors.phone ? '#E46962' : undefined }}
            {...register('phone')}
          />
          {errors.phone && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.phone.message}</p>}
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
          {errors.password && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.password.message}</p>}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Lock size={18} strokeWidth={1.5} />
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full h-14 bg-white rounded-2xl pl-12 pr-12 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 focus:border-[#B58A63] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              style={{ borderColor: errors.confirmPassword ? '#E46962' : undefined }}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-center gap-3 pt-4 pb-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-3.5 h-3.5 rounded-sm border-[#D5CFCD] text-[#B58A63] focus:ring-[#B58A63] transition-colors cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-[#7A7371] cursor-pointer select-none">
            I agree to the <Link href="/terms" className="text-[#B58A63] hover:underline">Terms & Conditions</Link>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-[#B58A63] text-white text-[15px] font-semibold rounded-2xl hover:bg-[#A37B55] transition-all duration-300 relative flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-[#B58A63]/20 mt-4 cursor-pointer"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Create Account
                <div className="absolute right-6">
                  <ArrowRight size={20} strokeWidth={2} />
                </div>
              </>
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-8 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-[#B58A63] font-semibold hover:text-[#9A6B60] transition-colors ml-1">
          Sign In
        </Link>
      </p>
    </div>
  );
}
