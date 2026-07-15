import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Cadastro",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 pb-20 pt-28">
      <div className="w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
