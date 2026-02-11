export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  category: string;
  badge?: 'sale' | 'sold-out' | 'new';
  isOnSale?: boolean;
  isSoldOut?: boolean;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
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

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'cod' | 'gcash' | 'bank';
}
