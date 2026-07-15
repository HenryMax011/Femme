export type Gender = "FEMALE" | "MALE" | "UNISEX";

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  ingredients: string;
  howToUse: string;
  price: number;
  compareAt?: number;
  brand: string;
  gender: Gender;
  images: string[];
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  categorySlug: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type ShippingOption = {
  id: string;
  name: string;
  price: number;
  days: string;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "REFUNDED";

export type StoredOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zip: string;
  };
  shippingMethod: string;
  shippingPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: "PIX" | "CREDIT_CARD";
  paymentStatus: PaymentStatus;
  pixCopyPaste?: string;
  pixQrCodeDataUrl?: string;
  pixExpiresAt?: string;
  externalPaymentId?: string;
  items: CartItem[];
  createdAt: string;
  approvedAt?: string;
};

export type ProductFilters = {
  category?: string;
  gender?: Gender | "all";
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  bestSeller?: boolean;
  isNew?: boolean;
  sort?: "price-asc" | "price-desc" | "bestseller" | "newest";
  q?: string;
};
