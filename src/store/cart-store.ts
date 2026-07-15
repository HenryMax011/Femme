"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

type CartState = {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | null, discount: number) => void;
  subtotal: () => number;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      addItem: (product, quantity = 1) => {
        const items = [...get().items];
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity,
          });
        }
        set({ items });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        });
      },
      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),
      setCoupon: (code, discount) => set({ couponCode: code, discount }),
      subtotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      total: () => Math.max(0, get().subtotal() - get().discount),
      itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: "selavie-cart" },
  ),
);
