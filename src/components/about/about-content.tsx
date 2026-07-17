"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Target } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;

const pillars = [
  {
    title: "Missão",
    text: "Elevar o cuidado diário com fórmulas elegantes, eficazes e prazerosas de usar.",
    icon: Heart,
  },
  {
    title: "Visão",
    text: "Ser referência em beleza consciente e experiência de compra digital no Brasil.",
    icon: Target,
  },
  {
    title: "Compromisso",
    text: "Qualidade, inclusão e bem-estar em cada detalhe — do produto ao pós-venda.",
    icon: Sparkles,
  },
];

const values = [
  {
    title: "Qualidade",
    text: "Fórmulas selecionadas com ativos de alta performance e segurança comprovada.",
  },
  {
    title: "Bem-estar",
    text: "Cuidar da pele é também cuidar da autoestima e do ritual diário.",
  },
  {
    title: "Inclusão",
    text: "Linhas pensadas para homens e mulheres, sem abrir mão da sofisticação.",
  },
  {
    title: "Transparência",
    text: "Comunicação clara sobre ingredientes, uso e expectativa de resultados.",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80",
    alt: "Ritual de skincare",
    caption: "Ritual",
  },
  {
    src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80",
    alt: "Cuidado facial",
    caption: "Cuidado",
  },
  {
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=80",
    alt: "Beleza natural",
    caption: "Essência",
  },
];

export function AboutContent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#eef9fc]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#ffffff_0%,#dff6fb_42%,#caf0f8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-24 h-[42vw] w-[42vw] rounded-full bg-[radial-gradient(circle,rgba(91,188,214,0.2),transparent_70%)] blur-3xl"
      />

      <section className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-white/60 blur-3xl"
        />
        <div className="mx-auto grid min-h-[min(760px,100svh)] max-w-7xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: easeOut }}
            className="relative z-10"
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#5bbcd6]">
              Nossa história
            </p>
            <h1 className="max-w-xl font-display text-5xl font-light leading-[1.02] text-[#1a5f7a] sm:text-6xl lg:text-7xl">
              Beleza que nasce
              <span className="block italic text-[#3a9fba]">do cuidado.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base font-light leading-8 text-[#3d7588]">
              Nascemos do desejo de transformar o cuidado pessoal em uma
              experiência premium, sensorial e acessível. Unimos ciência
              cosmética e estética minimalista para criar produtos que
              acompanham a rotina de quem valoriza resultados e bem-estar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produtos"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#1a5f7a] bg-[#1a5f7a] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(26,95,122,0.18)] transition-all duration-300 hover:bg-[#154d63] hover:shadow-[0_12px_30px_rgba(26,95,122,0.25)]"
              >
                Ver coleção
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contato"
                className="inline-flex cursor-pointer items-center rounded-xl border border-[#ade8f4] bg-white/70 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a5f7a] backdrop-blur-md transition-all duration-300 hover:border-[#5bbcd6] hover:bg-white"
              >
                Fale conosco
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.08 }}
            className="relative mx-auto w-full max-w-2xl"
          >
            <div className="absolute -inset-5 rounded-[1.75rem] border border-white/75 bg-white/30 shadow-[0_24px_80px_rgba(91,188,214,0.16)] backdrop-blur-md" />
            <div className="relative grid grid-cols-2 gap-3">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl bg-[#e8f4f7]">
                <Image
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
                  alt="Ambiente de beleza e cuidados"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a5f7a]/20 to-transparent" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e8f4f7]">
                <Image
                  src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80"
                  alt="Fórmulas e cuidados"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e8f4f7]">
                <Image
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
                  alt="Ritual de beleza"
                  fill
                  className="object-cover object-top"
                  sizes="25vw"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/90 bg-white/90 px-6 py-3 shadow-[0_10px_30px_rgba(26,95,122,0.12)] backdrop-blur-xl">
              <span className="h-px w-8 bg-[#5bbcd6]" />
              <p className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.28em] text-[#1a5f7a]">
                Selavie Femme
              </p>
              <span className="h-px w-8 bg-[#5bbcd6]" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#5bbcd6]">
            O que nos move
          </p>
          <h2 className="font-display text-4xl font-light text-[#1a5f7a] sm:text-5xl">
            Cuidado em cada detalhe
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.65,
                  delay: reduceMotion ? 0 : index * 0.1,
                  ease: easeOut,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/90 bg-white/70 p-7 shadow-[0_10px_36px_rgba(91,188,214,0.1)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#ade8f4] hover:bg-white/90 hover:shadow-[0_18px_48px_rgba(91,188,214,0.18)]"
              >
                <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-[#ade8f4] bg-[#e8f7fb] text-[#1a5f7a] transition-colors duration-300 group-hover:bg-[#1a5f7a] group-hover:text-white">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h2 className="font-display text-3xl font-light text-ink">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#5a8a9a]">
                  {item.text}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative border-y border-white/70 bg-white/35 py-16 backdrop-blur-sm sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: easeOut }}
            className="mb-10 max-w-xl"
          >
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#2a9bb0]">
              Essência
            </p>
            <h2 className="font-display text-4xl font-light text-ink sm:text-5xl">
              Nossos valores
            </h2>
            <p className="mt-3 text-sm font-light text-[#5a8a9a]">
              Princípios que guiam cada fórmula, cada embalagem e cada
              atendimento.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.6,
                  delay: reduceMotion ? 0 : index * 0.07,
                  ease: easeOut,
                }}
                className="rounded-2xl border border-white/90 bg-white/70 p-6 transition-all duration-300 hover:border-[#ade8f4] hover:bg-white/90 hover:shadow-[0_12px_40px_rgba(26,95,122,0.08)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full border border-[#ade8f4] bg-[#dff6fb] font-display text-sm text-[#1a5f7a]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-light text-ink">
                    {value.title}
                  </h3>
                </div>
                <p className="text-sm font-light leading-relaxed text-[#5a8a9a]">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mb-10 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#2a9bb0]">
                Universo visual
              </p>
              <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">
                A estética Selavie
              </h2>
            </div>
            <Link
              href="/produtos"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ade8f4] bg-white px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#1a5f7a] shadow-[0_8px_28px_rgba(91,188,214,0.18)] transition-all duration-300 hover:bg-[#f7fcfd] hover:shadow-[0_12px_32px_rgba(91,188,214,0.28)] sm:px-12 sm:text-[13px]"
            >
              Explorar produtos
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {gallery.map((item, index) => (
              <motion.figure
                key={item.src}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.65,
                  delay: reduceMotion ? 0 : index * 0.08,
                  ease: easeOut,
                }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/90 bg-[#e8f4f7] shadow-[0_12px_36px_rgba(91,188,214,0.1)]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#7aabba]">
                  {item.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
