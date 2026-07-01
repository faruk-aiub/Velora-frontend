'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const item = (delay: number) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginBackend, isPending: isBackendPending } = useMutation({
    mutationFn: authService.firebaseLogin,
    onSuccess: (data) => {
      const user = data.data.user;
      setAuth(user, data.data.accessToken);
      
      if (user.role === 'ADMIN') {
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
      auth.signOut(); // Ensure Firebase state is cleared if backend fails
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsFirebaseLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        toast.error('Please verify your email address before logging in.');
        await auth.signOut();
        setIsFirebaseLoading(false);
        return;
      }

      const idToken = await userCredential.user.getIdToken();
      loginBackend(idToken);
    } catch (error: any) {
      setIsFirebaseLoading(false);
      let errorMessage = 'Failed to sign in.';
      if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password.';
      else if (error.code === 'auth/user-disabled') errorMessage = 'This account has been disabled.';
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setIsFirebaseLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      loginBackend(idToken);
    } catch (error: any) {
      setIsFirebaseLoading(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign in failed.');
      }
    }
  };

  const isPending = isFirebaseLoading || isBackendPending;

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <motion.div {...item(0)} className="text-center mb-8">
        <h3 className="text-sm font-bold text-[#BC8477] mb-4">
          Welcome Back
        </h3>
        <h1 className="font-bold text-4xl text-gray-900 tracking-tight mb-4">
          Sign in to <span className="text-[#BC8477] italic">Velora</span>
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Enter your credentials to access your account.
        </p>
        
        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-16 h-[1px] bg-gray-100" />
          <div className="w-1 h-1 rounded-full bg-[#BC8477]" />
          <div className="w-16 h-[1px] bg-gray-100" />
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div {...item(0.1)} className="space-y-1 relative group">
          <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400"
            style={{ borderColor: errors.email ? '#E46962' : undefined }}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div {...item(0.2)} className="space-y-1 relative pt-2">
          <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 pr-10"
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

        <motion.div {...item(0.3)} className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-3.5 h-3.5 rounded-sm border-[#D5CFCD] text-[#BC8477] focus:ring-[#BC8477] transition-colors"
            />
            <label htmlFor="remember" className="text-xs text-[#7A7371] cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <Link 
            href="/forgot-password" 
            className="text-xs text-[#BC8477] hover:text-[#9A6B60] transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        <motion.div {...item(0.4)} className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-[#BC8477] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                SIGN IN
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div {...item(0.5)} className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8E1DE]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="px-4 bg-white text-[#B5AFAD]">Or</span>
        </div>
      </motion.div>

      <motion.div {...item(0.6)}>
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isPending}
          className="w-full h-12 bg-white border border-[#E8E1DE] text-[#3A3331] text-[11px] font-bold tracking-wider hover:bg-[#F5F2F0] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </motion.div>

      <motion.p {...item(0.7)} className="text-center text-xs text-[#7A7371] mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#BC8477] hover:text-[#9A6B60] transition-colors underline underline-offset-4">
          Create one
        </Link>
      </motion.p>
    </div>
  );
}
