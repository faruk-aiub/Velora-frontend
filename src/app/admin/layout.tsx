import '../globals.css';
import { Inter } from 'next/font/google';
import { AdminClientShell } from './AdminClientShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Velora Admin Panel',
  description: 'Enterprise E-commerce Administration',
};

import { Providers } from '@/components/providers';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AdminClientShell>{children}</AdminClientShell>
        </Providers>
      </body>
    </html>
  );
}
