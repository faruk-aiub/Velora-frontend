'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Package, MapPin, User as UserIcon, Heart, ShoppingCart,
  LogOut, Trash2, Plus, Star, Bell, HelpCircle, RotateCcw, Shield, CreditCard,
  ChevronRight, ChevronDown, Edit3, Eye, EyeOff, Loader2, Check, X, AlertCircle,
  Truck, Clock, CheckCircle, XCircle, ArrowRight, Phone, Mail, Camera, Save
} from 'lucide-react';

type TabType =
  | 'dashboard' | 'profile' | 'orders' | 'tracking' | 'wishlist'
  | 'cart' | 'addresses' | 'payment' | 'reviews' | 'notifications'
  | 'support' | 'returns' | 'security';

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
  { id: 'support',       label: 'Help & Support',   icon: HelpCircle },
  { id: 'returns',       label: 'Returns & Refunds',icon: RotateCcw },
  { id: 'security',      label: 'Security',         icon: Shield },
];

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8 pb-6 border-b border-[#E8E1DE]">
    <h2 className="font-serif text-2xl text-[#3A3331] font-light">{title}</h2>
    {subtitle && <p className="text-sm text-[#7A7371] mt-1">{subtitle}</p>}
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
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
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
    queryFn: () => reviewService.getProductReviews('all'),
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
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#3A3331] to-[#BC8477] p-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-2">Welcome Back</p>
          <h2 className="font-serif text-3xl text-white font-light">{user.first_name} {user.last_name}</h2>
          <p className="text-white/60 text-sm mt-1">{user.email}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={cn(
              'inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full',
              user.is_email_verified ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
            )}>
              {user.is_email_verified ? <><Check size={10} /> Verified</> : <><AlertCircle size={10} /> Unverified</>}
            </span>
            <span className="bg-white/10 text-white/80 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Wishlist Items', value: wishlistItems.length, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Cart Items', value: cartItems.reduce((a, i) => a + i.quantity, 0), icon: ShoppingCart, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Addresses', value: addresses.length, icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#E8E1DE] p-5">
            <div className={cn('w-10 h-10 rounded flex items-center justify-center mb-3', stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-serif text-[#3A3331] font-light">{stat.value}</p>
            <p className="text-[10px] text-[#7A7371] tracking-widest uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#7A7371] mb-4">Quick Actions</h3>
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
              className="flex items-center gap-3 p-4 bg-white border border-[#E8E1DE] hover:border-[#BC8477] hover:text-[#BC8477] transition-all text-left group"
            >
              <action.icon size={18} className="text-[#B5AFAD] group-hover:text-[#BC8477] transition-colors" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#3A3331] group-hover:text-[#BC8477] transition-colors">
                {action.label}
              </span>
              <ArrowRight size={14} className="ml-auto text-[#B5AFAD] group-hover:text-[#BC8477] transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#7A7371]">Recent Orders</h3>
          <button onClick={() => setActiveTab('orders')} className="text-xs text-[#BC8477] hover:underline">
            View All
          </button>
        </div>
        {loadingOrders ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#BC8477]" /></div>
        ) : recentOrders.length === 0 ? (
          <div className="bg-white border border-[#E8E1DE] p-8 text-center">
            <p className="text-sm text-[#7A7371] mb-3">No orders yet.</p>
            <Link href="/shop" className="text-xs font-bold tracking-widest uppercase text-[#BC8477] hover:underline">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="bg-white border border-[#E8E1DE] p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#7A7371] mb-1">Order #{order.order_number}</p>
                  <p className="text-sm text-[#3A3331]">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-[#3A3331]">${Number(order.total_amount).toFixed(2)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div>
      <SectionHeader title="My Profile" subtitle="Manage your personal information and account settings" />

      {/* Avatar + Name */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white border border-[#E8E1DE]">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#BC8477] to-[#9A6B60] flex items-center justify-center text-white font-serif text-3xl">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl text-[#3A3331]">{user.first_name} {user.last_name}</h3>
          <p className="text-sm text-[#7A7371]">{user.email}</p>
          <p className="text-xs text-[#B5AFAD] mt-1">
            Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#BC8477] hover:text-[#9A6B60] transition-colors"
        >
          <Edit3 size={14} /> {isEditingProfile ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-[#E8E1DE] p-8 mb-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-6">Personal Information</h3>
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
            {updateProfileMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white border border-[#E8E1DE] p-8">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-6">Change Password</h3>
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
            className="btn-primary flex items-center gap-2"
          >
            {changePasswordMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
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
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-[#E8E1DE] overflow-hidden">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-[#E8E1DE] gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#7A7371] mb-1">ORDER #{order.order_number}</p>
                  <p className="text-sm text-[#3A3331]">{new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-[#7A7371] mb-0.5">Total</p>
                    <p className="font-serif text-lg text-[#3A3331]">${Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              {/* Order Items */}
              <div className="p-5 space-y-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-14 h-18 min-w-[56px] bg-[#F5F2F0] overflow-hidden">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.product_name || 'Product'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={18} className="text-[#B5AFAD]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#3A3331] font-medium truncate">{item.product_name || `Item ${item.sku}`}</p>
                      <p className="text-xs text-[#7A7371] mt-0.5">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-medium text-[#3A3331]">
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
    <div>
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
        <div className="space-y-6">
          {pendingOrders.map(order => {
            const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
            const currentStep = steps.indexOf(order.status);
            return (
              <div key={order.id} className="bg-white border border-[#E8E1DE] p-6">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#7A7371] mb-1">ORDER #{order.order_number}</p>
                    <p className="text-sm text-[#3A3331]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between mb-3">
                    {steps.map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-2 flex-1">
                        <div className={cn(
                          'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
                          idx <= currentStep
                            ? 'bg-[#BC8477] border-[#BC8477] text-white'
                            : 'bg-white border-[#E8E1DE] text-[#B5AFAD]'
                        )}>
                          {idx < currentStep ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className={cn(
                          'text-[9px] font-bold tracking-widest uppercase text-center hidden sm:block',
                          idx <= currentStep ? 'text-[#3A3331]' : 'text-[#B5AFAD]'
                        )}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 left-[10%] right-[10%] h-0.5 -z-0">
                    <div className="h-full bg-[#E8E1DE]" />
                    <div
                      className="absolute top-0 left-0 h-full bg-[#BC8477] transition-all duration-500"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mt-6 bg-[#FAF8F5] p-4 border border-[#E8E1DE]">
                  <p className="text-xs text-[#7A7371]">
                    <span className="font-bold text-[#3A3331]">Estimated Delivery:</span>{' '}
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
    <div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map(item => (
            <div key={item.id} className="bg-white border border-[#E8E1DE] group overflow-hidden">
              <Link href={`/product/${item.product.slug}`} className="block relative aspect-[4/5] bg-[#F5F2F0]">
                <Image
                  src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={item.product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-4">
                <p className="text-xs text-[#B5AFAD] uppercase tracking-widest mb-1">{item.product.brand?.name}</p>
                <Link href={`/product/${item.product.slug}`}>
                  <p className="text-sm font-medium text-[#3A3331] hover:text-[#BC8477] transition-colors line-clamp-1">
                    {item.product.title}
                  </p>
                </Link>
                <p className="text-sm text-[#BC8477] font-medium mt-1">
                  ${Number(item.product.variants?.[0]?.price || 0).toFixed(2)}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      if (item.product.variants?.[0]) {
                        cartStore.addItem(item.product as any, item.product.variants[0] as any, 1);
                        cartStore.openCart();
                        toast.success('Added to cart!');
                      }
                    }}
                    className="flex-1 text-[10px] font-bold tracking-widest uppercase bg-[#3A3331] text-white py-2 hover:bg-[#BC8477] transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeWishlistMutation.mutate(item.product.id)}
                    className="w-9 h-9 border border-[#E8E1DE] flex items-center justify-center text-[#B5AFAD] hover:text-[#E46962] hover:border-[#E46962] transition-colors"
                  >
                    <Trash2 size={14} />
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
    <div>
      <SectionHeader title="Shopping Cart" subtitle={`${cartItems.reduce((a, i) => a + i.quantity, 0)} items in your cart`} />
      {cartItems.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          message="Your cart is empty."
          action={<Link href="/shop" className="btn-primary">Continue Shopping</Link>}
        />
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white border border-[#E8E1DE] p-5 flex gap-4 items-center">
              <div className="relative w-16 h-20 min-w-[64px] bg-[#F5F2F0] overflow-hidden">
                <Image
                  src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#B5AFAD] uppercase tracking-widest mb-0.5">{item.product.brand?.name}</p>
                <Link href={`/product/${item.product.slug}`}>
                  <p className="text-sm font-medium text-[#3A3331] hover:text-[#BC8477] transition-colors line-clamp-1">
                    {item.product.title}
                  </p>
                </Link>
                <p className="text-sm text-[#BC8477] mt-1">${Number(item.variant.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-[#E8E1DE]">
                <button
                  onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#7A7371] hover:bg-[#F5F2F0] transition-colors"
                >−</button>
                <span className="w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#7A7371] hover:bg-[#F5F2F0] transition-colors"
                >+</button>
              </div>
              <p className="text-sm font-medium text-[#3A3331] w-20 text-right">
                ${(Number(item.variant.price) * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => cartStore.removeItem(item.id)}
                className="text-[#B5AFAD] hover:text-[#E46962] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="bg-white border border-[#E8E1DE] p-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-[#7A7371]">Subtotal</span>
              <span className="text-[#3A3331]">${cartStore.getTotalPrice().toFixed(2)}</span>
            </div>
            {cartStore.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-green-600">Discount ({cartStore.couponCode})</span>
                <span className="text-green-600">-${cartStore.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-medium pt-3 border-t border-[#E8E1DE]">
              <span className="text-[#3A3331]">Total</span>
              <span className="font-serif text-xl text-[#3A3331]">${cartStore.getFinalPrice().toFixed(2)}</span>
            </div>
            <div className="flex gap-3 mt-5">
              <Link href="/checkout" className="flex-1 btn-primary text-center block">
                Proceed to Checkout
              </Link>
              <button onClick={() => { cartStore.clearCart(); toast.success('Cart cleared'); }} className="btn-ghost">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div>
      <SectionHeader title="Address Management" subtitle="Manage your shipping and billing addresses" />
      <button
        onClick={() => { setShowAddressForm(!showAddressForm); setEditingAddress(null); resetAddressForm(); }}
        className="btn-primary flex items-center gap-2 mb-6"
      >
        <Plus size={14} /> Add New Address
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
              'relative p-6 border transition-colors',
              addr.is_default ? 'border-[#BC8477] bg-[#FDF9F8]' : 'border-[#E8E1DE] bg-white hover:border-[#D5CFCD]'
            )}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-[#BC8477]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A7371]">{addr.type}</span>
                {addr.is_default && (
                  <span className="bg-[#BC8477] text-white text-[9px] px-2 py-0.5 uppercase tracking-widest">Default</span>
                )}
              </div>
              <p className="text-sm font-medium text-[#3A3331] mb-1">{addr.address_line1}</p>
              <p className="text-xs text-[#7A7371]">{addr.city}, {addr.postal_code}</p>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => startEditAddress(addr)}
                  className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#7A7371] hover:text-[#BC8477] transition-colors"
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button
                  onClick={() => deleteAddressMutation.mutate(addr.id)}
                  className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#B5AFAD] hover:text-[#E46962] transition-colors ml-3"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPayment = () => (
    <div>
      <SectionHeader title="Payment Methods" subtitle="Manage your saved payment methods" />
      <div className="bg-white border border-[#E8E1DE] p-8 text-center">
        <div className="w-16 h-16 bg-[#F5F2F0] rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard size={28} className="text-[#B5AFAD]" />
        </div>
        <p className="text-sm text-[#7A7371] mb-2">Payment method management coming soon.</p>
        <p className="text-xs text-[#B5AFAD]">Currently payments are processed at checkout.</p>
      </div>

      {/* Transaction History */}
      <div className="mt-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#7A7371] mb-4">Transaction History</h3>
        {orders.length === 0 ? (
          <div className="bg-white border border-[#E8E1DE] p-6 text-center">
            <p className="text-sm text-[#7A7371]">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 10).map(order => (
              <div key={order.id} className="bg-white border border-[#E8E1DE] p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#7A7371]">Order #{order.order_number}</p>
                  <p className="text-xs text-[#B5AFAD]">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#3A3331]">${Number(order.total_amount).toFixed(2)}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 px-2 py-0.5">
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
    <div>
      <SectionHeader title="Reviews & Ratings" subtitle="Your product reviews and ratings" />

      <div className="bg-white border border-[#E8E1DE] p-6 mb-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-4">Write a Review</h3>
        <p className="text-sm text-[#7A7371] mb-4">
          Purchased a product recently? Share your experience by going to the product page.
        </p>
        <Link href="/shop" className="btn-ghost flex items-center gap-2 w-fit">
          <Package size={14} /> Browse Purchased Products
        </Link>
      </div>

      {loadingReviews ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#BC8477]" /></div>
      ) : (
        <div className="bg-white border border-[#E8E1DE] p-8 text-center">
          <div className="w-16 h-16 bg-[#F5F2F0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={28} className="text-[#B5AFAD]" />
          </div>
          <p className="text-sm text-[#7A7371] mb-1">Your reviews will appear here once submitted.</p>
          <p className="text-xs text-[#B5AFAD]">Visit any product page to leave a review.</p>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div>
      <SectionHeader title="Notifications" subtitle="Stay updated on orders, promotions, and more" />
      {[
        { title: 'Order Placed Successfully', body: 'Your order has been placed and is being processed.', time: '2 hours ago', type: 'order', read: false },
        { title: 'Welcome to Velora!', body: 'Thank you for joining us. Enjoy your first purchase.', time: '1 day ago', type: 'system', read: true },
        { title: 'Special Offer: 20% Off', body: 'Use code VELORA20 for 20% off your next purchase.', time: '3 days ago', type: 'promo', read: true },
      ].map((notif, i) => (
        <div key={i} className={cn(
          'bg-white border border-[#E8E1DE] p-5 mb-3 flex gap-4',
          !notif.read && 'border-l-4 border-l-[#BC8477]'
        )}>
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5',
            notif.type === 'order' ? 'bg-blue-50' : notif.type === 'promo' ? 'bg-amber-50' : 'bg-[#F5F2F0]'
          )}>
            {notif.type === 'order' ? <Package size={16} className="text-blue-600" /> :
             notif.type === 'promo' ? <Bell size={16} className="text-amber-600" /> :
             <Bell size={16} className="text-[#7A7371]" />}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <p className={cn('text-sm font-medium', notif.read ? 'text-[#7A7371]' : 'text-[#3A3331]')}>{notif.title}</p>
              {!notif.read && <span className="w-2 h-2 bg-[#BC8477] rounded-full shrink-0 mt-1.5" />}
            </div>
            <p className="text-xs text-[#B5AFAD] mt-0.5">{notif.body}</p>
            <p className="text-[10px] text-[#B5AFAD] mt-2 uppercase tracking-widest">{notif.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupport = () => (
    <div>
      <SectionHeader title="Help & Support" subtitle="Get help with your orders and account" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Phone, label: 'Call Us', value: '+880 1234 567890' },
          { icon: Mail, label: 'Email Us', value: 'support@velora.com' },
          { icon: Clock, label: 'Support Hours', value: 'Mon–Sat, 9am–6pm' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#E8E1DE] p-5 text-center">
            <div className="w-10 h-10 bg-[#F5F2F0] rounded-full flex items-center justify-center mx-auto mb-3">
              <c.icon size={18} className="text-[#BC8477]" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#7A7371] mb-1">{c.label}</p>
            <p className="text-sm text-[#3A3331]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8E1DE] p-8 mb-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-6">Submit a Request</h3>
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
      <div className="bg-white border border-[#E8E1DE] p-8">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: 'How do I track my order?', a: 'Go to My Account → Order Tracking to see real-time status of your orders.' },
            { q: 'Can I change my order after placing it?', a: 'Orders can only be modified before they enter the processing stage. Contact support immediately.' },
            { q: 'What is the return policy?', a: 'We accept returns within 30 days of delivery for unused items in original packaging.' },
            { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days. Express options are available at checkout.' },
          ].map((faq, i) => (
            <details key={i} className="group border border-[#E8E1DE] rounded">
              <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-[#3A3331] list-none">
                {faq.q}
                <ChevronDown size={16} className="text-[#B5AFAD] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-sm text-[#7A7371] font-light">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReturns = () => (
    <div>
      <SectionHeader title="Returns & Refunds" subtitle="Request returns and track refund status" />

      <div className="bg-white border border-[#E8E1DE] p-8 mb-6">
        <h3 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-6">Submit Return Request</h3>
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
            <RotateCcw size={14} /> Submit Return Request
          </button>
        </div>
      </div>

      <div className="bg-[#FDF9F8] border border-[#E8E1DE] p-6">
        <h4 className="text-xs font-bold tracking-widest uppercase text-[#3A3331] mb-3">Return Policy</h4>
        <ul className="text-sm text-[#7A7371] space-y-2">
          {[
            '30-day return window from delivery date',
            'Items must be unused and in original packaging',
            'Refunds processed within 5–10 business days',
            'Free return shipping on defective items',
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
    support: renderSupport,
    returns: renderReturns,
    security: renderSecurity,
  };

  return (
    <>
      <style jsx global>{`
        .label-style {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #7A7371;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .input-style {
          width: 100%;
          height: 48px;
          border: 1px solid #E8E1DE;
          padding: 0 16px;
          font-size: 14px;
          color: #3A3331;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-style:focus {
          border-color: #BC8477;
        }
        .input-style:is(textarea) {
          height: auto;
          padding: 12px 16px;
        }
        .input-style:is(select) {
          appearance: none;
          cursor: pointer;
        }
        .btn-primary {
          height: 44px;
          padding: 0 24px;
          background: #3A3331;
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          cursor: pointer;
          border: none;
        }
        .btn-primary:hover { background: #BC8477; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-ghost {
          height: 44px;
          padding: 0 20px;
          border: 1px solid #E8E1DE;
          background: transparent;
          color: #7A7371;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: #BC8477; color: #BC8477; }
      `}</style>

      <main className="w-full min-h-screen pt-20 pb-16 bg-[#FAF8F5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <div>
              <h1 className="font-serif text-2xl text-[#3A3331] font-light">My Account</h1>
              <p className="text-xs text-[#7A7371] mt-0.5">Welcome back, {user.first_name}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 border border-[#E8E1DE] px-4 py-2 text-xs font-bold tracking-widest uppercase text-[#7A7371]"
            >
              <LayoutDashboard size={14} /> Menu
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className={cn(
              'w-64 shrink-0 flex-col gap-1',
              sidebarOpen ? 'flex fixed inset-0 z-50 bg-white flex-col w-72 pt-8 px-4 pb-8 overflow-y-auto shadow-2xl' : 'hidden lg:flex'
            )}>
              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#7A7371]"
                >
                  <X size={20} />
                </button>
              )}

              {/* User Info */}
              <div className="p-4 mb-2 bg-gradient-to-r from-[#3A3331] to-[#5A4B48] text-white">
                <div className="w-10 h-10 rounded-full bg-[#BC8477] flex items-center justify-center font-serif text-lg mb-2">
                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                </div>
                <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-[10px] text-white/60 truncate">{user.email}</p>
              </div>

              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as TabType); setSidebarOpen(false); }}
                  className={cn(
                    'flex items-center gap-3 w-full text-left px-4 py-3 transition-all text-sm',
                    activeTab === item.id
                      ? 'bg-white border-l-2 border-[#BC8477] text-[#BC8477] font-medium'
                      : 'text-[#7A7371] hover:bg-white hover:text-[#3A3331] border-l-2 border-transparent'
                  )}
                >
                  <item.icon size={16} className="shrink-0" />
                  <span className="text-xs font-bold tracking-wider uppercase">{item.label}</span>
                </button>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 mt-2 text-[#E46962] hover:bg-red-50 transition-colors border-l-2 border-transparent"
              >
                <LogOut size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">Logout</span>
              </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Desktop Page Title */}
              <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-serif text-3xl text-[#3A3331] font-light">
                    {NAV_ITEMS.find(n => n.id === activeTab)?.label}
                  </h1>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#7A7371] hover:text-[#E46962] transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>

              {TAB_RENDERERS[activeTab]()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
