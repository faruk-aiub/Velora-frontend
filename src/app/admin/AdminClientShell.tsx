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
    } catch (e) {}

    if (!isAuth || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      router.replace('/login');
      return;
    }

    // Only fetch if logged in
    if (isAuth) {
      contactService.getUnreadCount()
        .then(res => setUnreadMessages(res.count))
        .catch(() => {});
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
    <div className="flex h-screen bg-[#F3F4F6] text-[#3A3331] font-sans selection:bg-[#BC8477] selection:text-white p-4 gap-6">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white rounded-[32px] flex flex-col shadow-sm z-50 h-[calc(100dvh-2rem)] md:h-[calc(100vh-2rem)] shrink-0 fixed top-4 left-4 md:relative md:top-auto md:left-auto transition-transform duration-75 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}`}>
        <div className="flex h-20 items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-wide text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="bg-[#BC8477] text-white w-10 h-10 flex items-center justify-center rounded-2xl font-sans font-bold text-lg">V</span>
            Velora Admin
          </Link>
          <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
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
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-75 ${
                        isActive
                          ? 'bg-[#F3F4F6] text-gray-900'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={isActive ? "text-gray-900" : "text-gray-400"} size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="flex-1">{item.name}</span>
                      {item.name === 'Messages' && unreadMessages > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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

        <div className="p-6 border-t border-gray-100 shrink-0">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl py-6 font-bold" onClick={handleLogout}>
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Row */}
        <header className="h-16 bg-white rounded-full flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm mb-6 mt-2 mr-2 ml-2 md:ml-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="font-bold text-xl sm:text-2xl tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-none">
              {currentItem?.name || 'Admin Panel'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900">Super Admin</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">admin@velora.com</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center font-bold text-[#BC8477]">
                SA
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto pb-8 pr-2">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
