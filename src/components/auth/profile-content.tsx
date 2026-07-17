"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import {
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CpfInput } from "@/components/ui/cpf-input";
import { CepInput } from "@/components/ui/cep-input";
import { BRAZIL_STATES } from "@/lib/brazil-states";
import { lookupAddressByCep } from "@/lib/cep";
import { formatCardNumberDisplay } from "@/lib/cards";
import {
  formatCepDisplay,
  formatCpfDisplay,
  formatCurrency,
  cn,
} from "@/lib/utils";
import {
  profileAddressSchema,
  profilePaymentSchema,
  profilePersonalSchema,
  type ProfileAddressInput,
  type ProfilePaymentInput,
  type ProfilePersonalInput,
} from "@/lib/validations";
import type { PublicUserProfile } from "@/types/profile";
import type { StoredOrder } from "@/types";

type ViewId = "hub" | "personal" | "addresses" | "payments" | "orders";

type ProfileContentProps = {
  initialProfile: PublicUserProfile;
  orders: StoredOrder[];
};

function formatPhone(phone?: string) {
  if (!phone) return "Não informado";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `+55 ${phone}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function InfoRow({
  label,
  value,
  complete,
  onClick,
}: {
  label: string;
  value: string;
  complete?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-4 border-b border-[#e8f4f7] px-1 py-4 text-left last:border-b-0 hover:bg-[#f7fcfd]"
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border",
          complete
            ? "border-emerald-300 bg-emerald-50 text-emerald-600"
            : "border-amber-300 bg-amber-50 text-amber-600",
        )}
      >
        {complete ? (
          <ShieldCheck size={16} />
        ) : (
          <span className="text-sm font-semibold">!</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-[#9ec6d4]" />
    </button>
  );
}

export function ProfileContent({ initialProfile, orders }: ProfileContentProps) {
  const [view, setView] = useState<ViewId>("hub");
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cepStatus, setCepStatus] = useState("");

  const personalForm = useForm<ProfilePersonalInput>({
    resolver: zodResolver(profilePersonalSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || "",
      cpf: profile.cpf || "",
    },
  });

  const addressForm = useForm<ProfileAddressInput>({
    resolver: zodResolver(profileAddressSchema),
    defaultValues: {
      label: "Casa",
      zip: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      isDefault: true,
    },
  });

  const paymentForm = useForm<ProfilePaymentInput>({
    resolver: zodResolver(profilePaymentSchema),
    defaultValues: {
      holderName: profile.name,
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      isDefault: true,
    },
  });

  const personalComplete = Boolean(profile.name && profile.cpf && profile.phone);
  const hasAddress = profile.addresses.length > 0;
  const hasPayment = profile.paymentMethods.length > 0;

  const hubCards = useMemo(
    () => [
      {
        id: "personal" as const,
        title: "Informações do seu perfil",
        description: "Dados pessoais e da conta",
        icon: UserRound,
        incomplete: !personalComplete,
      },
      {
        id: "addresses" as const,
        title: "Endereços",
        description: "Endereços salvos na sua conta",
        icon: MapPin,
        incomplete: !hasAddress,
      },
      {
        id: "payments" as const,
        title: "Cartões",
        description: "Cartões salvos na sua conta",
        icon: CreditCard,
        incomplete: !hasPayment,
      },
      {
        id: "orders" as const,
        title: "Compras",
        description: "Pedidos e histórico de compras",
        icon: Package,
        incomplete: false,
      },
    ],
    [personalComplete, hasAddress, hasPayment],
  );

  const openView = (next: ViewId) => {
    setView(next);
    setError("");
    setMessage("");
    setEditingPersonal(false);
    setShowAddressForm(false);
    setShowPaymentForm(false);
  };

  const fillAddressFromCep = async (cepDigits: string) => {
    if (cepDigits.length !== 8) {
      setCepStatus("");
      return;
    }
    setCepStatus("Buscando endereço...");
    try {
      const data = await lookupAddressByCep(cepDigits);
      if (!data) {
        setCepStatus("CEP não encontrado. Preencha manualmente.");
        return;
      }
      if (data.street) {
        addressForm.setValue("street", data.street, { shouldValidate: true });
      }
      if (data.district) {
        addressForm.setValue("district", data.district, { shouldValidate: true });
      }
      if (data.city) {
        addressForm.setValue("city", data.city, { shouldValidate: true });
      }
      if (data.state) {
        addressForm.setValue("state", data.state, { shouldValidate: true });
      }
      setCepStatus("Endereço preenchido. Informe o número.");
    } catch {
      setCepStatus("Não foi possível buscar o CEP.");
    }
  };

  const savePersonal = personalForm.handleSubmit(async (data) => {
    setError("");
    setMessage("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.message || "Não foi possível salvar.");
      return;
    }
    setProfile(json);
    setEditingPersonal(false);
    setMessage("Dados pessoais atualizados.");
  });

  const saveAddress = addressForm.handleSubmit(async (data) => {
    setError("");
    setMessage("");
    const response = await fetch("/api/profile/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.message || "Não foi possível salvar o endereço.");
      return;
    }
    setProfile(json);
    setShowAddressForm(false);
    addressForm.reset({
      label: "Trabalho",
      zip: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      isDefault: false,
    });
    setMessage("Endereço adicionado.");
  });

  const savePayment = paymentForm.handleSubmit(async (data) => {
    setError("");
    setMessage("");
    const response = await fetch("/api/profile/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.message || "Não foi possível salvar o cartão.");
      return;
    }
    setProfile(json);
    setShowPaymentForm(false);
    paymentForm.reset({
      holderName: profile.name,
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      isDefault: false,
    });
    setMessage("Cartão cadastrado.");
  });

  const runAddressAction = async (
    addressId: string,
    action: "delete" | "default",
  ) => {
    const response = await fetch("/api/profile/addresses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId, action }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.message || "Não foi possível atualizar o endereço.");
      return;
    }
    setProfile(json);
  };

  const runPaymentAction = async (
    methodId: string,
    action: "delete" | "default",
  ) => {
    const response = await fetch("/api/profile/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ methodId, action }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.message || "Não foi possível atualizar o pagamento.");
      return;
    }
    setProfile(json);
  };

  return (
    <div className="min-h-[70vh] bg-[#eef6f9]">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {view === "hub" ? (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#1a5f7a] text-lg font-medium text-white">
                  {initials(profile.name) || "SF"}
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#5bbcd6]">
                    Minha conta
                  </p>
                  <h1 className="font-display text-3xl font-light text-[#1a5f7a] sm:text-4xl">
                    {profile.name}
                  </h1>
                  <p className="text-sm text-muted">{profile.email}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl bg-white"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sair
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hubCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => openView(card.id)}
                    className="group cursor-pointer rounded-2xl border border-white bg-white p-5 text-left shadow-[0_8px_28px_rgba(26,95,122,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#ade8f4] hover:shadow-[0_14px_36px_rgba(91,188,214,0.14)]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="relative flex size-11 items-center justify-center rounded-full border border-[#d7eef5] bg-[#f7fcfd] text-[#1a5f7a]">
                        <Icon size={18} />
                        {card.incomplete ? (
                          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                            !
                          </span>
                        ) : null}
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-[#b7d5e0] transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                    <h2 className="text-base font-medium text-ink">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{card.description}</p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => openView("hub")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#ade8f4] bg-white px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1a5f7a] shadow-[0_4px_14px_rgba(91,188,214,0.12)] transition-all hover:border-[#5bbcd6] hover:bg-[#f7fcfd] hover:shadow-[0_8px_20px_rgba(91,188,214,0.18)]"
              >
                ← Meu perfil
              </button>
              <span className="text-[#9ec6d4]" aria-hidden>
                ›
              </span>
              <span className="inline-flex items-center rounded-full bg-[#1a5f7a] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_4px_14px_rgba(26,95,122,0.2)]">
                {view === "personal"
                  ? "Informações"
                  : view === "addresses"
                    ? "Endereços"
                    : view === "payments"
                      ? "Cartões"
                      : "Compras"}
              </span>
            </div>

            {message ? (
              <p className="mb-4 rounded-xl bg-[#dff6fb] px-4 py-3 text-sm text-[#1a5f7a]">
                {message}
              </p>
            ) : null}
            {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

            {view === "personal" ? (
              <section className="rounded-2xl border border-white bg-white p-5 shadow-[0_8px_28px_rgba(26,95,122,0.06)] sm:p-6">
                <h2 className="text-2xl font-medium text-ink">
                  Informações do seu perfil
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Dados pessoais e da conta
                </p>

                <div className="mt-6 rounded-2xl border border-[#e8f4f7]">
                  <div className="border-b border-[#e8f4f7] px-4 py-3 text-sm font-medium text-ink">
                    Informações pessoais
                  </div>
                  <div className="px-3">
                    <InfoRow
                      label="Nome e sobrenome"
                      value={profile.name}
                      complete={Boolean(profile.name)}
                      onClick={() => setEditingPersonal(true)}
                    />
                    <InfoRow
                      label="Número do CPF"
                      value={
                        profile.cpf
                          ? formatCpfDisplay(profile.cpf)
                          : "Adicionar CPF"
                      }
                      complete={Boolean(profile.cpf)}
                      onClick={() => setEditingPersonal(true)}
                    />
                    <InfoRow
                      label="Telefone"
                      value={formatPhone(profile.phone)}
                      complete={Boolean(profile.phone)}
                      onClick={() => setEditingPersonal(true)}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#e8f4f7]">
                  <div className="border-b border-[#e8f4f7] px-4 py-3 text-sm font-medium text-ink">
                    Dados da conta
                  </div>
                  <div className="px-3">
                    <InfoRow
                      label="E-mail pelo qual você recebe as comunicações"
                      value={profile.email}
                      complete
                    />
                  </div>
                </div>

                {editingPersonal ? (
                  <form
                    onSubmit={savePersonal}
                    className="mt-5 space-y-4 rounded-2xl border border-[#ade8f4]/70 bg-[#f7fcfd] p-4"
                  >
                    <h3 className="font-medium text-ink">Editar dados</h3>
                    <Input
                      label="Nome completo"
                      {...personalForm.register("name")}
                      error={personalForm.formState.errors.name?.message}
                    />
                    <Controller
                      name="cpf"
                      control={personalForm.control}
                      render={({ field }) => (
                        <CpfInput
                          label="CPF"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={personalForm.formState.errors.cpf?.message}
                        />
                      )}
                    />
                    <Controller
                      name="phone"
                      control={personalForm.control}
                      render={({ field }) => (
                        <PhoneInput
                          label="Telefone"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={personalForm.formState.errors.phone?.message}
                        />
                      )}
                    />
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setEditingPersonal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 rounded-xl"
                        disabled={personalForm.formState.isSubmitting}
                      >
                        {personalForm.formState.isSubmitting
                          ? "Salvando..."
                          : "Salvar"}
                      </Button>
                    </div>
                  </form>
                ) : null}
              </section>
            ) : null}

            {view === "addresses" ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-medium text-ink">Endereços</h2>

                {profile.addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ade8f4] bg-white px-5 py-10 text-center text-sm text-muted">
                    Nenhum endereço cadastrado ainda.
                  </div>
                ) : (
                  profile.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-2xl border border-white bg-white p-5 shadow-[0_8px_28px_rgba(26,95,122,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">
                            {address.street}, {address.number}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            CEP {formatCepDisplay(address.zip)} — {address.city}{" "}
                            — {address.state}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            {address.label}
                            {address.complement
                              ? ` · ${address.complement}`
                              : ""}
                          </p>
                          <p className="mt-2 text-sm text-muted">
                            {profile.name} — {formatPhone(profile.phone)}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {address.isDefault ? (
                              <span className="rounded-full bg-[#e8f7fb] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#1a5f7a]">
                                Envio
                              </span>
                            ) : null}
                            <span className="rounded-full bg-[#f3f7f9] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#7aabba]">
                              {address.district}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!address.isDefault ? (
                            <button
                              type="button"
                              onClick={() =>
                                runAddressAction(address.id, "default")
                              }
                              className="cursor-pointer text-sm text-[#2a9bb0] hover:underline"
                            >
                              Tornar padrão
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() =>
                              runAddressAction(address.id, "delete")
                            }
                            className="cursor-pointer text-sm text-[#2a9bb0] hover:underline"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {!showAddressForm ? (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#cfeaf2] bg-[#e8f7fb] py-4 text-sm font-medium text-[#1a5f7a] transition-colors hover:bg-[#dff6fb]"
                  >
                    <Plus size={16} />
                    Adicionar novo endereço
                  </button>
                ) : (
                  <form
                    onSubmit={saveAddress}
                    className="space-y-4 rounded-2xl border border-white bg-white p-5 shadow-[0_8px_28px_rgba(26,95,122,0.06)]"
                  >
                    <h3 className="font-medium text-ink">Novo endereço</h3>
                    <Input
                      label="Apelido"
                      placeholder="Casa, Trabalho..."
                      {...addressForm.register("label")}
                      error={addressForm.formState.errors.label?.message}
                    />
                    <Controller
                      name="zip"
                      control={addressForm.control}
                      render={({ field }) => (
                        <CepInput
                          label="CEP"
                          value={field.value}
                          onChange={(digits) => {
                            field.onChange(digits);
                            void fillAddressFromCep(digits);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={addressForm.formState.errors.zip?.message}
                          hint={cepStatus}
                        />
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                      <Input
                        label="Rua"
                        {...addressForm.register("street")}
                        error={addressForm.formState.errors.street?.message}
                      />
                      <Input
                        label="Número"
                        {...addressForm.register("number")}
                        error={addressForm.formState.errors.number?.message}
                      />
                    </div>
                    <Input
                      label="Complemento"
                      {...addressForm.register("complement")}
                    />
                    <Input
                      label="Bairro"
                      {...addressForm.register("district")}
                      error={addressForm.formState.errors.district?.message}
                    />
                    <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                      <Input
                        label="Cidade"
                        {...addressForm.register("city")}
                        error={addressForm.formState.errors.city?.message}
                      />
                      <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-ink/80">
                          UF
                        </span>
                        <select
                          {...addressForm.register("state")}
                          className="w-full rounded-xl border border-[#ade8f4]/80 bg-white/60 px-3 py-3 text-sm font-light text-ink outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/20"
                        >
                          <option value="">UF</option>
                          {BRAZIL_STATES.map((state) => (
                            <option key={state.uf} value={state.uf}>
                              {state.uf}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        {...addressForm.register("isDefault")}
                      />
                      Definir como endereço padrão
                    </label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 rounded-xl"
                        disabled={addressForm.formState.isSubmitting}
                      >
                        {addressForm.formState.isSubmitting
                          ? "Salvando..."
                          : "Salvar endereço"}
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            ) : null}

            {view === "payments" ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-medium text-ink">Cartões</h2>

                {profile.paymentMethods.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ade8f4] bg-white px-5 py-10 text-center text-sm text-muted">
                    Nenhum cartão cadastrado ainda.
                  </div>
                ) : (
                  profile.paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white bg-white px-5 py-4 shadow-[0_8px_28px_rgba(26,95,122,0.06)] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#e8f4f7] bg-[#f7fcfd] text-[10px] font-semibold uppercase tracking-wide text-[#1a5f7a]">
                          {method.brand.slice(0, 4)}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="font-medium text-ink">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="truncate text-sm text-muted">
                            {method.holderName}
                          </p>
                          <p className="text-sm text-muted">
                            Validade {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
                        {!method.isDefault ? (
                          <button
                            type="button"
                            onClick={() =>
                              runPaymentAction(method.id, "default")
                            }
                            className="cursor-pointer text-sm text-[#2a9bb0] hover:underline"
                          >
                            Definir padrão
                          </button>
                        ) : (
                          <span className="text-[10px] uppercase tracking-[0.14em] text-[#7aabba]">
                            Padrão
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => runPaymentAction(method.id, "delete")}
                          className="cursor-pointer text-sm text-[#2a9bb0] hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {!showPaymentForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(true)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#cfeaf2] bg-[#e8f7fb] py-4 text-sm font-medium text-[#1a5f7a] transition-colors hover:bg-[#dff6fb]"
                  >
                    <Plus size={16} />
                    Adicionar cartão
                  </button>
                ) : (
                  <form
                    onSubmit={savePayment}
                    className="space-y-4 rounded-2xl border border-white bg-white p-5 shadow-[0_8px_28px_rgba(26,95,122,0.06)]"
                  >
                    <h3 className="font-medium text-ink">Novo cartão</h3>
                    <Input
                      label="Nome no cartão"
                      autoComplete="cc-name"
                      {...paymentForm.register("holderName")}
                      error={paymentForm.formState.errors.holderName?.message}
                    />
                    <Controller
                      name="cardNumber"
                      control={paymentForm.control}
                      render={({ field }) => (
                        <Input
                          label="Número do cartão"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="0000 0000 0000 0000"
                          value={formatCardNumberDisplay(field.value || "")}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value.replace(/\D/g, "").slice(0, 19),
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={
                            paymentForm.formState.errors.cardNumber?.message
                          }
                        />
                      )}
                    />
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <Input
                        label="Mês"
                        placeholder="MM"
                        inputMode="numeric"
                        autoComplete="cc-exp-month"
                        maxLength={2}
                        {...paymentForm.register("expiryMonth")}
                        error={
                          paymentForm.formState.errors.expiryMonth?.message
                        }
                      />
                      <Input
                        label="Ano"
                        placeholder="AA"
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        maxLength={2}
                        {...paymentForm.register("expiryYear")}
                        error={paymentForm.formState.errors.expiryYear?.message}
                      />
                      <Controller
                        name="cvv"
                        control={paymentForm.control}
                        render={({ field }) => (
                          <Input
                            label="CVV"
                            placeholder="000"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            type="password"
                            maxLength={4}
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value.replace(/\D/g, "").slice(0, 4),
                              )
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={paymentForm.formState.errors.cvv?.message}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl sm:w-auto"
                        onClick={() => setShowPaymentForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 rounded-xl"
                        disabled={paymentForm.formState.isSubmitting}
                      >
                        {paymentForm.formState.isSubmitting
                          ? "Salvando..."
                          : "Salvar cartão"}
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            ) : null}

            {view === "orders" ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-medium text-ink">Compras</h2>
                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ade8f4] bg-white px-5 py-10 text-center text-sm text-muted">
                    Você ainda não tem pedidos.{" "}
                    <Link href="/produtos" className="text-[#2a9bb0] underline">
                      Ir às compras
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/pedido/${order.id}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white px-5 py-4 shadow-[0_8px_28px_rgba(26,95,122,0.06)] transition-colors hover:border-[#ade8f4]"
                    >
                      <div>
                        <p className="font-medium text-ink">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1a5f7a]">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#7aabba]">
                          {order.paymentStatus === "APPROVED"
                            ? "Pago"
                            : order.paymentStatus}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
