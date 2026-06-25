// =============================
// Product Types
// =============================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compare_price?: number;
  attributes: Record<string, string> | null; // e.g. { color: "Red", size: "M" }
  inventory?: {
    quantity: number;
    reserved_quantity: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  images: ProductImage[];
  category?: Category;
  brand?: Brand;
  variants: ProductVariant[];
  tags: string[];
  is_active: boolean;
  created_at: string;
}

// =============================
// Cart Types
// =============================
export interface CartItem {
  id: string;
  variant_id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

// =============================
// Order Types
// =============================
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  variant_id: string;
}

// =============================
// Review Types
// =============================
export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  user: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
}
