import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize sua compra com pagamento via PIX.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-5xl text-ink">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
