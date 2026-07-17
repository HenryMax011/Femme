"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  emailVerified?: boolean;
};

export function LoginForm({ emailVerified = false }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      setError("E-mail ou senha inválidos, ou conta ainda não confirmada.");
      return;
    }
    router.push("/perfil");
    router.refresh();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[1.75rem] border border-border bg-white/90 p-6 shadow-[var(--shadow)]"
    >
      <div>
        <h1 className="font-display text-4xl text-ink">Entrar</h1>
        <p className="mt-1 text-sm text-muted">
          Demo: henrymaximo8@gmail.com / selavie123
        </p>
      </div>
      <Input
        label="E-mail"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Senha"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      {emailVerified ? (
        <p className="rounded-xl bg-[#dff6fb] px-4 py-3 text-sm text-[#1a5f7a]">
          E-mail confirmado. Agora você já pode entrar.
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
      <p className="text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-ink underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
