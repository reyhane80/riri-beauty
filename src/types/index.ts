export type Language = 'fa' | 'en';

/** A string with a value per supported language */
export type LocalizedString = Record<Language, string>;

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  emoji: string;
}

export type ProductBadge = 'new' | 'bestseller' | 'sale';

export interface Product {
  id: string;
  name: LocalizedString;
  brand: LocalizedString;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  colors?: string[];
  description: LocalizedString;
  /** emoji placeholder shown on the product card until real photography is wired up */
  icon: string;
  gradient: string;
  badges?: ProductBadge[];
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  address: string;
}
