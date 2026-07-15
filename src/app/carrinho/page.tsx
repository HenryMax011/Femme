import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise seus itens, aplique cupom e calcule o frete.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="mb-14 font-display text-5xl text-ink">Carrinho</h1>
      <CartView />
    </div>
  );
}
