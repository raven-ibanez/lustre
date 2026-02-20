export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  popular: boolean;
  image_url: string | null;
  available: boolean;
  discount_price?: number | null;
  discount_active: boolean;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  created_at?: string;
  updated_at?: string;
  raw_price: number;
  markup_type?: 'jewelry' | 'loose_stone';
  variations?: Variation[];
  add_ons?: AddOn[];
}

export interface Variation {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  created_at?: string;
}

export interface AddOn {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  category: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  account_number: string;
  account_name: string;
  qr_code_url: string;
  active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  value: string;
  type: string;
  description?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: Variation;
  selectedAddOns?: AddOn[];
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  paymentProofFile?: File | null;
}

export interface Article {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
}

export interface Order {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  total_amount: number;
  shipping_fee: number;
  payment_proof_url?: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  created_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  raw_price: number;
  markup_type?: string;
  created_at?: string;
}
