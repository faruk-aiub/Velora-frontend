'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { CheckCircle2, ChevronRight, Loader2, MapPin, Plus, CreditCard, Banknote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, getTotalPrice, getFinalPrice, discountAmount, couponCode, clearCart } = useCartStore();
  
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'COD'>('STRIPE');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Address Form State
  const [newAddress, setNewAddress] = useState({
    type: 'SHIPPING' as const,
    address_line1: '',
    city: '',
    postal_code: '',
    is_default: false,
  });

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      toast.error('Please log in to proceed to checkout');
      router.push('/login');
    } else if (items.length === 0) {
      toast.info('Your cart is empty');
      router.push('/shop');
    }
  }, [user, items, router, mounted]);

  const { data: addressesData, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.getAddresses,
    enabled: !!user,
  });
  
  const addresses = addressesData?.data || [];

  // Automatically select default address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((a) => a.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else {
        setSelectedAddress(addresses[0].id);
      }
    }
  }, [addresses, selectedAddress]);

  const addAddressMutation = useMutation({
    mutationFn: userService.addAddress,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddress(res.data.id);
      setIsAddingAddress(false);
      toast.success('Address added successfully');
    },
    onError: () => toast.error('Failed to add address'),
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddressMutation.mutate(newAddress);
  };

  const initiatePaymentMutation = useMutation({
    mutationFn: paymentService.initiate,
    onSuccess: (res) => {
      clearCart();
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        toast.success(res.message || 'Order placed successfully!');
        router.push('/checkout/success?order_id=cod'); 
      }
    },
    onError: () => {
      toast.error('Failed to initiate payment. Please contact support.');
      router.push('/account'); // Still redirect to orders since order was created
    }
  });

  const placeOrderMutation = useMutation({
    mutationFn: orderService.create,
    onSuccess: (res) => {
      // Order created, now initiate payment
      if (res.data?.id) {
        initiatePaymentMutation.mutate({
          orderId: res.data.id,
          provider: paymentMethod
        });
      } else {
        toast.error('Order creation failed');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to place order. Please try again.');
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    
    const cartItems = items.map(item => ({
      variantId: item.variant?.id || item.variant_id,
      quantity: item.quantity,
    }));

    if (cartItems.some(item => !item.variantId)) {
      toast.error('Your cart contains outdated items. Please clear your cart and add them again.');
      return;
    }

    placeOrderMutation.mutate({
      shippingAddressId: selectedAddress,
      cartItems,
    });
  };

  if (!mounted || !user || items.length === 0) return null;

  const subtotal = getTotalPrice();
  const finalPrice = getFinalPrice();
  const shippingCost = finalPrice > 150 ? 0 : 15;
  const total = finalPrice + shippingCost;

  return (
    <main className="w-full min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-10">
          <Link href="/cart" className="hover:text-[#BC8477] transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Checkout</span>
        </div>

        <h1 className="font-bold text-4xl text-gray-900 tracking-tight mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (Shipping Details) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Address Selection Section */}
            <div className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">1. Shipping Address</h2>
                {!isAddingAddress && (
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#BC8477] hover:text-[#9A6B60] flex items-center gap-1"
                  >
                    <Plus size={14} /> Add New
                  </button>
                )}
              </div>

              {isLoadingAddresses ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-[#BC8477]" />
                </div>
              ) : isAddingAddress || addresses.length === 0 ? (
                <form onSubmit={handleAddAddress} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      required placeholder="Address Line 1" 
                      value={newAddress.address_line1} onChange={e => setNewAddress({...newAddress, address_line1: e.target.value})}
                      className="col-span-2 w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200"
                    />
                    <input 
                      placeholder="City" required
                      value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200"
                    />
                    <input 
                      placeholder="Postal Code" required
                      value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                      className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    {addresses.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingAddress(false)}
                        className="flex-1 h-12 border border-gray-200 text-gray-900 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" disabled={addAddressMutation.isPending}
                      className="flex-1 h-12 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 shadow-sm transition-colors disabled:opacity-50"
                    >
                      {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`relative p-4 border cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-[#BC8477] bg-[#BC8477]/5 rounded-2xl ring-1 ring-[#BC8477]' : 'border-gray-100 hover:border-gray-300 rounded-2xl'}`}
                    >
                      {selectedAddress === addr.id && (
                        <CheckCircle2 className="absolute top-4 right-4 text-[#BC8477]" size={20} />
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{addr.type}</span>
                        {addr.is_default && (
                          <span className="bg-[#E8E1DE] text-gray-900 text-[9px] px-2 py-0.5 uppercase tracking-widest">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1">{addr.address_line1}</p>
                      <p className="text-xs text-gray-500">{addr.city}, {addr.postal_code}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Info Section */}
            <div className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-6">2. Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`relative p-4 border cursor-pointer transition-all flex flex-col gap-3 ${paymentMethod === 'STRIPE' ? 'border-[#BC8477] bg-[#BC8477]/5 rounded-2xl ring-1 ring-[#BC8477]' : 'border-gray-100 hover:border-gray-300 rounded-2xl'}`}
                >
                  {paymentMethod === 'STRIPE' && <CheckCircle2 className="absolute top-4 right-4 text-[#BC8477]" size={20} />}
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Credit / Debit Card</p>
                    <p className="text-xs text-gray-500 mt-1">Secure payment via Stripe</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`relative p-4 border cursor-pointer transition-all flex flex-col gap-3 ${paymentMethod === 'COD' ? 'border-[#BC8477] bg-[#BC8477]/5 rounded-2xl ring-1 ring-[#BC8477]' : 'border-gray-100 hover:border-gray-300 rounded-2xl'}`}
                >
                  {paymentMethod === 'COD' && <CheckCircle2 className="absolute top-4 right-4 text-[#BC8477]" size={20} />}
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">Pay when you receive the order</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm sticky top-32">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-gray-50 shrink-0 rounded-xl overflow-hidden">
                      <Image src={item.product.images?.[0]?.url || '/placeholder.jpg'} alt={item.product.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm text-gray-900 font-medium line-clamp-1">{item.product.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-[#BC8477]">
                    <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending || initiatePaymentMutation.isPending || !selectedAddress}
                className="w-full h-14 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placeOrderMutation.isPending || initiatePaymentMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : (paymentMethod === 'STRIPE' ? 'Pay Now' : 'Place Order')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
