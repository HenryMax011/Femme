import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-skincare",
    name: "Skincare",
    slug: "skincare",
    description: "Rotinas de cuidado com a pele com ativos premium.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
  },
  {
    id: "cat-perfumes",
    name: "Perfumes",
    slug: "perfumes",
    description: "Fragrâncias sofisticadas para o dia e a noite.",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80",
  },
  {
    id: "cat-cremes",
    name: "Cremes Corporais",
    slug: "cremes-corporais",
    description: "Hidratação intensa e texturas aveludadas.",
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=900&q=80",
  },
  {
    id: "cat-faciais",
    name: "Cuidados Faciais",
    slug: "cuidados-faciais",
    description: "Tratamentos faciais com resultados visíveis.",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
  },
  {
    id: "cat-masculino",
    name: "Masculino",
    slug: "masculino",
    description: "Linha masculina com performance e elegância.",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80",
  },
  {
    id: "cat-feminino",
    name: "Feminino",
    slug: "feminino",
    description: "Coleção feminina delicada e irresistível.",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=80",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
