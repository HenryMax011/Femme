"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function NewsletterSection() {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("ok");
    setEmail("");
  };

  return (
    <section className="relative px-4 pb-20 pt-4 sm:px-6 sm:pb-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-[#8dd5ea]/35 shadow-[0_24px_70px_rgba(26,95,122,0.28)] sm:rounded-[2rem]"
      >
        {/* Fundo em camadas */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,#2a8aaa_0%,#1a5f7a_45%,#0f4558_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#5bbcd6]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8dd5ea]/60 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        <div className="relative z-10 grid gap-10 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-14 lg:py-16 lg:text-left">
          <div className="text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
              <span className="hidden h-px w-8 bg-[#8dd5ea]/70 sm:block" />
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b8e8f5]">
                Newsletter
              </p>
              <span className="hidden h-px w-8 bg-[#8dd5ea]/70 sm:block" />
            </div>

            <h2 className="font-display text-3xl font-light leading-tight text-white sm:text-4xl md:text-[2.6rem]">
              Receba novidades &amp;
              <span className="block italic text-[#caf0f8]">
                cuidados exclusivos
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-white/75 lg:mx-0">
              Cadastre-se e ganhe{" "}
              <span className="font-medium text-white">10% de desconto</span> na
              primeira compra. Dicas, lançamentos e rituais Selavie no seu
              e-mail.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            {status === "ok" ? (
              <div className="rounded-2xl border border-white/30 bg-white/12 px-6 py-8 text-center backdrop-blur-md">
                <p className="font-display text-2xl font-light text-white">
                  Inscrição confirmada
                </p>
                <p className="mt-2 text-sm font-light text-white/75">
                  Em breve você recebe novidades e o cupom de desconto.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md sm:rounded-3xl sm:p-5"
              >
                <label
                  htmlFor="newsletter-email"
                  className="mb-2 block text-left text-[10px] font-medium uppercase tracking-[0.2em] text-[#b8e8f5]"
                >
                  Seu e-mail
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="min-w-0 flex-1 rounded-full border border-white/35 bg-white px-5 py-3.5 text-sm font-light text-[#1a5f7a] outline-none transition-shadow placeholder:text-[#7aabba] focus:border-[#5bbcd6] focus:shadow-[0_0_0_3px_rgba(91,188,214,0.25)]"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full border border-white bg-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#1a5f7a] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#f0fafd] hover:shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
                  >
                    Inscrever-se
                  </button>
                </div>
                <p className="mt-3 text-left text-[11px] font-light text-white/50">
                  Sem spam. Cancele quando quiser.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
