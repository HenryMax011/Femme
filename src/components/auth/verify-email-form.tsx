"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type VerifyEmailInput,
  verifyEmailSchema,
} from "@/lib/validations";

type VerifyEmailFormProps = {
  initialEmail: string;
};

export function VerifyEmailForm({ initialEmail }: VerifyEmailFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: initialEmail, code: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setMessage("");
    const response = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Não foi possível confirmar o e-mail.");
      return;
    }

    router.push("/login?verified=1");
  });

  async function resendCode() {
    const email = getValues("email");
    if (!email) {
      setError("Informe seu e-mail para reenviar o código.");
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Não foi possível reenviar o código.");
        return;
      }
      setMessage(result.message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-[1.75rem] border border-border bg-white/90 p-6 shadow-[var(--shadow)]"
    >
      <div>
        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#dff6fb] text-[#1a5f7a]">
          <MailCheck size={24} />
        </div>
        <h1 className="font-display text-4xl text-ink">Confirme seu e-mail</h1>
        <p className="mt-2 text-sm font-light leading-relaxed text-muted">
          Enviamos um código de 6 dígitos para seu e-mail. Digite-o abaixo
          para liberar o login.
        </p>
      </div>

      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Código de confirmação"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="000000"
        className="rounded-xl text-center text-xl tracking-[0.45em]"
        {...register("code")}
        error={errors.code?.message}
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {message ? <p className="text-sm text-[#2a9bb0]">{message}</p> : null}

      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Confirmando..." : "Confirmar e-mail"}
      </Button>
      <button
        type="button"
        onClick={resendCode}
        disabled={isResending}
        className="w-full cursor-pointer text-sm text-ink underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isResending ? "Reenviando..." : "Reenviar código"}
      </button>
      <p className="text-center text-sm text-muted">
        Já confirmou?{" "}
        <Link href="/login" className="font-medium text-ink underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
