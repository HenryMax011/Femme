"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { SfAnimatedBackground } from "@/components/home/sf-animated-background";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.58, 0.72],
    reduceMotion ? [1, 1, 1] : [1, 2.15, 2.55],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.72],
    reduceMotion ? ["0%", "0%"] : ["0%", "10%"],
  );
  const z = useTransform(scrollYProgress, [0, 0.72], [0, reduceMotion ? 0 : 220]);
  const sfOpacity = useTransform(scrollYProgress, [0.55, 0.78], [1, 0]);
  const sfBlur = useTransform(scrollYProgress, [0.5, 0.74], [0, reduceMotion ? 0 : 28]);
  const sfFilter = useTransform(sfBlur, (b) => `blur(${b}px)`);

  const flashOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.64, 0.76],
    [0, reduceMotion ? 0.2 : 0.92, 0],
  );

  const copyOpacity = useTransform(scrollYProgress, [0, 0.22, 0.36], [1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.36], [0, reduceMotion ? 0 : 32]);
  const copyBlur = useTransform(scrollYProgress, [0.2, 0.36], [0, reduceMotion ? 0 : 8]);
  const copyFilter = useTransform(copyBlur, (b) => `blur(${b}px)`);

  // Véu aqua que “abre” a próxima seção no ápice
  const veilOpacity = useTransform(scrollYProgress, [0.62, 0.88], [0, 1]);

  return (
    <section ref={ref} className="relative z-0 h-[195vh]">
      <div
        className="sticky top-0 flex h-[100svh] items-end justify-center overflow-hidden"
        style={{ perspective: "1400px" }}
      >
        <motion.div
          style={{
            y,
            scale,
            opacity: sfOpacity,
            z,
            filter: sfFilter,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 origin-[50%_48%] will-change-transform"
        >
          <SfAnimatedBackground />
        </motion.div>

        <motion.div
          style={{ opacity: sfOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5bbcd6]/55 via-[#5bbcd6]/10 to-transparent"
        />

        {/* Flash no ápice do zoom — transição cinematográfica */}
        <motion.div
          aria-hidden
          style={{ opacity: flashOpacity }}
          className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#dff6fb_45%,#8dd5ea_100%)]"
        />

        <motion.div
          aria-hidden
          style={{ opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-[#dff6fb]/0 via-[#dff6fb]/55 to-[#dff6fb]"
        />

        <motion.div
          style={{ opacity: copyOpacity, y: copyY, filter: copyFilter }}
          className="relative z-10 mx-auto mb-10 w-full max-w-2xl px-4 text-center sm:mb-12 sm:px-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.42em] text-white/90 sm:text-base sm:tracking-[0.48em]"
          >
            Selavie Femme
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="mt-3 font-display text-2xl font-light leading-snug text-white drop-shadow-sm sm:text-3xl"
          >
            Sua beleza merece o melhor cuidado.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="mx-auto mt-3 max-w-md text-xs font-light leading-relaxed text-white/75 sm:text-sm"
          >
            Skincare · Perfumes · Cremes para homens e mulheres
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/produtos"
              className="inline-flex cursor-pointer items-center justify-center border border-white/40 bg-white/15 px-7 py-2.5 text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/25"
            >
              Comprar Agora
            </Link>
            <Link
              href="/sobre"
              className="inline-flex cursor-pointer items-center justify-center border border-white/25 px-7 py-2.5 text-[10px] uppercase tracking-[0.25em] text-white/75 transition-colors duration-300 hover:border-white/45 hover:text-white"
            >
              Conheça a Marca
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
