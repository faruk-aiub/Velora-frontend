'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart, 
  Package, 
  ListTree, 
  Tag, 
  Warehouse, 
  ShoppingCart, 
  CreditCard, 
  Ticket, 
  Users, 
  Star, 
  Image as ImageIcon, 
  Bell, 
  ShieldAlert, 
  History, 
  Settings, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ThemeProvider, useTheme } from 'next-themes';

const navigationGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    ]
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: ListTree },
      { name: 'Brands', href: '/admin/brands', icon: Tag },
      { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
    ]
  },
  {
    label: 'Sales',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    ]
  },
  {
    label: 'Customers',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'CMS & Banners', href: '/admin/cms', icon: ImageIcon },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Admins & Roles', href: '/admin/admins', icon: ShieldAlert },
      { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function AdminClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the login page, render clean layout without sidebar
  if (pathname === '/admin/login') {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    );
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      await fetch('http://localhost:3000/api/v1/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('admin_access_token');
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  // Find current active item title
  const currentItem = navigationGroups
    .flatMap(group => group.items)
    .find(item => pathname.startsWith(item.href));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col hidden md:flex">
          <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-1 rounded-md text-sm">V</span>
              Velora Admin
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.label}>
                <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
            <div className="font-semibold text-lg text-zinc-800 dark:text-zinc-200">
              {currentItem?.name || 'Admin Panel'}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-medium text-sm text-zinc-600 dark:text-zinc-300">
                SA
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
