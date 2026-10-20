'use client';

import { usePathname } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { GSAPLenisProvider } from './GSAPLenisProvider';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        children
      ) : (
        <GSAPLenisProvider>
          {children}
        </GSAPLenisProvider>
      )}
      <Toaster
        position="top-right"
        richColors
      />
      {mounted && process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
