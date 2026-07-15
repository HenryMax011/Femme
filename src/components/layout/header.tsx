"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const lightOnHero = isHome && !scrolled;
  const text = lightOnHero ? "text-white/80" : "text-ink/80";
  const textHover = lightOnHero ? "hover:text-white" : "hover:text-ink";
  const active = lightOnHero ? "text-white" : "text-ink";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/70 shadow-[0_8px_30px_rgba(91,188,214,0.12)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "font-display text-sm font-light tracking-[0.35em] transition-colors",
            lightOnHero ? "text-white/90" : "text-ink",
          )}
        >
          SF
        </Link>

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
            href="/login"
            className={cn(
              "hidden cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[11px] font-light uppercase tracking-[0.16em] transition-colors sm:inline-flex",
              text,
              textHover,
            )}
          >
            <UserRound className="h-4 w-4" />
            Login
          </Link>

          <Link
            href="/carrinho"
            className={cn(
              "relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors",
              lightOnHero
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
              lightOnHero
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
                <span className="font-display text-sm tracking-[0.35em] text-ink">
                  SF
                </span>
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
                  { href: "/login", label: "Login/Cadastro" },
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
