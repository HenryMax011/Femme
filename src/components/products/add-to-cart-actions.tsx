"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { Minus, Plus } from "lucide-react";

export function AddToCartActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Quantidade</span>
        <div className="inline-flex items-center rounded-2xl border border-border">
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuir"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Aumentar"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => addItem(product, qty)}
        >
          Adicionar ao Carrinho
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            addItem(product, qty);
            router.push("/checkout");
          }}
        >
          Compra rápida
        </Button>
      </div>
    </div>
  );
}
