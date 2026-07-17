"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { useCartStore } from "@/store/cart-store";

type Props = {
  product: Product;
  badge?: "bestseller" | "new";
};

export function FeaturedProductCard({ product, badge }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const badgeLabel =
    badge === "new"
      ? "Novo"
      : badge === "bestseller"
        ? "Mais vendido"
        : null;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/90 bg-white/65 p-3 shadow-[0_10px_36px_rgba(91,188,214,0.1)] backdrop-blur-md transition-all duration-500 hover:border-[#ade8f4] hover:bg-white/85 hover:shadow-[0_16px_44px_rgba(91,188,214,0.18)]">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-[#e8f4f7]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {badgeLabel ? (
          <span className="absolute left-3 top-3 rounded-full border border-[#ade8f4]/80 bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#1a5f7a] backdrop-blur-md">
            {badgeLabel}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
        <div className="mb-2 flex items-center gap-1.5">
          <StarRating
            rating={product.rating}
            size={13}
            className="[&_svg]:fill-[#5bbcd6] [&_svg]:text-[#5bbcd6]"
          />
          <span className="text-xs text-[#7aabba]">
            ({product.reviewCount})
          </span>
        </div>

        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-display text-xl font-light leading-snug text-[#1a5f7a] transition-colors hover:text-[#154d63]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-[#1a5f7a]">
            {formatCurrency(product.price)}
          </span>
          {product.compareAt ? (
            <span className="text-sm text-[#9bb8c4] line-through">
              {formatCurrency(product.compareAt)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => {
            addItem(product);
            router.push("/checkout");
          }}
          className="mt-4 w-full cursor-pointer rounded-xl border border-[#ade8f4] bg-[#1a5f7a] py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(26,95,122,0.18)] transition-all duration-300 hover:bg-[#154d63] hover:shadow-[0_12px_28px_rgba(26,95,122,0.26)]"
        >
          Comprar Agora
        </button>
      </div>
    </article>
  );
}
