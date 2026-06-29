'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, Suspense } from 'react';

import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validators/auth.schema';
import { authService } from '@/services/auth.service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      authService.resetPassword({ token: token!, new_password: values.new_password }),
    onSuccess: () => {
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 3000);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to reset password. The link may have expired.';
      toast.error(message);
    },
  });

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Invalid reset link</h1>
          <p className="text-muted-foreground text-sm">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button className="w-full">Request a new link</Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Password reset!</h1>
          <p className="text-muted-foreground text-sm">
            Your password has been reset successfully. Redirecting you to login...
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full">Go to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="text-muted-foreground text-sm">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit((v) => resetPassword(v))} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="new_password">New password</Label>
          <div className="relative">
            <Input
              id="new_password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('new_password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-destructive text-xs">{errors.new_password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Resetting password...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-32"><Loader2 className="animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
