import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { findUserById, toPublicProfile } from "@/lib/users-store";
import { getOrdersByEmail } from "@/lib/orders-store";
import { ProfileContent } from "@/components/auth/profile-content";

export const metadata: Metadata = {
  title: "Perfil",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await findUserById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersByEmail(user.email);

  return (
    <ProfileContent initialProfile={toPublicProfile(user)} orders={orders} />
  );
}
