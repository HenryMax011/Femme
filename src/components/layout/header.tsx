"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isHome = pathname === "/";
  const isDarkSurface = isHome;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [heroLeaving, setHeroLeaving] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const accountHref = session?.user ? "/perfil" : "/login";
  const accountLabel = session?.user ? "Perfil" : "Login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onLeave = () => setHeroLeaving(true);
    window.addEventListener("selavie:hero-leave", onLeave);
    return () => window.removeEventListener("selavie:hero-leave", onLeave);
  }, []);

  useEffect(() => {
    setHeroLeaving(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const lightOnDark = isDarkSurface && !scrolled;
  const text = lightOnDark ? "text-white/80" : "text-ink/80";
  const textHover = lightOnDark ? "hover:text-white" : "hover:text-ink";
  const active = lightOnDark ? "text-white" : "text-ink";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/70 shadow-[0_8px_30px_rgba(91,188,214,0.12)] backdrop-blur-xl"
          : "bg-transparent",
        heroLeaving && "pointer-events-none opacity-0",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {isHome ? (
          <span className="relative z-10 block h-11 w-[7.5rem] shrink-0" aria-hidden />
        ) : (
          <Link href="/" className="relative z-10 shrink-0">
            <BrandLogo size="sm" priority />
          </Link>
        )}

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[11px] font-light uppercase tracking-[0.2em] transition-opacity duration-300",
                pathname === item.href ? active : text,
                textHover,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={accountHref}
            className={cn(
              "hidden cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[11px] font-light uppercase tracking-[0.16em] transition-colors sm:inline-flex",
              text,
              textHover,
            )}
          >
            <UserRound className="h-4 w-4" />
            {accountLabel}
          </Link>

          <Link
            href="/carrinho"
            className={cn(
              "relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors",
              lightOnDark
                ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                : "border-border bg-white/60 text-ink hover:bg-white",
            )}
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-aqua px-1 text-[10px] font-medium text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border md:hidden",
              lightOnDark
                ? "border-white/30 bg-white/10 text-white"
                : "border-border bg-white/60 text-ink",
            )}
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a5f7a]/35 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="ml-auto flex h-full w-[86%] max-w-sm flex-col bg-[#dff6fb]/95 p-6 shadow-xl backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <BrandLogo size="sm" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/70"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  ...nav,
                  { href: "/carrinho", label: "Carrinho" },
                  {
                    href: accountHref,
                    label: session?.user ? "Perfil" : "Login/Cadastro",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-none px-2 py-3 text-xs font-light uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
