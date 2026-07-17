import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { filterProducts } from "@/lib/products";
import type { Gender, ProductFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo completo Selavie Femme: skincare, perfumes, cremes e cuidados faciais.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters: Filters = {
    category: typeof sp.categoria === "string" ? sp.categoria : undefined,
    gender: (typeof sp.genero === "string" ? sp.genero : "all") as Gender | "all",
    brand: typeof sp.marca === "string" ? sp.marca : undefined,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    bestSeller: sp.maisVendidos === "1",
    isNew: sp.novidades === "1",
    sort: (typeof sp.sort === "string"
      ? sp.sort
      : "bestseller") as Filters["sort"],
    q: typeof sp.q === "string" ? sp.q : undefined,
  };

  const list = filterProducts(filters);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef9fc]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#ffffff_0%,#dff6fb_40%,#caf0f8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-24 h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(91,188,214,0.2),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/5 bottom-0 h-[36vw] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(173,232,244,0.4),transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        <div className="mb-8 max-w-2xl sm:mb-12">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#5bbcd6]">
            Catálogo
          </p>
          <h1 className="font-display text-3xl font-light text-[#1a5f7a] sm:text-4xl md:text-5xl">
            Produtos
          </h1>
          <p className="mt-3 max-w-md text-sm font-light text-[#3a8fa8]">
            Skincare, perfumes e cuidados premium para o seu ritual de beleza.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-8 lg:grid-cols-[280px_1fr]">
          <Suspense
            fallback={
              <div className="h-12 animate-pulse rounded-xl bg-white/60 lg:h-96" />
            }
          >
            <ProductFilters />
          </Suspense>

          <div className="min-w-0">
            <p className="mb-4 text-xs font-light uppercase tracking-[0.18em] text-[#3a8fa8] sm:mb-5">
              {list.length} produto{list.length === 1 ? "" : "s"} encontrado
              {list.length === 1 ? "" : "s"}
            </p>
            {list.length ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {list.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/90 bg-white/65 px-5 py-12 text-center backdrop-blur-md sm:px-6 sm:py-16">
                <p className="font-display text-2xl font-light text-[#1a5f7a] sm:text-3xl">
                  Nenhum produto encontrado
                </p>
                <p className="mt-2 text-sm font-light text-[#3a8fa8]">
                  Ajuste os filtros e tente novamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
