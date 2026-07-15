import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça a história, missão, visão e valores da Selavie Femme.",
};

export default function AboutPage() {
  return <AboutContent />;
}
