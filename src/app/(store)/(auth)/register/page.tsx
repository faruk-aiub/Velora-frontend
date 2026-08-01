'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowRight, User, Mail, Lock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth.schema';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification,
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

const item = (delay: number) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      await authService.register({
        email: data.email,
        password: data.password,
        first_name: firstName,
        last_name: lastName,
        // Backend doesn't currently accept phone, but if it does later, we can pass data.phone
      });

      await sendEmailVerification(firebaseUser);

      toast.success('Registration successful! Please check your email to verify your account before logging in.');
      router.push('/login');
    } catch (error: any) {
      setIsPending(false);
      let errorMessage = 'Failed to register.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setIsPending(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      
      // Since Google auto-verifies email, we can log them in immediately
      const data = await authService.firebaseLogin(idToken);
      const user = data.data.user;
      setAuth(user, data.data.accessToken);
      
      toast.success('Welcome to Velora!');
      router.push('/account');
    } catch (error: any) {
      setIsPending(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        const msg = error.response?.data?.message || error.message || 'Google sign in failed.';
        toast.error(msg);
      }
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <motion.div {...item(0)} className="text-center mb-8">
        <h1 className="font-bold text-3xl text-gray-900 tracking-tight mb-2">
          Create Your Account
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Welcome to Velora
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <motion.div {...item(0.1)} className="relative group">
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
        </motion.div>

        <motion.div {...item(0.2)} className="relative group pt-2">
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
        </motion.div>

        <motion.div {...item(0.3)} className="relative group pt-2">
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
        </motion.div>

        <motion.div {...item(0.4)} className="relative group pt-2">
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
        </motion.div>

        <motion.div {...item(0.5)} className="relative group pt-2">
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
        </motion.div>

        <motion.div {...item(0.6)} className="flex items-center gap-3 pt-4 pb-2">
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
        </motion.div>

        <motion.div {...item(0.7)} className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-[#B58A63] text-white text-[15px] font-semibold rounded-2xl hover:bg-[#A37B55] transition-all duration-300 relative flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-[#B58A63]/20 mt-4"
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
        </motion.div>
      </form>

      <motion.div {...item(0.8)} className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8E1DE]" />
        </div>
        <div className="relative flex justify-center text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
          <span className="px-4 bg-white">or continue with</span>
        </div>
      </motion.div>

      <motion.div {...item(0.9)}>
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full h-14 bg-white border border-[#EBE8E6] rounded-2xl text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
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

      <motion.p {...item(1.0)} className="text-center text-xs text-gray-500 mt-8 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-[#B58A63] font-semibold hover:text-[#9A6B60] transition-colors ml-1">
          Sign In
        </Link>
      </motion.p>
    </div>
  );
}
