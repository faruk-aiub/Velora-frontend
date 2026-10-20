'use client';

import * as React from 'react';
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
  Sun,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VeloraIcon } from '@/components/layout/VeloraLogo';
import { toast } from 'sonner';
import { contactService } from '@/services/contact.service';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

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
      { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
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


export function AdminClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadMessages, setUnreadMessages] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  React.useEffect(() => {
    // Parse auth state directly from localStorage to avoid Zustand hydration delays
    let isAuth = false;
    let userRole = '';
    try {
      const authStorage = localStorage.getItem('velora-auth');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        isAuth = parsed?.state?.isAuthenticated;
        userRole = parsed?.state?.user?.role || '';
      }
    } catch (e) { }

    if (!isAuth || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      router.replace('/login');
      return;
    }

    // Only fetch if logged in
    if (isAuth) {
      contactService.getUnreadCount()
        .then(res => setUnreadMessages(res.count))
        .catch(() => { });
    }
  }, [pathname, router, isAuthenticated, user]); // Refresh count on navigation


  const handleLogout = async () => {
    try {
      try {
        await authService.logout();
      } catch (e) {
        console.error('API logout failed, clearing local state anyway', e);
      }

      logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Find current active item title
  const currentItem = navigationGroups
    .flatMap(group => group.items)
    .find(item => pathname.startsWith(item.href));

  return (
    <div className="flex h-full w-full bg-[#F4F5F7] text-[#2D2826] font-sans selection:bg-[#BC8477] selection:text-white p-3.5 gap-4 overflow-hidden box-border">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 lg:w-[300px] bg-white rounded-2xl flex flex-col shadow-xs border border-stone-200/70 z-50 h-full shrink-0 fixed top-3.5 left-3.5 md:relative md:top-auto md:left-auto transition-transform duration-100 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-stone-100 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-wide text-stone-900" onClick={() => setIsMobileMenuOpen(false)}>
            <VeloraIcon size={32} />
            <span className="font-extrabold tracking-tight text-lg">Velora Admin</span>
          </Link>
          <button className="md:hidden text-stone-400 hover:text-stone-900" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3.5 space-y-4">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1.5">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#181514] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100/70 hover:text-stone-900'
                      }`}
                    >
                      <Icon className={isActive ? "text-[#BC8477]" : "text-stone-400"} size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.name === 'Messages' && unreadMessages > 0 && (
                        <span className="bg-[#BC8477] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadMessages}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 pb-6 border-t border-stone-100 shrink-0">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl py-2.5 px-3.5 text-sm font-bold" onClick={handleLogout}>
            <LogOut size={18} className="mr-2.5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-full">
        {/* Top Header Row */}
        <header className="h-16 bg-white rounded-2xl flex items-center justify-between px-6 shrink-0 shadow-xs border border-stone-200/70 mb-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-stone-600 hover:text-stone-900" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 truncate max-w-[200px] sm:max-w-none">
              {currentItem?.name || 'Dashboard'}
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <button className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors">
              <Bell size={17} />
            </button>
            <div className="flex items-center gap-3 ml-1">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-stone-900 leading-tight">Super Admin</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">admin@velora.com</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-100 overflow-hidden shrink-0 border border-stone-200/70 flex items-center justify-center font-bold text-xs text-[#BC8477]">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="max-w-7xl mx-auto pb-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
