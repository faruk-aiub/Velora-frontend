'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import { wishlistService } from '@/services/wishlist.service';
import { reviewService } from '@/services/review.service';
import { cn } from '@/lib/utils';
import { MessagesTab } from '@/components/account/MessagesTab';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Package, MapPin, User as UserIcon, Heart, ShoppingCart,
  LogOut, Trash2, Plus, Star, Bell, HelpCircle, RotateCcw, Shield, CreditCard,
  ChevronRight, ChevronDown, Edit3, Eye, EyeOff, Loader2, Check, X, AlertCircle,
  Truck, Clock, CheckCircle, XCircle, ArrowRight, Phone, Mail, Camera, Save, MessageCircle
} from 'lucide-react';

type TabType =
  | 'dashboard' | 'profile' | 'orders' | 'tracking' | 'wishlist'
  | 'cart' | 'addresses' | 'payment' | 'reviews' | 'notifications'
  | 'messages' | 'support' | 'returns' | 'security';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  PENDING:    { color: 'text-amber-600',  bg: 'bg-amber-50',  icon: <Clock size={12} /> },
  PROCESSING: { color: 'text-blue-600',   bg: 'bg-blue-50',   icon: <Loader2 size={12} className="animate-spin" /> },
  SHIPPED:    { color: 'text-purple-600', bg: 'bg-purple-50', icon: <Truck size={12} /> },
  DELIVERED:  { color: 'text-green-600',  bg: 'bg-green-50',  icon: <CheckCircle size={12} /> },
  CANCELLED:  { color: 'text-red-600',    bg: 'bg-red-50',    icon: <XCircle size={12} /> },
};

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'profile',       label: 'My Profile',       icon: UserIcon },
  { id: 'orders',        label: 'My Orders',        icon: Package },
  { id: 'tracking',      label: 'Order Tracking',   icon: Truck },
  { id: 'wishlist',      label: 'Wishlist',         icon: Heart },
  { id: 'cart',          label: 'Shopping Cart',    icon: ShoppingCart },
  { id: 'addresses',     label: 'Addresses',        icon: MapPin },
  { id: 'payment',       label: 'Payment Methods',  icon: CreditCard },
  { id: 'reviews',       label: 'Reviews & Ratings',icon: Star },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'messages',      label: 'Messages',         icon: MessageCircle },
  { id: 'support',       label: 'Help & Support',   icon: HelpCircle },
  { id: 'returns',       label: 'Returns & Refunds',icon: RotateCcw },
  { id: 'security',      label: 'Security',         icon: Shield },
];

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="font-bold text-xl text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const EmptyState = ({ icon: Icon, message, action }: { icon: any; message: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-[#F5F2F0] rounded-full flex items-center justify-center mb-4">
      <Icon size={28} className="text-[#B5AFAD]" />
    </div>
    <p className="text-[#7A7371] mb-4">{message}</p>
    {action}
  </div>
);

const OrderStatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['PENDING'];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded', cfg.bg, cfg.color)}>
      {cfg.icon}{status}
    </span>
  );
};

