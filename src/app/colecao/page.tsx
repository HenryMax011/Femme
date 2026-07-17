import type { Metadata } from "next";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { NewsletterSection } from "@/components/home/newsletter-section";

export const metadata: Metadata = {
  title: "Coleção",
  description:
    "Explore categorias e os produtos mais amados da Selavie Femme.",
};

export default function ColecaoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef9fc]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#ffffff_0%,#dff6fb_40%,#caf0f8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-20 h-[42vw] w-[42vw] rounded-full bg-[radial-gradient(circle,rgba(91,188,214,0.22),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/5 bottom-0 h-[38vw] w-[38vw] rounded-full bg-[radial-gradient(circle,rgba(173,232,244,0.45),transparent_70%)] blur-3xl"
      />

      <div className="relative z-10">
        <CategoriesSection />
        <FeaturedProducts />
        <NewsletterSection />
      </div>
    </div>
  );
}
