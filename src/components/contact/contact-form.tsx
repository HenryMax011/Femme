"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setSuccess(false);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setError("Não foi possível enviar. Tente novamente.");
      return;
    }
    setSuccess(true);
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nome"
          {...register("name")}
          error={errors.name?.message}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              label="Telefone"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              error={errors.phone?.message}
            />
          )}
        />
      </div>
      <Input
        label="E-mail"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Textarea
        label="Mensagem"
        {...register("message")}
        error={errors.message?.message}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Mensagem enviada! Retornaremos em breve.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer rounded-xl bg-[#1a5f7a] py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#164f66] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
