'use client';

import { useCartStore } from '@/store/cart.store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { couponService } from '@/services/coupon.service';
import { useMutation } from '@tanstack/react-query';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getFinalPrice, couponCode, discountAmount, applyCoupon, removeCoupon } = useCartStore();
  
  const [couponInput, setCouponInput] = useState('');

  const validateCouponMutation = useMutation({
    mutationFn: couponService.validateCoupon,
    onSuccess: (res) => {
      applyCoupon(couponInput, res.data.discount_amount);
      toast.success(res.message);
      setCouponInput('');
    },
    onError: () => toast.error('Invalid or expired coupon code'),
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    validateCouponMutation.mutate({ code: couponInput, cart_total: getTotalPrice() });
  };
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8E1DE]">
              <h2 className="font-serif text-2xl text-[#3A3331]">Your Cart</h2>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#7A7371] hover:bg-[#F5F2F0] hover:text-[#3A3331] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#F5F2F0] rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-[#BC8477]" />
                  </div>
                  <h3 className="text-lg font-serif text-[#3A3331] mb-2">Your cart is empty</h3>
                  <p className="text-sm text-[#7A7371] mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
                  <button
                    onClick={closeCart}
                    className="bg-[#BC8477] text-white px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-32 bg-[#F5F2F0] shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between gap-2">
                          <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="text-sm font-medium text-[#3A3331] hover:text-[#BC8477] line-clamp-2 transition-colors">
                            {item.product.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#B5AFAD] hover:text-[#E46962] transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {item.variant.attributes && Object.keys(item.variant.attributes).length > 0 && (
                          <p className="text-[10px] text-[#7A7371] mt-1">
                            {Object.entries(item.variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-[#E8E1DE] h-8">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-[#7A7371] hover:bg-[#F5F2F0]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs text-[#3A3331]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-[#7A7371] hover:bg-[#F5F2F0]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-sans text-sm font-medium text-[#3A3331]">
                          ${(item.variant.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#E8E1DE] p-6 bg-[#FAFAFA]">
                
                {/* Coupon Section */}
                <div className="mb-4">
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-[#E8E1DE] px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 text-[#3A3331] font-bold tracking-widest uppercase">
                        <Tag size={12} /> {couponCode}
                      </span>
                      <button onClick={removeCoupon} className="text-[#E46962] hover:underline">Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo Code" 
                        className="flex-1 h-10 px-3 bg-white border border-[#E8E1DE] text-xs focus:outline-none focus:border-[#BC8477]"
                      />
                      <button 
                        type="submit" disabled={validateCouponMutation.isPending}
                        className="h-10 px-4 bg-[#3A3331] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#BC8477] transition-colors disabled:opacity-50"
                      >
                        {validateCouponMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                      </button>
                    </form>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#7A7371]">Subtotal</span>
                    <span className="font-sans text-sm text-[#3A3331]">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#BC8477]">
                      <span className="text-xs font-bold tracking-widest uppercase">Discount</span>
                      <span className="font-sans text-sm">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E1DE]">
                    <span className="text-sm font-bold tracking-widest uppercase text-[#3A3331]">Total</span>
                    <span className="font-sans text-2xl text-[#3A3331]">${getFinalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-xs text-[#7A7371] text-center mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full h-14 bg-[#3A3331] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] transition-all duration-300 flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
