"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  checkoutAddressSchema,
  checkoutCustomerSchema,
  type CheckoutAddressInput,
  type CheckoutCustomerInput,
} from "@/lib/validations";
import { useCartStore } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CpfInput } from "@/components/ui/cpf-input";
import { CepInput } from "@/components/ui/cep-input";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { calculateShipping } from "@/lib/shipping";
import { lookupAddressByCep } from "@/lib/cep";
import { BRAZIL_STATES } from "@/lib/brazil-states";
import type { ShippingOption } from "@/types";
import type { PublicUserProfile } from "@/types/profile";
import { PixPayment } from "@/components/checkout/pix-payment";

const steps = ["Cliente", "Endereço", "Frete", "Pagamento", "Confirmação"];

export function CheckoutFlow({
  initialProfile = null,
}: {
  initialProfile?: PublicUserProfile | null;
}) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discount);
  const couponCode = useCartStore((s) => s.couponCode);
  const clearCart = useCartStore((s) => s.clearCart);

  const defaultAddress =
    initialProfile?.addresses.find((item) => item.isDefault) ||
    initialProfile?.addresses[0];

  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<CheckoutCustomerInput | null>(null);
  const [address, setAddress] = useState<CheckoutAddressInput | null>(null);
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    copyPaste: string;
    qrCodeDataUrl: string;
    expiresAt: string;
    orderNumber: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepStatus, setCepStatus] = useState("");
  const [lookingUpCep, setLookingUpCep] = useState(false);

  const customerForm = useForm<CheckoutCustomerInput>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      name: initialProfile?.name || "",
      email: initialProfile?.email || "",
      cpf: initialProfile?.cpf || "",
      phone: initialProfile?.phone || "",
    },
  });

  const addressForm = useForm<CheckoutAddressInput>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      zip: defaultAddress?.zip || "",
      street: defaultAddress?.street || "",
      number: defaultAddress?.number || "",
      complement: defaultAddress?.complement || "",
      district: defaultAddress?.district || "",
      city: defaultAddress?.city || "",
      state: defaultAddress?.state || "",
    },
  });

  const total = useMemo(
    () => Math.max(0, subtotal - discount + (shipping?.price || 0)),
    [subtotal, discount, shipping],
  );

  if (!items.length && !orderId) {
    return (
      <div className="rounded-[2rem] border border-border bg-white/80 px-6 py-16 text-center">
        <h2 className="font-display text-3xl">Carrinho vazio</h2>
        <Button className="mt-6" onClick={() => router.push("/produtos")}>
          Ir às compras
        </Button>
      </div>
    );
  }

  const onCustomer = customerForm.handleSubmit((data) => {
    setCustomer(data);
    setStep(1);
  });

  const fillAddressFromCep = async (cepDigits: string) => {
    if (cepDigits.length !== 8) {
      setCepStatus("");
      return;
    }

    setLookingUpCep(true);
    setCepStatus("Buscando endereço...");
    try {
      const addressData = await lookupAddressByCep(cepDigits);
      if (!addressData) {
        setCepStatus("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }

      if (addressData.street) {
        addressForm.setValue("street", addressData.street, {
          shouldValidate: true,
        });
      }
      if (addressData.district) {
        addressForm.setValue("district", addressData.district, {
          shouldValidate: true,
        });
      }
      if (addressData.city) {
        addressForm.setValue("city", addressData.city, { shouldValidate: true });
      }
      if (addressData.state) {
        addressForm.setValue("state", addressData.state, {
          shouldValidate: true,
        });
      }
      setCepStatus("Endereço preenchido. Confira e informe o número.");
    } catch {
      setCepStatus("Não foi possível buscar o CEP. Preencha manualmente.");
    } finally {
      setLookingUpCep(false);
    }
  };

  const onAddress = addressForm.handleSubmit((data) => {
    setAddress(data);
    const options = calculateShipping(data.zip);
    setShippingOptions(options);
    setShipping(options[0] || null);
    setStep(2);
  });

  const createOrder = async () => {
    if (!customer || !address || !shipping) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          address,
          shipping,
          items,
          couponCode,
          discount,
          subtotal,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao criar pedido");

      setOrderId(data.orderId);
      setPixData({
        copyPaste: data.pixCopyPaste,
        qrCodeDataUrl: data.pixQrCodeDataUrl,
        expiresAt: data.pixExpiresAt,
        orderNumber: data.orderNumber,
      });
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <div
              key={label}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium",
                index === step
                  ? "bg-aqua text-ink"
                  : index < step
                    ? "bg-soft-2 text-ink"
                    : "bg-soft text-muted",
              )}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>

        {step === 0 && (
          <form
            onSubmit={onCustomer}
            className="space-y-4 rounded-[1.75rem] border border-border bg-white/90 p-6"
          >
            <h2 className="font-display text-3xl">Dados do cliente</h2>
            {initialProfile ? (
              <p className="rounded-xl bg-[#dff6fb] px-4 py-3 text-sm text-[#1a5f7a]">
                Dados preenchidos pelo seu perfil. Confira antes de continuar.
              </p>
            ) : null}
            <Input
              label="Nome completo"
              {...customerForm.register("name")}
              error={customerForm.formState.errors.name?.message}
            />
            <Input
              label="E-mail"
              type="email"
              {...customerForm.register("email")}
              error={customerForm.formState.errors.email?.message}
            />
            <Controller
              name="cpf"
              control={customerForm.control}
              render={({ field }) => (
                <CpfInput
                  label="CPF"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  error={customerForm.formState.errors.cpf?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={customerForm.control}
              render={({ field }) => (
                <PhoneInput
                  label="Telefone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  error={customerForm.formState.errors.phone?.message}
                />
              )}
            />
            <Button type="submit" className="w-full">
              Continuar
            </Button>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={onAddress}
            className="space-y-4 rounded-[1.75rem] border border-border bg-white/90 p-6"
          >
            <h2 className="font-display text-3xl">Endereço</h2>
            {initialProfile && initialProfile.addresses.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted">Endereços salvos no perfil:</p>
                <div className="flex flex-wrap gap-2">
                  {initialProfile.addresses.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => {
                        addressForm.reset({
                          zip: saved.zip,
                          street: saved.street,
                          number: saved.number,
                          complement: saved.complement || "",
                          district: saved.district,
                          city: saved.city,
                          state: saved.state,
                        });
                      }}
                      className="cursor-pointer rounded-full border border-[#ade8f4] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#1a5f7a] hover:border-[#5bbcd6]"
                    >
                      {saved.label}
                      {saved.isDefault ? " · padrão" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
                  hint={lookingUpCep ? "Buscando endereço..." : cepStatus}
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
            <Input label="Complemento" {...addressForm.register("complement")} />
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
                <span className="text-sm font-medium text-ink/80">UF</span>
                <select
                  {...addressForm.register("state")}
                  className={cn(
                    "w-full rounded-xl border border-[#ade8f4]/80 bg-white/60 px-3 py-3 text-sm font-light text-ink outline-none transition-all duration-200 focus:border-aqua focus:ring-2 focus:ring-aqua/20",
                    addressForm.formState.errors.state &&
                      "border-red-400 focus:border-red-400 focus:ring-red-200",
                  )}
                >
                  <option value="">UF</option>
                  {BRAZIL_STATES.map((state) => (
                    <option key={state.uf} value={state.uf}>
                      {state.uf}
                    </option>
                  ))}
                </select>
                {addressForm.formState.errors.state?.message ? (
                  <span className="text-xs text-red-500">
                    {addressForm.formState.errors.state.message}
                  </span>
                ) : null}
              </label>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                Voltar
              </Button>
              <Button type="submit" className="flex-1">
                Continuar
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4 rounded-[1.75rem] border border-border bg-white/90 p-6">
            <h2 className="font-display text-3xl">Frete</h2>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setShipping(option)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                    shipping?.id === option.id
                      ? "border-aqua bg-soft"
                      : "border-border hover:border-aqua/50",
                  )}
                >
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-muted">{option.days}</p>
                  </div>
                  <p className="font-semibold">
                    {option.price === 0 ? "Grátis" : formatCurrency(option.price)}
                  </p>
                </button>
              ))}
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                className="flex-1"
                disabled={!shipping || loading}
                onClick={createOrder}
              >
                {loading ? "Gerando PIX..." : "Pagar com PIX"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && pixData && orderId ? (
          <PixPayment
            orderId={orderId}
            orderNumber={pixData.orderNumber}
            copyPaste={pixData.copyPaste}
            qrCodeDataUrl={pixData.qrCodeDataUrl}
            expiresAt={pixData.expiresAt}
            onApproved={() => {
              clearCart();
              setStep(4);
            }}
          />
        ) : null}

        {step === 4 && orderId ? (
          <div className="rounded-[1.75rem] border border-border bg-white/90 p-8 text-center">
            <h2 className="font-display text-4xl text-ink">Pedido confirmado</h2>
            <p className="mt-3 text-muted">
              Pagamento aprovado. Obrigado por escolher a Selavie Femme.
            </p>
            <Button
              className="mt-6"
              onClick={() => router.push(`/pedido/${orderId}`)}
            >
              Ver detalhes do pedido
            </Button>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-[1.75rem] border border-border bg-white/90 p-6 shadow-[var(--shadow)]">
        <h3 className="font-display text-3xl">Seu pedido</h3>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <div className="relative h-16 w-14 overflow-hidden rounded-xl">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted">
                  {item.quantity}x {formatCurrency(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Desconto</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Frete</span>
            <span>
              {shipping
                ? shipping.price === 0
                  ? "Grátis"
                  : formatCurrency(shipping.price)
                : "—"}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
