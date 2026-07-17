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
    <article className="group flex h-full min-w-0 flex-col border border-white/90 bg-white/65 p-2 shadow-[0_10px_36px_rgba(91,188,214,0.1)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#ade8f4] hover:bg-white/85 hover:shadow-[0_18px_48px_rgba(91,188,214,0.2)] sm:p-3">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#e8f4f7]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a5f7a]/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew ? (
            <span className="border border-[#ade8f4]/80 bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#1a5f7a] backdrop-blur-md">
              Novo
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="border border-[#1a5f7a]/20 bg-[#1a5f7a]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md">
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
            "absolute bottom-3 right-3 flex size-9 cursor-pointer items-center justify-center sm:size-10",
            "border border-white/80 bg-white/95 text-[#1a5f7a] shadow-md backdrop-blur-sm",
            "translate-y-0 opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0",
            "group-hover:translate-y-0 group-hover:opacity-100",
            "hover:bg-white",
          )}
        >
          <ShoppingBag size={16} strokeWidth={1.75} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-3 sm:px-1 sm:pb-1 sm:pt-4">
        <p className="truncate text-[9px] uppercase tracking-[0.18em] text-[#7aabba] sm:text-[10px] sm:tracking-[0.22em]">
          {product.brand}
        </p>

        <div className="mt-1.5 flex items-center gap-1 sm:mt-2 sm:gap-1.5">
          <StarRating
            rating={product.rating}
            size={12}
            className="[&_svg]:fill-[#5bbcd6] [&_svg]:text-[#5bbcd6]"
          />
          <span className="text-[10px] text-[#7aabba] sm:text-xs">
            ({product.reviewCount})
          </span>
        </div>

        <Link href={`/produtos/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-light leading-snug text-[#1a5f7a] transition-colors hover:text-[#154d63] sm:mt-1.5 sm:text-xl">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 hidden line-clamp-2 text-xs font-light leading-relaxed text-[#5a8a9a] sm:mt-1.5 sm:block">
          {product.shortDesc}
        </p>

        <div className="mt-2 sm:mt-3">
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-base font-semibold text-[#1a5f7a] sm:text-lg">
              {formatCurrency(product.price)}
            </span>
            {product.compareAt ? (
              <span className="text-xs text-[#9bb8c4] line-through sm:text-sm">
                {formatCurrency(product.compareAt)}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[10px] text-[#7aabba] sm:text-[11px]">
            {formatInstallments(product.price)}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:flex-row sm:gap-2 sm:pt-4">
          <button
            type="button"
            onClick={() => addItem(product)}
            className="flex-1 cursor-pointer border border-[#ade8f4] bg-white py-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#1a5f7a] transition-all duration-300 hover:border-[#5bbcd6] hover:bg-[#f0fafd] sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em]"
          >
            Carrinho
          </button>
          <button
            type="button"
            onClick={() => {
              addItem(product);
              router.push("/checkout");
            }}
            className="flex-1 cursor-pointer border border-[#1a5f7a] bg-[#1a5f7a] py-2 text-[9px] font-medium uppercase tracking-[0.12em] text-white shadow-[0_6px_18px_rgba(26,95,122,0.18)] transition-all duration-300 hover:bg-[#154d63] hover:shadow-[0_10px_24px_rgba(26,95,122,0.26)] sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em]"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}
