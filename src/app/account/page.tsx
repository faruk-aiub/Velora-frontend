'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import { wishlistService } from '@/services/wishlist.service';
import { Loader2, LogOut, Package, MapPin, User as UserIcon, Trash2, Plus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/ProductCard';

type TabType = 'orders' | 'addresses' | 'profile' | 'wishlist';

export default function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(1, 20),
    enabled: !!user && activeTab === 'orders',
  });

  const { data: addressesData, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.getAddresses,
    enabled: !!user && activeTab === 'addresses',
  });

  const { data: wishlistData, isLoading: isLoadingWishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: !!user && activeTab === 'wishlist',
  });

  const deleteAddressMutation = useMutation({
    mutationFn: userService.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
    },
    onError: () => toast.error('Failed to delete address'),
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      // Fallback
      logout();
      router.push('/login');
    }
  };

  if (!mounted || !user) return null;

  const orders = ordersData?.data || [];
  const addresses = addressesData?.data || [];
  const wishlistItems = wishlistData?.data || [];

  return (
    <main className="w-full min-h-screen pt-24 pb-20 bg-[#FAF8F5]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="font-serif text-4xl text-[#3A3331] font-light mb-2">My Account</h1>
            <p className="text-sm text-[#7A7371]">Welcome back, {user.first_name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#7A7371] hover:text-[#E46962] transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn("flex items-center gap-3 w-full text-left p-4 border transition-colors", activeTab === 'orders' ? "bg-white border-[#BC8477] text-[#BC8477]" : "bg-transparent border-transparent text-[#7A7371] hover:bg-[#F5F2F0]")}
            >
              <Package size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Orders</span>
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={cn("flex items-center gap-3 w-full text-left p-4 border transition-colors", activeTab === 'addresses' ? "bg-white border-[#BC8477] text-[#BC8477]" : "bg-transparent border-transparent text-[#7A7371] hover:bg-[#F5F2F0]")}
            >
              <MapPin size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Addresses</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={cn("flex items-center gap-3 w-full text-left p-4 border transition-colors", activeTab === 'profile' ? "bg-white border-[#BC8477] text-[#BC8477]" : "bg-transparent border-transparent text-[#7A7371] hover:bg-[#F5F2F0]")}
            >
              <UserIcon size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={cn("flex items-center gap-3 w-full text-left p-4 border transition-colors", activeTab === 'wishlist' ? "bg-white border-[#BC8477] text-[#BC8477]" : "bg-transparent border-transparent text-[#7A7371] hover:bg-[#F5F2F0]")}
            >
              <Heart size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Wishlist</span>
            </button>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white p-8 border border-[#E8E1DE]">
                <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331] mb-6">Order History</h2>
                {isLoadingOrders ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#BC8477]" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[#7A7371] mb-4">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="text-xs font-bold tracking-widest uppercase text-[#BC8477] hover:text-[#9A6B60] underline underline-offset-4">Browse Shop</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-[#E8E1DE] p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start border-b border-[#E8E1DE] pb-4">
                          <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-[#7A7371] mb-1">Order #{order.order_number}</p>
                            <p className="text-sm text-[#3A3331]">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-serif text-[#3A3331] mb-1">${order.total_amount.toFixed(2)}</p>
                            <span className="inline-block bg-[#F5F2F0] text-[#3A3331] text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-sm text-[#7A7371]">
                              <span className="font-medium text-[#3A3331]">{item.quantity}x</span> Item
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-8 border border-[#E8E1DE]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331]">Saved Addresses</h2>
                  <Link href="/checkout" className="flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] uppercase text-[#BC8477] hover:text-[#9A6B60]">
                    <Plus size={14} /> Add New
                  </Link>
                </div>
                {isLoadingAddresses ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#BC8477]" /></div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[#7A7371]">No saved addresses.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="relative p-6 border border-[#E8E1DE] hover:border-[#D5CFCD] transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin size={16} className="text-[#7A7371]" />
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A7371]">{addr.type}</span>
                          {addr.is_default && (
                            <span className="bg-[#E8E1DE] text-[#3A3331] text-[9px] px-2 py-0.5 uppercase tracking-widest">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-[#3A3331] font-medium mb-1">{addr.address_line1}</p>
                        <p className="text-xs text-[#7A7371] mb-6">{addr.city}, {addr.postal_code}</p>
                        
                        <button 
                          onClick={() => deleteAddressMutation.mutate(addr.id)}
                          className="absolute bottom-4 right-4 text-[#B5AFAD] hover:text-[#E46962] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 border border-[#E8E1DE]">
                <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331] mb-6">Profile Settings</h2>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase mb-1">First Name</label>
                    <input disabled value={user.first_name} className="w-full h-12 bg-[#F5F2F0] px-4 text-sm text-[#7A7371] cursor-not-allowed border-none focus:ring-0" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase mb-1">Last Name</label>
                    <input disabled value={user.last_name} className="w-full h-12 bg-[#F5F2F0] px-4 text-sm text-[#7A7371] cursor-not-allowed border-none focus:ring-0" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase mb-1">Email Address</label>
                    <input disabled value={user.email} className="w-full h-12 bg-[#F5F2F0] px-4 text-sm text-[#7A7371] cursor-not-allowed border-none focus:ring-0" />
                  </div>
                  <p className="text-xs text-[#B5AFAD] italic pt-4">Profile editing is currently disabled in this demo.</p>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 border border-[#E8E1DE]">
                <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331] mb-6">My Wishlist</h2>
                {isLoadingWishlist ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#BC8477]" /></div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[#7A7371]">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <ProductCard 
                        key={item.id} 
                        id={item.product.id}
                        title={item.product.title}
                        slug={item.product.slug}
                        images={item.product.images}
                        variants={item.product.variants}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
