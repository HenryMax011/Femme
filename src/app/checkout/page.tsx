import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { auth } from "@/lib/auth";
import { findUserById, toPublicProfile } from "@/lib/users-store";
import type { PublicUserProfile } from "@/types/profile";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize sua compra com pagamento via PIX.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await auth();
  let profile: PublicUserProfile | null = null;

  if (session?.user?.id) {
    const user = await findUserById(session.user.id);
    if (user) profile = toPublicProfile(user);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-5xl text-ink">Checkout</h1>
      <CheckoutFlow initialProfile={profile} />
    </div>
  );
}
