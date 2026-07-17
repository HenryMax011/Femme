"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 35%"],
  });

  const stageOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const stageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [48, 0],
  );

  return (
    <section ref={ref} className="relative z-10 pb-6 pt-28">
      <motion.div
        style={{ opacity: stageOpacity, y: stageY }}
        className="mx-auto max-w-7xl origin-top px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
              },
            }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: easeOut },
                },
              }}
              className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#5bbcd6]"
            >
              Categorias
            </motion.p>
            <motion.h2
              variants={{
                hidden: {
                  opacity: 0,
                  y: 22,
                  filter: reduceMotion ? "blur(0px)" : "blur(8px)",
                },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.75, ease: easeOut },
                },
              }}
              className="font-display text-4xl font-light text-[#1a5f7a] sm:text-5xl"
            >
              Explore por categoria
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: easeOut },
                },
              }}
              className="mt-2 max-w-md text-sm font-light text-[#3a8fa8]"
            >
              Encontre exatamente o que a sua pele precisa.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeOut, delay: 0.15 }}
          >
            <Link
              href="/produtos"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ade8f4] bg-white px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#1a5f7a] shadow-[0_8px_28px_rgba(91,188,214,0.18)] transition-all duration-300 hover:bg-[#f7fcfd] hover:shadow-[0_12px_32px_rgba(91,188,214,0.28)] sm:px-12 sm:text-[13px]"
            >
              Ver todas
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px", amount: 0.2 }}
              variants={{
                hidden: {
                  opacity: 0,
                  y: reduceMotion ? 0 : 36,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    delay: reduceMotion ? 0 : index * 0.07,
                    ease: easeOut,
                  },
                },
              }}
            >
              <Link
                href={`/categorias/${category.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/80 bg-white/50 shadow-[0_12px_40px_rgba(91,188,214,0.12)] backdrop-blur-md transition-all duration-500 hover:border-[#ade8f4] hover:bg-white/70 hover:shadow-[0_16px_48px_rgba(91,188,214,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5bbcd6]/50"
              >
                <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a5f7a]/55 via-[#5bbcd6]/10 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 translate-x-[-130%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="font-display text-2xl font-light text-white drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-[1.65rem]">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
          className="mt-10 flex justify-center sm:mt-12"
        >
          <Link
            href="/produtos"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ade8f4] bg-white px-10 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#1a5f7a] shadow-[0_8px_28px_rgba(91,188,214,0.18)] transition-all duration-300 hover:bg-[#f7fcfd] hover:shadow-[0_12px_32px_rgba(91,188,214,0.28)] sm:px-12 sm:text-[13px]"
          >
            Ver todos os produtos
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
