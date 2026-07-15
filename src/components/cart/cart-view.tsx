"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateShipping } from "@/lib/shipping";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discount);
  const couponCode = useCartStore((s) => s.couponCode);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const total = useCartStore((s) => s.total());

  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponMsg, setCouponMsg] = useState("");
  const [zip, setZip] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingLabel, setShippingLabel] = useState("");

  const applyCoupon = async () => {
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput, subtotal }),
    });
    const data = await res.json();
    if (!data.ok) {
      setCouponMsg(data.message);
      setCoupon(null, 0);
      return;
    }
    setCoupon(data.code, data.discount);
    setCouponMsg(data.message);
  };

  const calcFrete = () => {
    const options = calculateShipping(zip);
    if (!options.length) {
      setShippingLabel("CEP inválido");
      setShippingPrice(0);
      return;
    }
    const selected = options[0];
    setShippingPrice(selected.price);
    setShippingLabel(`${selected.name} · ${selected.days}`);
  };

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-border bg-white/80 px-6 py-16 text-center shadow-[var(--shadow)]">
        <h2 className="font-display text-3xl text-ink">Seu carrinho está vazio</h2>
        <p className="mt-2 text-muted">Explore o catálogo e encontre seu próximo ritual.</p>
        <Link href="/produtos" className="mt-6 inline-block">
          <Button>Ver produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 rounded-[1.75rem] border border-border bg-white/80 p-4 shadow-[var(--shadow)]"
          >
            <Link
              href={`/produtos/${item.slug}`}
              className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl"
            >
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/produtos/${item.slug}`} className="font-display text-2xl text-ink">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="cursor-pointer rounded-full p-2 text-muted hover:bg-soft hover:text-ink"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="inline-flex items-center rounded-2xl border border-border">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit space-y-5 rounded-[1.75rem] border border-border bg-white/90 p-6 shadow-[var(--shadow)]">
        <h2 className="font-display text-3xl text-ink">Resumo</h2>

        <div className="space-y-2">
          <Input
            label="Cupom de desconto"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="SELAVIE10"
          />
          <Button variant="outline" className="w-full" onClick={applyCoupon}>
            Aplicar cupom
          </Button>
          {couponMsg ? <p className="text-xs text-muted">{couponMsg}</p> : null}
        </div>

        <div className="space-y-2">
          <Input
            label="Calcular frete (CEP)"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="00000-000"
          />
          <Button variant="outline" className="w-full" onClick={calcFrete}>
            Calcular frete
          </Button>
          {shippingLabel ? (
            <p className="text-xs text-muted">
              {shippingLabel}
              {shippingPrice >= 0
                ? ` · ${shippingPrice === 0 ? "Grátis" : formatCurrency(shippingPrice)}`
                : ""}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 border-t border-border pt-4 text-sm">
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
              {shippingPrice === 0 && shippingLabel
                ? "Grátis"
                : formatCurrency(shippingPrice)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total + shippingPrice)}</span>
          </div>
        </div>

        <Link href="/checkout">
          <Button className="w-full" size="lg">
            Ir para o checkout
          </Button>
        </Link>
      </aside>
    </div>
  );
}
