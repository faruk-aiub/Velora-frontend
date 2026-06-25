'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validators/auth.schema';
import { authService } from '@/services/auth.service';

const item = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: sendReset, isPending } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (_, variables) => { setSentTo(variables.email); setEmailSent(true); },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to send reset email.';
      toast.error(msg);
    },
  });

  if (emailSent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="text-center space-y-7">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: 'hsl(10 30% 94%)' }}>
          <Mail className="w-9 h-9" style={{ color: 'hsl(10 30% 55%)' }} />
        </motion.div>
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-light" style={{ color: 'hsl(20 15% 12%)' }}>Check your inbox</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'hsl(20 10% 48%)' }}>
            We sent a reset link to <span className="font-medium" style={{ color: 'hsl(20 15% 20%)' }}>{sentTo}</span>. It expires in 1 hour.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <button onClick={() => { setEmailSent(false); setSentTo(''); }}
            className="w-full h-12 border text-sm font-medium tracking-wide transition-all duration-300"
            style={{ borderColor: 'hsl(35 20% 82%)', color: 'hsl(20 15% 25%)', background: 'white', borderRadius: '2px' }}>
            Try a different email
          </button>
          <Link href="/login">
            <button className="w-full h-11 flex items-center justify-center gap-2 text-sm" style={{ color: 'hsl(20 10% 50%)' }}>
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div {...item(0)} className="space-y-2">
        <p className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: 'hsl(10 30% 55%)' }}>Account Recovery</p>
        <h1 className="font-serif text-4xl font-light tracking-wide" style={{ color: 'hsl(20 15% 12%)' }}>
          Reset your{' '}<span className="italic" style={{ color: 'hsl(10 30% 55%)' }}>password</span>
        </h1>
        <p className="text-sm font-light" style={{ color: 'hsl(20 10% 48%)' }}>Enter your email and we&apos;ll send you a secure reset link.</p>
      </motion.div>

      <motion.div {...item(0.05)} className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: 'hsl(35 20% 88%)' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(10 30% 55%)' }} />
        <div className="flex-1 h-px" style={{ background: 'hsl(35 20% 88%)' }} />
      </motion.div>

      <form onSubmit={handleSubmit((v) => sendReset(v))} className="space-y-6">
        <motion.div {...item(0.1)} className="space-y-2">
          <label htmlFor="email" className="block text-xs font-medium tracking-widest uppercase" style={{ color: 'hsl(20 15% 35%)' }}>
            Email Address
          </label>
          <input id="email" type="email" placeholder="your@email.com"
            className="w-full h-11 px-0 text-sm border-0 border-b-2 outline-none transition-all duration-300 bg-transparent"
            style={{ borderColor: errors.email ? 'hsl(0 72% 51%)' : 'hsl(35 20% 82%)', color: 'hsl(20 15% 15%)' }}
            onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = 'hsl(10 30% 55%)'; }}
            {...register('email')} />
          {errors.email && <p className="text-xs" style={{ color: 'hsl(0 72% 51%)' }}>{errors.email.message}</p>}
        </motion.div>

        <motion.div {...item(0.17)}>
          <button type="submit" disabled={isPending}
            className="w-full h-12 flex items-center justify-center gap-2 text-sm font-medium tracking-widest uppercase transition-all duration-300 group"
            style={{ background: 'hsl(10 30% 55%)', color: 'white', borderRadius: '2px' }}
            onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.background = 'hsl(10 30% 43%)'; }}
            onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.background = 'hsl(10 30% 55%)'; }}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : (
              <>Send Reset Link <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div {...item(0.24)}>
        <Link href="/login">
          <button className="w-full h-11 flex items-center justify-center gap-2 text-sm border transition-all duration-300"
            style={{ borderColor: 'hsl(35 20% 82%)', color: 'hsl(20 10% 45%)', background: 'transparent', borderRadius: '2px' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
