import { products } from "@/data/products";
import type { Product, ProductFilters } from "@/types";

export function filterProducts(filters: ProductFilters = {}): Product[] {
  let result = [...products];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    const cat = filters.category;
    if (cat === "masculino") {
      result = result.filter((p) => p.gender === "MALE" || p.categorySlug === "masculino");
    } else if (cat === "feminino") {
      result = result.filter(
        (p) => p.gender === "FEMALE" || p.categorySlug === "feminino",
      );
    } else {
      result = result.filter((p) => p.categorySlug === cat);
    }
  }

  if (filters.gender && filters.gender !== "all") {
    result = result.filter(
      (p) => p.gender === filters.gender || p.gender === "UNISEX",
    );
  }

  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand);
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.bestSeller) {
    result = result.filter((p) => p.isBestSeller);
  }

  if (filters.isNew) {
    result = result.filter((p) => p.isNew);
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "bestseller":
      result.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    default:
      result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
  }

  return result;
}
