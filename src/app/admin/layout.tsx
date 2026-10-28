import '../globals.css';
import { Inter } from 'next/font/google';
import { AdminClientShell } from './AdminClientShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Velora Admin Panel',
  description: 'Enterprise E-commerce Administration',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

import { Providers } from '@/components/providers';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="admin-html h-full">
      <body
        suppressHydrationWarning
        className={`${inter.className} admin-body antialiased bg-[#F4F5F7] h-full min-h-screen lg:min-h-0 text-[#2D2826] overflow-x-hidden`}
      >
        <Providers>
          <div className="w-full h-full min-h-screen lg:min-h-0 flex flex-col overflow-hidden">
            <AdminClientShell>{children}</AdminClientShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
