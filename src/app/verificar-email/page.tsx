import type { Metadata } from "next";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
  robots: { index: false, follow: false },
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email = "" } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 pb-20 pt-28">
      <div className="w-full">
        <VerifyEmailForm initialEmail={email} />
      </div>
    </div>
  );
}
