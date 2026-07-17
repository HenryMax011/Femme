import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ verified?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { verified } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 pb-20 pt-28">
      <div className="w-full">
        <LoginForm emailVerified={verified === "1"} />
      </div>
    </div>
  );
}
