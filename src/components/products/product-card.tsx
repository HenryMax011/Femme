"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatCurrency, formatInstallments } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] bg-white p-3 shadow-[0_8px_30px_rgba(26,95,122,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(26,95,122,0.12)]">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#e8f4f7]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a5f7a]/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew ? (
            <span className="rounded-full bg-[#1a5f7a] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white shadow-sm">
              Novo
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="rounded-full bg-[#2a9bb0] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white shadow-sm">
              Mais vendido
            </span>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0 translate-x-[-130%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

        <button
          type="button"
          aria-label={`Adicionar ${product.name} ao carrinho`}
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className={cn(
            "absolute bottom-3 right-3 flex size-10 cursor-pointer items-center justify-center rounded-full",
            "bg-white/95 text-ink shadow-md backdrop-blur-sm",
            "translate-y-2 opacity-0 transition-all duration-300",
            "group-hover:translate-y-0 group-hover:opacity-100",
            "hover:bg-white hover:text-[#1a5f7a]",
          )}
        >
          <ShoppingBag size={16} strokeWidth={1.75} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7aabba]">
          {product.brand}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <StarRating
            rating={product.rating}
            size={13}
            className="[&_svg]:fill-[#2a9bb0] [&_svg]:text-[#2a9bb0]"
          />
          <span className="text-xs text-[#7aabba]">
            ({product.reviewCount})
          </span>
        </div>

        <Link href={`/produtos/${product.slug}`}>
          <h3 className="mt-1.5 font-display text-xl font-light leading-snug text-ink transition-colors hover:text-[#1a5f7a]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs font-light leading-relaxed text-[#5a8a9a]">
          {product.shortDesc}
        </p>

        <div className="mt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-semibold text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.compareAt ? (
              <span className="text-sm text-[#9bb8c4] line-through">
                {formatCurrency(product.compareAt)}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] text-[#7aabba]">
            {formatInstallments(product.price)}
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => addItem(product)}
            className="flex-1 cursor-pointer rounded-xl border border-[#ade8f4] bg-white py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#1a5f7a] transition-colors duration-300 hover:border-[#2a9bb0] hover:bg-[#f0fafd]"
          >
            Carrinho
          </button>
          <button
            type="button"
            onClick={() => {
              addItem(product);
              router.push("/checkout");
            }}
            className="flex-1 cursor-pointer rounded-xl bg-[#1a5f7a] py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#164f66]"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}
