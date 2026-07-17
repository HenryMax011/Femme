import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  productReviews,
  products,
} from "@/data/products";
import { ProductGallery } from "@/components/products/product-gallery";
import { AddToCartActions } from "@/components/products/add-to-cart-actions";
import { ProductCard } from "@/components/products/product-card";
import { StarRating } from "@/components/ui/star-rating";
import { formatCurrency, formatInstallments } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produto" };
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = productReviews[product.id] || [];
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <Link
        href="/produtos"
        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#ade8f4] bg-white/80 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1a5f7a] transition-colors hover:bg-white"
      >
        <ArrowLeft size={14} />
        Todos os produtos
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-5xl text-ink">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted">
              {product.rating.toFixed(1)} · {product.reviewCount} avaliações
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">
              {formatCurrency(product.price)}
            </span>
            {product.compareAt ? (
              <span className="text-muted line-through">
                {formatCurrency(product.compareAt)}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted">
            {formatInstallments(product.price)}
          </p>

          <p className="mt-6 leading-relaxed text-muted">{product.shortDesc}</p>

          <div className="mt-8">
            <AddToCartActions product={product} />
          </div>

          <div className="mt-10 space-y-6">
            <section>
              <h2 className="font-display text-2xl">Descrição</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.description}
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl">Ingredientes</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.ingredients}
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl">Modo de uso</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.howToUse}
              </p>
            </section>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-4xl">Avaliações</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.length ? (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[1.5rem] border border-border bg-white/80 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{review.author}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-3 text-sm text-muted">{review.comment}</p>
              </article>
            ))
          ) : (
            <p className="text-muted">Seja o primeiro a avaliar este produto.</p>
          )}
        </div>
      </section>

      {related.length ? (
        <section className="mt-16">
          <h2 className="font-display text-4xl">Produtos relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
