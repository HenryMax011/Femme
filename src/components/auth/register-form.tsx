"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || "Não foi possível cadastrar");
      return;
    }
    router.push("/login");
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[1.75rem] border border-border bg-white/90 p-6 shadow-[var(--shadow)]"
    >
      <h1 className="font-display text-4xl text-ink">Criar conta</h1>
      <Input label="Nome" {...register("name")} error={errors.name?.message} />
      <Input
        label="E-mail"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Telefone"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <Input
        label="Senha"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Confirmar senha"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </Button>
      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-ink underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
