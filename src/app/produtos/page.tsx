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
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-5xl text-ink">Produtos</h1>
        <p className="mt-3 text-muted">
          Catálogo premium com filtros inteligentes e experiência de compra fluida.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-soft" />}>
          <ProductFilters />
        </Suspense>

        <div>
          <p className="mb-4 text-sm text-muted">
            {list.length} produto{list.length === 1 ? "" : "s"} encontrado
            {list.length === 1 ? "" : "s"}
          </p>
          {list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-border bg-white/80 px-6 py-16 text-center">
              <p className="font-display text-3xl">Nenhum produto encontrado</p>
              <p className="mt-2 text-muted">Ajuste os filtros e tente novamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
