import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, ProductVariant, Product } from '@/types/product.types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getFinalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      couponCode: null,
      discountAmount: 0,
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.variant_id === variant.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.variant_id === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          const newItem: CartItem = {
            id: `${product.id}-${variant.id}`,
            variant_id: variant.id,
            product,
            variant,
            quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        ),

      getFinalPrice: () => Math.max(0, get().getTotalPrice() - get().discountAmount),
    }),
    {
      name: 'velora-cart',
    }
  )
);
