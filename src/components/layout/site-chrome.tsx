"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export function SiteChrome() {
  const pathname = usePathname();
  const isHeroHome = pathname === "/";

  if (isHeroHome) return null;

  return <Footer />;
}
