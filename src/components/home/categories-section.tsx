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
    reduceMotion ? [0, 0] : [64, 0],
  );
  const stageScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [0.96, 1],
  );

  return (
    <section
      ref={ref}
      className="relative z-10 -mt-[42vh] bg-gradient-to-b from-transparent via-[#e8f7f4]/95 to-[#e8f7f4] pb-6 pt-10"
    >
      <motion.div
        style={{ opacity: stageOpacity, y: stageY, scale: stageScale }}
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
              className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#2a9bb0]"
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
              className="font-display text-4xl font-light text-ink sm:text-5xl"
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
              className="group inline-flex items-center gap-1.5 text-sm font-light text-[#2a9bb0] transition-colors hover:text-ink"
            >
              Ver todas
              <ArrowRight
                size={14}
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
                  y: reduceMotion ? 0 : 40,
                  scale: reduceMotion ? 1 : 0.94,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
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
                className="group relative block overflow-hidden rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
              >
                <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d3d4d]/70 via-[#0d3d4d]/15 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 translate-x-[-130%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />
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
      </motion.div>
    </section>
  );
}
