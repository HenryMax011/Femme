"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { FeaturedProductCard } from "@/components/home/featured-product-card";
import type { Product } from "@/types";

const FEATURED_ITEMS: { slug: string; badge?: "bestseller" | "new" }[] = [
  { slug: "serum-aqua-radiance", badge: "bestseller" },
  { slug: "eau-de-parfum-lumiere", badge: "new" },
  { slug: "creme-corporal-velours" },
  { slug: "gel-limpeza-pure-balance" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function FeaturedProducts() {
  const reduceMotion = useReducedMotion();

  const featured = FEATURED_ITEMS.map(({ slug, badge }) => {
    const product = products.find((p) => p.slug === slug);
    return product ? { product, badge } : null;
  }).filter(Boolean) as {
    product: Product;
    badge?: "bestseller" | "new";
  }[];

  return (
    <section className="relative py-16 pb-10 sm:py-20 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#5bbcd6]">
              Destaques
            </p>
            <h2 className="font-display text-4xl font-light text-[#1a5f7a] sm:text-[2.75rem]">
              Mais amados
            </h2>
            <p className="mt-2 max-w-md text-sm font-light text-[#3a8fa8]">
              Seleção especial dos queridinhos das nossas clientes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
          >
            <Link
              href="/produtos?sort=bestseller"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ade8f4] bg-white px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#1a5f7a] shadow-[0_8px_28px_rgba(91,188,214,0.18)] transition-all duration-300 hover:bg-[#f7fcfd] hover:shadow-[0_12px_32px_rgba(91,188,214,0.28)] sm:px-12 sm:text-[13px]"
            >
              Ver catálogo
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {featured.map(({ product, badge }, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.65,
                delay: reduceMotion ? 0 : index * 0.08,
                ease: easeOut,
              }}
            >
              <FeaturedProductCard product={product} badge={badge} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