export default function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout, setUser } = useAuthStore();
  const cartStore = useCartStore();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType | null;
    if (tabParam && NAV_ITEMS.some(item => item.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', phone: '' });

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    address_line1: '', city: '', postal_code: '', type: 'SHIPPING' as 'SHIPPING' | 'BILLING', is_default: false,
  });

  // Support form state
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

  // Review write state
  const [writeReview, setWriteReview] = useState<{ productId: string; rating: number; comment: string } | null>(null);

  // Return request state
  const [returnForm, setReturnForm] = useState({ orderId: '', reason: '', description: '' });

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    if (!user) router.push('/login');
    else setProfileForm({ first_name: user.first_name, last_name: user.last_name, phone: user.phone || '' });
  }, [user, router, mounted]);

  // ─── Queries ─────────────────────────────────────────────────────────────
  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(1, 50),
    enabled: !!user,
    refetchInterval: 5000,
  });

  const { data: addressesData, isLoading: loadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.getAddresses,
    enabled: !!user,
  });

  const { data: wishlistData, isLoading: loadingWishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: !!user,
  });

  const { data: myReviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewService.getMyReviews(1, 20),
    enabled: !!user && activeTab === 'reviews',
    retry: false,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: (data: { first_name: string; last_name: string; phone?: string }) =>
      userService.updateProfile(data),
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
      if (res.data && user) {
        setUser({ ...user, ...res.data });
      }
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await import('@/lib/axios').then(m => m.default.put('/users/me/password', data));
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: () => toast.error('Failed to change password. Check your current password.'),
  });

  const addAddressMutation = useMutation({
    mutationFn: userService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added!');
      setShowAddressForm(false);
      resetAddressForm();
    },
    onError: () => toast.error('Failed to add address'),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof addressForm }) =>
      userService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated!');
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
    },
    onError: () => toast.error('Failed to update address'),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: userService.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    },
    onError: () => toast.error('Failed to delete address'),
  });

  const removeWishlistMutation = useMutation({
    mutationFn: wishlistService.toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
  });

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    logout();
    toast.success('Logged out');
    router.push('/login');
  };

  const resetAddressForm = () => {
    setAddressForm({ address_line1: '', city: '', postal_code: '', type: 'SHIPPING', is_default: false });
  };

  const startEditAddress = (addr: { id: string; address_line1: string; city: string; postal_code: string; type: 'SHIPPING' | 'BILLING'; is_default: boolean }) => {
    setAddressForm({
      address_line1: addr.address_line1,
      city: addr.city,
      postal_code: addr.postal_code,
      type: addr.type,
      is_default: addr.is_default,
    });
    setEditingAddress(addr.id);
    setShowAddressForm(true);
  };

  if (!mounted || !user) return null;

  const orders = ordersData?.data || [];
  const addresses = addressesData?.data || [];
  const wishlistItems = wishlistData?.data || [];
  const cartItems = cartStore.items;

  const recentOrders = orders.slice(0, 3);
  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING');

  // ─── Shared Components ────────────────────────────────────────────────────
  const renderAddressForm = () => (
    <div className="border border-[#BC8477] p-6 bg-[#FAF8F5] mt-4">
      <h3 className="text-sm font-bold tracking-widest uppercase text-[#3A3331] mb-4">
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label-style">Street Address *</label>
          <input
            className="input-style"
            value={addressForm.address_line1}
            onChange={e => setAddressForm(f => ({ ...f, address_line1: e.target.value }))}
            placeholder="123 Main Street"
          />
        </div>
        <div>
          <label className="label-style">City *</label>
          <input
            className="input-style"
            value={addressForm.city}
            onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
            placeholder="Dhaka"
          />
        </div>
        <div>
          <label className="label-style">Postal Code *</label>
          <input
            className="input-style"
            value={addressForm.postal_code}
            onChange={e => setAddressForm(f => ({ ...f, postal_code: e.target.value }))}
            placeholder="1000"
          />
        </div>
        <div>
          <label className="label-style">Type</label>
          <select
            className="input-style"
            value={addressForm.type}
            onChange={e => setAddressForm(f => ({ ...f, type: e.target.value as 'SHIPPING' | 'BILLING' }))}
          >
            <option value="SHIPPING">Shipping</option>
            <option value="BILLING">Billing</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="is_default"
            checked={addressForm.is_default}
            onChange={e => setAddressForm(f => ({ ...f, is_default: e.target.checked }))}
            className="accent-[#BC8477] w-4 h-4"
          />
          <label htmlFor="is_default" className="text-sm text-[#3A3331]">Set as default</label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            if (!addressForm.address_line1 || !addressForm.city || !addressForm.postal_code) {
              toast.error('Please fill all required fields');
              return;
            }
            if (editingAddress) {
              updateAddressMutation.mutate({ id: editingAddress, data: addressForm });
            } else {
              addAddressMutation.mutate(addressForm);
            }
          }}
          disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
          className="btn-primary flex items-center gap-2"
        >
          {(addAddressMutation.isPending || updateAddressMutation.isPending)
            ? <Loader2 size={14} className="animate-spin" />
            : <Save size={14} />}
          {editingAddress ? 'Save Changes' : 'Add Address'}
        </button>
        <button
          onClick={() => { setShowAddressForm(false); setEditingAddress(null); resetAddressForm(); }}
          className="btn-ghost"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // ─── TAB CONTENT ─────────────────────────────────────────────────────────

  const renderDashboard = () => (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-[#BC8477]', bg: 'bg-[#BC8477]/10' },
          { label: 'Wishlist Items', value: wishlistItems.length, icon: Heart, color: 'text-gray-900', bg: 'bg-gray-100' },
          { label: 'Cart Items', value: cartItems.reduce((a, i) => a + i.quantity, 0), icon: ShoppingCart, color: 'text-[#BC8477]', bg: 'bg-[#BC8477]/10' },
          { label: 'Addresses', value: addresses.length, icon: MapPin, color: 'text-gray-900', bg: 'bg-gray-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-3xl p-6 shadow-sm border border-transparent hover:border-gray-100 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6 mb-8 flex-col lg:flex-row">
        {/* Quick Actions */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'View Orders', tab: 'orders' as TabType, icon: Package },
              { label: 'Edit Profile', tab: 'profile' as TabType, icon: Edit3 },
              { label: 'Track Order', tab: 'tracking' as TabType, icon: Truck },
              { label: 'My Wishlist', tab: 'wishlist' as TabType, icon: Heart },
              { label: 'Addresses', tab: 'addresses' as TabType, icon: MapPin },
              { label: 'Get Support', tab: 'support' as TabType, icon: HelpCircle },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => setActiveTab(action.tab)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F9FAFB] rounded-2xl hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 group-hover:text-[#BC8477] transition-colors">
                  <action.icon size={18} />
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-[#BC8477] hover:underline">
              View All
            </button>
          </div>
          {loadingOrders ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#BC8477]" /></div>
          ) : recentOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 mb-3">No orders yet.</p>
              <Link href="/shop" className="text-sm font-bold text-[#BC8477] hover:underline">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="bg-[#F9FAFB] rounded-2xl p-4 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Package size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">Order #{order.order_number}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="My Profile" subtitle="Manage your personal information and account settings" />

      {/* Avatar + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-6 bg-[#F9FAFB] rounded-2xl border border-gray-100">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#BC8477] to-[#9A6B60] flex items-center justify-center text-white font-bold text-4xl shadow-sm border-4 border-white">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-2xl text-gray-900">{user.first_name} {user.last_name}</h3>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <p className="text-xs font-bold text-gray-400 mt-2 bg-white px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 border border-gray-100 shadow-sm">
            Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <Edit3 size={16} className="text-gray-400" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Form */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="label-style">First Name</label>
            <input
              disabled={!isEditingProfile}
              className={cn('input-style', !isEditingProfile && 'bg-[#F5F2F0] cursor-not-allowed text-[#7A7371]')}
              value={profileForm.first_name}
              onChange={e => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-style">Last Name</label>
            <input
              disabled={!isEditingProfile}
              className={cn('input-style', !isEditingProfile && 'bg-[#F5F2F0] cursor-not-allowed text-[#7A7371]')}
              value={profileForm.last_name}
              onChange={e => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-style">Email Address</label>
            <input disabled className="input-style bg-[#F5F2F0] cursor-not-allowed text-[#7A7371]" value={user.email} />
          </div>
          <div>
            <label className="label-style">Phone Number</label>
            <input
              disabled={!isEditingProfile}
              className={cn('input-style', !isEditingProfile && 'bg-[#F5F2F0] cursor-not-allowed text-[#7A7371]')}
              value={profileForm.phone}
              onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+880 1234 567890"
            />
          </div>
        </div>
        {isEditingProfile && (
          <button
            onClick={() => updateProfileMutation.mutate(profileForm)}
            disabled={updateProfileMutation.isPending}
            className="btn-primary mt-6 flex items-center gap-2"
          >
            {updateProfileMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        )}
      </div>

      {/* Change Password */}
      <div className="pt-8 border-t border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
        <div className="max-w-md space-y-4">
          {(['current', 'new', 'confirm'] as const).map((field) => (
            <div key={field}>
              <label className="label-style">
                {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPw[field] ? 'text' : 'password'}
                  className="input-style pr-10"
                  value={field === 'current' ? pwForm.currentPassword : field === 'new' ? pwForm.newPassword : pwForm.confirmPassword}
                  onChange={e => setPwForm(f => ({
                    ...f,
                    [field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword']: e.target.value,
                  }))}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5AFAD] hover:text-[#7A7371]"
                >
                  {showPw[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              if (pwForm.newPassword !== pwForm.confirmPassword) {
                toast.error('Passwords do not match');
                return;
              }
              if (pwForm.newPassword.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
              }
              changePasswordMutation.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            }}
            disabled={changePasswordMutation.isPending}
            className="btn-primary mt-6 flex items-center gap-2"
          >
            {changePasswordMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="My Orders" subtitle="Track and manage all your orders" />
      {loadingOrders ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#BC8477] w-8 h-8" /></div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          message="You haven't placed any orders yet."
          action={<Link href="/shop" className="btn-primary">Browse Shop</Link>}
        />
      ) : (
        <div className="space-y-4 mt-6">
          {orders.map(order => (
            <div key={order.id} className="bg-[#F9FAFB] rounded-2xl overflow-hidden border border-gray-100 transition-all hover:border-gray-200 hover:shadow-sm">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Package size={20} className="text-[#BC8477]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">Order #{order.order_number}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Total</p>
                    <p className="font-bold text-base text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              {/* Order Items */}
              <div className="p-5 space-y-3 bg-white">
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-14 h-14 min-w-[56px] rounded-xl bg-[#F9FAFB] overflow-hidden">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.product_name || 'Product'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={18} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product_name || `Item ${item.sku}`}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTracking = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Order Tracking" subtitle="Track the current status of your orders" />
      {pendingOrders.length === 0 ? (
        <EmptyState
          icon={Truck}
          message="No active shipments to track."
          action={
            <button onClick={() => setActiveTab('orders')} className="btn-ghost">
              View Order History
            </button>
          }
        />
      ) : (
        <div className="space-y-6 mt-6">
          {pendingOrders.map(order => {
            const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
            const currentStep = steps.indexOf(order.status);
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between mb-3">
                    {steps.map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                        <div className={cn(
                          'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all bg-white',
                          idx <= currentStep
                            ? 'border-[#BC8477] text-[#BC8477]'
                            : 'border-gray-200 text-gray-400'
                        )}>
                          {idx < currentStep ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className={cn(
                          'text-xs font-bold text-center hidden sm:block',
                          idx <= currentStep ? 'text-gray-900' : 'text-gray-400'
                        )}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 left-[10%] right-[10%] h-1 -z-0 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-100" />
                    <div
                      className="absolute top-0 left-0 h-full bg-[#BC8477] transition-all duration-500 rounded-full"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-3">
                  <Truck className="text-blue-500 shrink-0" size={20} />
                  <p className="text-sm text-blue-900">
                    <span className="font-bold">Estimated Delivery:</span>{' '}
                    {new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="My Wishlist" subtitle={`${wishlistItems.length} saved items`} />
      {loadingWishlist ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#BC8477] w-8 h-8" /></div>
      ) : wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          message="Your wishlist is empty."
          action={<Link href="/shop" className="btn-primary">Discover Products</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {wishlistItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/product/${item.product.slug}`} className="block relative aspect-[4/5] bg-gray-50 overflow-hidden">
                <Image
                  src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={item.product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-5">
                <p className="text-xs font-bold text-gray-500 mb-1">{item.product.brand?.name}</p>
                <Link href={`/product/${item.product.slug}`}>
                  <p className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors line-clamp-1">
                    {item.product.title}
                  </p>
                </Link>
                <p className="text-base text-[#BC8477] font-bold mt-1">
                  ${Number(item.product.variants?.[0]?.price || 0).toFixed(2)}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (item.product.variants?.[0]) {
                        cartStore.addItem(item.product as any, item.product.variants[0] as any, 1);
                        cartStore.openCart();
                        toast.success('Added to cart!');
                      }
                    }}
                    className="flex-1 text-xs font-bold bg-gray-900 rounded-xl text-white py-2 hover:bg-[#BC8477] transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeWishlistMutation.mutate(item.product.id)}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Shopping Cart" subtitle={`${cartItems.reduce((a, i) => a + i.quantity, 0)} items in your cart`} />
      {cartItems.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          message="Your cart is empty."
          action={<Link href="/shop" className="btn-primary">Continue Shopping</Link>}
        />
      ) : (
        <div className="space-y-4 mt-6">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
              <div className="relative w-20 h-24 min-w-[80px] rounded-xl bg-gray-50 overflow-hidden">
                <Image
                  src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-xs font-bold text-gray-500 mb-1">{item.product.brand?.name}</p>
                <Link href={`/product/${item.product.slug}`}>
                  <p className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors line-clamp-1">
                    {item.product.title}
                  </p>
                </Link>
                <p className="text-sm font-bold text-[#BC8477] mt-1">${Number(item.variant.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors"
                  >−</button>
                  <span className="w-8 flex items-center justify-center text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors"
                  >+</button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-base font-bold text-gray-900 w-20 text-right">
                    ${(Number(item.variant.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => cartStore.removeItem(item.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[#F9FAFB] rounded-2xl border border-gray-100 p-6 mt-6">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-gray-600 font-bold">Subtotal</span>
              <span className="text-gray-900 font-bold">${cartStore.getTotalPrice().toFixed(2)}</span>
            </div>
            {cartStore.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-green-600 font-bold">Discount ({cartStore.couponCode})</span>
                <span className="text-green-600 font-bold">-${cartStore.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-bold pt-4 border-t border-gray-200 mt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-2xl text-gray-900">${cartStore.getFinalPrice().toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={() => { cartStore.clearCart(); toast.success('Cart cleared'); }} className="btn-ghost flex-1">
                Clear Cart
              </button>
              <Link href="/checkout" className="btn-primary flex-[2] text-center justify-center flex">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Address Management" subtitle="Manage your shipping and billing addresses" />
      <button
        onClick={() => { setShowAddressForm(!showAddressForm); setEditingAddress(null); resetAddressForm(); }}
        className="btn-primary flex items-center gap-2 mb-6"
      >
        <Plus size={16} /> Add New Address
      </button>
      {showAddressForm && renderAddressForm()}

      {loadingAddresses ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#BC8477]" /></div>
      ) : addresses.length === 0 ? (
        <EmptyState icon={MapPin} message="No saved addresses yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {addresses.map(addr => (
            <div key={addr.id} className={cn(
              'relative p-6 rounded-2xl border transition-colors',
              addr.is_default ? 'border-[#BC8477] bg-[#FDF9F8] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
            )}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-[#BC8477]" />
                <span className="text-xs font-bold text-gray-500 uppercase">{addr.type}</span>
                {addr.is_default && (
                  <span className="bg-[#BC8477] text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto">Default</span>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">{addr.address_line1}</p>
              <p className="text-sm text-gray-500">{addr.city}, {addr.postal_code}</p>

              <div className="flex gap-2 mt-5 pt-5 border-t border-gray-100">
                <button
                  onClick={() => startEditAddress(addr)}
                  className="flex flex-1 items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => deleteAddressMutation.mutate(addr.id)}
                  className="flex flex-1 items-center justify-center gap-2 text-sm font-bold text-red-500 bg-red-50 py-2 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPayment = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Payment Methods" subtitle="Manage your saved payment methods" />
      <div className="bg-[#F9FAFB] rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
          <CreditCard size={28} className="text-gray-400" />
        </div>
        <p className="text-base font-bold text-gray-900 mb-2">Payment method management coming soon.</p>
        <p className="text-sm text-gray-500">Currently payments are processed at checkout.</p>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm text-gray-500">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 10).map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Order #{order.order_number}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    PAID
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Reviews & Ratings" subtitle="Your product reviews and ratings" />

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Write a Review</h3>
        <p className="text-sm text-gray-500 mb-6">
          Purchased a product recently? Share your experience by going to the product page.
        </p>
        <Link href="/shop" className="btn-ghost flex items-center gap-2 w-fit">
          <Package size={16} className="text-gray-400" /> Browse Purchased Products
        </Link>
      </div>

      {loadingReviews ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#BC8477]" /></div>
      ) : myReviewsData?.data && myReviewsData.data.length > 0 ? (
        <div className="space-y-4">
          {myReviewsData.data.map((review: any) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                    {review.product.images?.[0]?.url ? (
                      <Image src={review.product.images[0].url} alt={review.product.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-400" size={20} /></div>
                    )}
                  </div>
                  <div>
                    <Link href={`/product/${review.product.slug}`} className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors line-clamp-1">
                      {review.product.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className={star <= review.rating ? "fill-[#BC8477] text-[#BC8477]" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium bg-[#F9FAFB] p-4 rounded-xl border border-gray-50">
                {review.comment || 'No comment provided.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
            <Star size={28} className="text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">Your reviews will appear here once submitted.</p>
          <p className="text-sm text-gray-500">Visit any product page to leave a review.</p>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Notifications" subtitle="Stay updated on orders, promotions, and more" />
      {[
        { title: 'Order Placed Successfully', body: 'Your order has been placed and is being processed.', time: '2 hours ago', type: 'order', read: false },
        { title: 'Welcome to Velora!', body: 'Thank you for joining us. Enjoy your first purchase.', time: '1 day ago', type: 'system', read: true },
        { title: 'Special Offer: 20% Off', body: 'Use code VELORA20 for 20% off your next purchase.', time: '3 days ago', type: 'promo', read: true },
      ].map((notif, i) => (
        <div key={i} className={cn(
          'bg-white border p-5 mb-3 flex gap-4 rounded-2xl transition-shadow',
          !notif.read ? 'border-[#BC8477] shadow-sm' : 'border-gray-100 hover:shadow-sm'
        )}>
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5',
            notif.type === 'order' ? 'bg-blue-50 text-blue-600' : notif.type === 'promo' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
          )}>
            {notif.type === 'order' ? <Package size={20} /> :
             notif.type === 'promo' ? <Bell size={20} /> :
             <Bell size={20} />}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <p className={cn('text-sm font-bold', notif.read ? 'text-gray-500' : 'text-gray-900')}>{notif.title}</p>
              {!notif.read && <span className="w-2 h-2 bg-[#BC8477] rounded-full shrink-0 mt-1.5" />}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{notif.body}</p>
            <p className="text-xs text-gray-400 mt-2 font-bold">{notif.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupport = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Help & Support" subtitle="Get help with your orders and account" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Phone, label: 'Call Us', value: '+880 1234 567890' },
          { icon: Mail, label: 'Email Us', value: 'support@velora.com' },
          { icon: Clock, label: 'Support Hours', value: 'Mon–Sat, 9am–6pm' },
        ].map(c => (
          <div key={c.label} className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <c.icon size={20} className="text-[#BC8477]" />
            </div>
            <p className="text-xs font-bold text-gray-500 mb-1">{c.label}</p>
            <p className="text-sm font-bold text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Submit a Request</h3>
        <div className="max-w-lg space-y-4">
          <div>
            <label className="label-style">Subject</label>
            <select
              className="input-style"
              value={supportForm.subject}
              onChange={e => setSupportForm(f => ({ ...f, subject: e.target.value }))}
            >
              <option value="">Select a topic...</option>
              <option value="order">Order Issue</option>
              <option value="return">Return/Refund</option>
              <option value="product">Product Query</option>
              <option value="account">Account Problem</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-style">Message</label>
            <textarea
              rows={5}
              className="input-style resize-none"
              placeholder="Describe your issue in detail..."
              value={supportForm.message}
              onChange={e => setSupportForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <button
            onClick={() => {
              if (!supportForm.subject || !supportForm.message) {
                toast.error('Please fill all fields');
                return;
              }
              toast.success('Support request submitted! We\'ll respond within 24 hours.');
              setSupportForm({ subject: '', message: '' });
            }}
            className="btn-primary"
          >
            Submit Request
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: 'How do I track my order?', a: 'Go to My Account → Order Tracking to see real-time status of your orders.' },
            { q: 'Can I change my order after placing it?', a: 'Orders can only be modified before they enter the processing stage. Contact support immediately.' },
            { q: 'What is the return policy?', a: 'We accept returns within 30 days of delivery for unused items in original packaging.' },
            { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days. Express options are available at checkout.' },
          ].map((faq, i) => (
            <details key={i} className="group border border-gray-100 rounded-2xl bg-[#F9FAFB]">
              <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-bold text-gray-900 list-none">
                {faq.q}
                <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-sm text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReturns = () => (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
      <SectionHeader title="Returns & Refunds" subtitle="Request returns and track refund status" />

      <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Submit Return Request</h3>
        <div className="max-w-lg space-y-4">
          <div>
            <label className="label-style">Select Order</label>
            <select
              className="input-style"
              value={returnForm.orderId}
              onChange={e => setReturnForm(f => ({ ...f, orderId: e.target.value }))}
            >
              <option value="">Choose an order...</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  Order #{order.order_number} — ${Number(order.total_amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-style">Return Reason</label>
            <select
              className="input-style"
              value={returnForm.reason}
              onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))}
            >
              <option value="">Select reason...</option>
              <option value="defective">Defective / Damaged Item</option>
              <option value="wrong">Wrong Item Received</option>
              <option value="notdescribed">Not as Described</option>
              <option value="changed_mind">Changed My Mind</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-style">Additional Details</label>
            <textarea
              rows={4}
              className="input-style resize-none"
              placeholder="Please describe the issue in detail..."
              value={returnForm.description}
              onChange={e => setReturnForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <button
            onClick={() => {
              if (!returnForm.orderId || !returnForm.reason) {
                toast.error('Please select an order and reason');
                return;
              }
              toast.success('Return request submitted! We\'ll process it within 3–5 business days.');
              setReturnForm({ orderId: '', reason: '', description: '' });
            }}
            className="btn-primary flex items-center gap-2"
          >
            <RotateCcw size={16} /> Submit Return Request
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-blue-900 mb-3">Return Policy</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          {[
            '30-day return window from delivery date',
          ].map(point => (
            <li key={point} className="flex items-start gap-2">
              <Check size={14} className="text-[#BC8477] shrink-0 mt-0.5" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div>
      <SectionHeader title="Security" subtitle="Manage your account security and active sessions" />

      <div className="bg-white border border-[#E8E1DE] p-8 mb-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-6">Account Security Status</h3>
        <div className="space-y-4 max-w-md">
          {[
            { label: 'Email Verified', status: user.is_email_verified, action: 'Verify Now' },
            { label: 'Password Strength', status: true, detail: 'Last changed recently' },
            { label: 'Two-Factor Authentication', status: false, action: 'Enable 2FA' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 border border-[#E8E1DE]">
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center',
                  item.status ? 'bg-green-50' : 'bg-amber-50'
                )}>
                  {item.status
                    ? <Check size={14} className="text-green-600" />
                    : <AlertCircle size={14} className="text-amber-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#3A3331]">{item.label}</p>
                  {item.detail && <p className="text-xs text-[#B5AFAD]">{item.detail}</p>}
                </div>
              </div>
              {item.action && (
                <button className="text-[10px] font-bold tracking-widest uppercase text-[#BC8477] hover:text-[#9A6B60]">
                  {item.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DE] p-8 mb-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-4">Active Sessions</h3>
        <div className="flex items-center justify-between p-4 border border-[#BC8477] bg-[#FDF9F8]">
          <div>
            <p className="text-sm font-medium text-[#3A3331]">Current Session</p>
            <p className="text-xs text-[#7A7371]">Web Browser • Active now</p>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 px-2 py-1">Active</span>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 p-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-red-700 mb-3">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">Once you logout, you will need to sign in again to access your account.</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-red-700 transition-colors"
        >
          <LogOut size={14} /> Logout from All Sessions
        </button>
      </div>
    </div>
  );

  const TAB_RENDERERS: Record<TabType, () => React.ReactNode> = {
    dashboard: renderDashboard,
    profile: renderProfile,
    orders: renderOrders,
    tracking: renderTracking,
    wishlist: renderWishlist,
    cart: renderCart,
    addresses: renderAddresses,
    payment: renderPayment,
    reviews: renderReviews,
    notifications: renderNotifications,
    messages: () => <MessagesTab />,
    support: renderSupport,
    returns: renderReturns,
    security: renderSecurity,
  };

  return (
    <>
      <style jsx global>{`
        .label-style {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #4B5563;
          margin-bottom: 6px;
        }
        .input-style {
          width: 100%;
          height: 48px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 14px;
          color: #111827;
          background: #F9FAFB;
          outline: none;
          transition: all 0.2s;
        }
        .input-style:focus {
          border-color: #BC8477;
          background: white;
          box-shadow: 0 0 0 4px rgba(188, 132, 119, 0.1);
        }
        .input-style:is(textarea) {
          height: auto;
          padding: 12px 16px;
          border-radius: 16px;
        }
        .input-style:is(select) {
          appearance: none;
          cursor: pointer;
        }
        .btn-primary {
          height: 48px;
          padding: 0 24px;
          background: #BC8477;
          color: white;
          font-size: 13px;
          font-weight: 700;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }
        .btn-primary:hover { background: #9A6B60; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-ghost {
          height: 48px;
          padding: 0 24px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #4B5563;
          font-size: 13px;
          font-weight: 600;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: #BC8477; color: #BC8477; background: #FDF9F8; }
      `}</style>

      <main className="w-full min-h-screen py-8 lg:py-12 bg-[#F3F4F6]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">

          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <div>
              <h1 className="font-bold text-2xl text-gray-900">Velora</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-bold text-gray-700 shadow-sm"
            >
              <LayoutDashboard size={16} /> Menu
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className={cn(
              'w-64 shrink-0 flex-col gap-2 bg-white rounded-[32px] p-4 shadow-sm h-fit sticky top-12',
              sidebarOpen ? 'flex fixed inset-0 z-50 rounded-none w-full h-full pt-8 px-6 pb-8 overflow-y-auto' : 'hidden lg:flex'
            )}>
              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-500 bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              )}

              {/* Logo / Header Area */}
              <div className="flex items-center gap-3 px-4 py-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#BC8477] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-900 truncate">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as TabType); setSidebarOpen(false); }}
                  className={cn(
                    'flex items-center gap-4 w-full text-left px-5 py-3.5 transition-all text-sm rounded-2xl',
                    activeTab === item.id
                      ? 'bg-[#F3F4F6] text-gray-900 font-bold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  )}
                >
                  <item.icon size={20} className={cn("shrink-0", activeTab === item.id ? "text-gray-900" : "text-gray-400")} />
                  <span className="text-sm">{item.label}</span>
                  {item.id === 'notifications' && (
                    <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                  )}
                </button>
              ))}

              <div className="h-px bg-gray-100 my-4 mx-4" />

              {/* Admin Panel Link */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-4 w-full text-left px-5 py-3.5 text-gray-600 hover:bg-gray-50 rounded-2xl font-medium"
                >
                  <Shield size={20} className="text-[#BC8477] shrink-0" />
                  <span className="text-sm">Admin Panel</span>
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full text-left px-5 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl font-medium transition-colors"
              >
                <LogOut size={20} className="shrink-0" />
                <span className="text-sm">Logout</span>
              </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Top Navigation Row */}
              <div className="hidden lg:flex items-center justify-between mb-8 bg-white rounded-full p-2 pr-4 shadow-sm">
                <h1 className="font-bold text-2xl text-gray-900 pl-6 py-2">
                  {NAV_ITEMS.find(n => n.id === activeTab)?.label}
                </h1>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2.5 bg-[#F3F4F6] rounded-full text-sm outline-none w-64 focus:ring-2 ring-[#BC8477]/20" />
                    <HelpCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
                    Explore
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-gray-600 hover:bg-gray-200">
                    <Bell size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                    <Image src="/placeholder.jpg" alt="Profile" width={40} height={40} className="object-cover" />
                  </div>
                </div>
              </div>

              {TAB_RENDERERS[activeTab]()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
