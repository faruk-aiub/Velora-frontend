'use client';

import { usePathname } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { GSAPLenisProvider } from './GSAPLenisProvider';

export function Providers({ children }: { children: React.ReactNode }) {
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
