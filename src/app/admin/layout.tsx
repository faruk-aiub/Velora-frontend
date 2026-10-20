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
    <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased bg-[#F4F5F7] h-full overflow-hidden`}
        style={{
          zoom: 0.8,
          width: 'calc(100vw / 0.8)',
          height: 'calc(100vh / 0.8)',
          maxWidth: 'calc(100vw / 0.8)',
          maxHeight: 'calc(100vh / 0.8)',
        }}
      >
        <Providers>
          <div className="w-full h-full overflow-hidden">
            <AdminClientShell>{children}</AdminClientShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
