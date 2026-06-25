'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import { CheckCircle2, ChevronRight, Loader2, MapPin, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, getTotalPrice, getFinalPrice, discountAmount, couponCode, clearCart } = useCartStore();
  
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
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

  const placeOrderMutation = useMutation({
    mutationFn: orderService.create,
    onSuccess: () => {
      toast.success('Order placed successfully!');
      clearCart();
      router.push('/account'); // Redirect to dashboard / orders
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
    <main className="w-full min-h-screen pt-24 pb-20 bg-[#FAF8F5]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A7371] mb-10">
          <Link href="/cart" className="hover:text-[#BC8477] transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-[#3A3331]">Checkout</span>
        </div>

        <h1 className="font-serif text-4xl text-[#3A3331] font-light mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (Shipping Details) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Address Selection Section */}
            <div className="bg-white p-8 border border-[#E8E1DE]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331]">1. Shipping Address</h2>
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
                      className="col-span-2 w-full h-12 bg-[#F5F2F0] px-4 text-sm text-[#3A3331] focus:outline-none focus:ring-1 focus:ring-[#BC8477]"
                    />
                    <input 
                      placeholder="City" required
                      value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full h-12 bg-[#F5F2F0] px-4 text-sm text-[#3A3331] focus:outline-none focus:ring-1 focus:ring-[#BC8477]"
                    />
                    <input 
                      placeholder="Postal Code" required
                      value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                      className="w-full h-12 bg-[#F5F2F0] px-4 text-sm text-[#3A3331] focus:outline-none focus:ring-1 focus:ring-[#BC8477]"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    {addresses.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingAddress(false)}
                        className="flex-1 h-12 border border-[#E8E1DE] text-[#3A3331] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#F5F2F0] transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" disabled={addAddressMutation.isPending}
                      className="flex-1 h-12 bg-[#3A3331] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] transition-colors disabled:opacity-50"
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
                      className={`relative p-4 border cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-[#BC8477] bg-[#FAF8F5]' : 'border-[#E8E1DE] hover:border-[#D5CFCD]'}`}
                    >
                      {selectedAddress === addr.id && (
                        <CheckCircle2 className="absolute top-4 right-4 text-[#BC8477]" size={20} />
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-[#7A7371]" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A7371]">{addr.type}</span>
                        {addr.is_default && (
                          <span className="bg-[#E8E1DE] text-[#3A3331] text-[9px] px-2 py-0.5 uppercase tracking-widest">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-[#3A3331] font-medium mb-1">{addr.address_line1}</p>
                      <p className="text-xs text-[#7A7371]">{addr.city}, {addr.postal_code}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Info Section Placeholder */}
            <div className="bg-white p-8 border border-[#E8E1DE] opacity-60">
              <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331] mb-6">2. Payment Method</h2>
              <p className="text-sm text-[#7A7371]">Cash on Delivery is currently selected. (Payment integration would be here).</p>
            </div>

          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-[#E8E1DE] sticky top-32">
              <h2 className="text-sm font-bold tracking-widest uppercase text-[#3A3331] mb-6 border-b border-[#E8E1DE] pb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-[#F5F2F0] shrink-0">
                      <Image src={item.product.images?.[0]?.url || '/placeholder.jpg'} alt={item.product.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm text-[#3A3331] font-medium line-clamp-1">{item.product.title}</p>
                      <p className="text-[10px] text-[#7A7371] uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center text-sm font-medium text-[#3A3331]">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8E1DE] pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-[#7A7371]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-[#BC8477]">
                    <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[#7A7371]">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-serif text-[#3A3331] pt-3 border-t border-[#E8E1DE]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending || !selectedAddress}
                className="w-full h-14 bg-[#BC8477] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placeOrderMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
