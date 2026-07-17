import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/colecao", "/produtos", "/sobre", "/contato"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/produtos/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/categorias/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
