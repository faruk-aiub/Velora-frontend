'use client';

import { useMutation } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      setTimeout(() => router.push('/login'), 4000);
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Invalid verification link</h1>
          <p className="text-muted-foreground text-sm">
            This link appears to be invalid or malformed.
          </p>
        </div>
        <Link href="/register">
          <Button className="w-full">Back to register</Button>
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-6 text-center">
        <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Verifying your email...</h1>
          <p className="text-muted-foreground text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Email verified! 🎉</h1>
          <p className="text-muted-foreground text-sm">
            Your email has been successfully verified. Redirecting you to login...
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full">Go to login</Button>
        </Link>
      </div>
    );
  }

  if (isError) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Verification failed. The link may have expired.';
    return (
      <div className="space-y-6 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Verification failed</h1>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        <Link href="/register">
          <Button className="w-full">Create a new account</Button>
        </Link>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-32"><Loader2 className="animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
