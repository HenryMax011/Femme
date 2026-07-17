"use client";

import { useRouter } from "next/navigation";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { SfAnimatedBackground } from "@/components/home/sf-animated-background";
import { ShimmerButton } from "@/components/ui/shimmer-button";

/**
 * Timing: idle → copy out → zoom 3D → dissolve transparente → crossfade
 */
const COPY_MS = 0.28;
const ZOOM_MS = 1.35;
const TOTAL_MS = 1.65;
/** Já bem transparente quando navega (letras se aproximando) */
const REDIRECT_AT_OPACITY = 0.22;

export function Hero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const letterOpacityRef = useRef(1);
  const leaveIntensityRef = useRef(0);
  const letterOpacity = useMotionValue(1);
  const leaveIntensity = useMotionValue(0);
  const navigatedRef = useRef(false);

  const scale = useMotionValue(1);
  const rotateX = useMotionValue(0);
  const bgY = useMotionValue(0);
  const blur = useMotionValue(0);
  const copyOpacity = useMotionValue(1);
  const copyY = useMotionValue(0);
  const veilOpacity = useMotionValue(0);

  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const transform = useTransform(
    [scale, rotateX, bgY],
    ([s, rx, y]) =>
      `perspective(1200px) translateY(${y as number}px) rotateX(${rx as number}deg) scale(${s as number})`,
  );

  useEffect(() => {
    router.prefetch("/colecao");
    router.prefetch("/sobre");
  }, [router]);

  const goTo = useCallback(
    (href: string) => {
      if (leaving) return;
      setLeaving(true);
      navigatedRef.current = false;
      window.dispatchEvent(new Event("selavie:hero-leave"));

      if (reduceMotion) {
        router.push(href);
        return;
      }

      // Copy some primeiro
      void animate(copyOpacity, 0, {
        duration: COPY_MS,
        ease: [0.4, 0, 0.2, 1],
      });
      void animate(copyY, 12, {
        duration: COPY_MS,
        ease: [0.4, 0, 0.2, 1],
      });

      // Zoom 3D: aproxima + leve tilt de profundidade
      void animate(scale, 1.85, {
        duration: ZOOM_MS,
        delay: COPY_MS * 0.25,
        ease: [0.16, 0.84, 0.22, 1],
      });
      void animate(rotateX, 8, {
        duration: ZOOM_MS,
        delay: COPY_MS * 0.25,
        ease: [0.22, 0.05, 0.25, 1],
      });
      void animate(bgY, -28, {
        duration: ZOOM_MS,
        delay: COPY_MS * 0.25,
        ease: [0.22, 0.05, 0.25, 1],
      });

      // Intensidade 3D no canvas (camadas / glow)
      void animate(leaveIntensity, 1, {
        duration: TOTAL_MS * 0.75,
        delay: COPY_MS * 0.15,
        ease: [0.33, 0, 0.2, 1],
        onUpdate: (v) => {
          leaveIntensityRef.current = v;
        },
      });

      // Transparência forte enquanto se aproxima (some cedo)
      void animate(letterOpacity, 0, {
        duration: TOTAL_MS * 0.85,
        delay: COPY_MS * 0.2,
        ease: [0.55, 0.05, 0.35, 1],
        onUpdate: (v) => {
          letterOpacityRef.current = v;
          if (!navigatedRef.current && v <= REDIRECT_AT_OPACITY) {
            navigatedRef.current = true;
            router.push(href);
          }
        },
      });

      void animate(veilOpacity, 0.5, {
        duration: 0.5,
        delay: TOTAL_MS * 0.5,
        ease: [0.33, 0, 0.2, 1],
      });

      void animate(blur, 5, {
        duration: 0.4,
        delay: TOTAL_MS * 0.55,
        ease: [0.4, 0, 0.2, 1],
      });
    },
    [
      leaving,
      reduceMotion,
      router,
      scale,
      rotateX,
      bgY,
      blur,
      letterOpacity,
      leaveIntensity,
      copyOpacity,
      copyY,
      veilOpacity,
    ],
  );

  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden [perspective:1200px]">
      <motion.div
        style={{
          transform,
          filter,
          transformOrigin: "50% 42%",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 will-change-transform"
      >
        <SfAnimatedBackground
          letterOpacityRef={letterOpacityRef}
          leaveIntensityRef={leaveIntensityRef}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03202f]/80 via-[#03202f]/20 to-transparent" />

      {/* 05 · Véu aqua suave (sem flash branco) */}
      <motion.div
        style={{ opacity: veilOpacity }}
        className="pointer-events-none absolute inset-0 z-[5] bg-[#d9f6fb]"
        aria-hidden
      />

      <motion.div
        style={{ opacity: copyOpacity, y: copyY }}
        className="relative z-10 mx-auto mb-8 w-full max-w-2xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center sm:mb-10 sm:px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sr-only"
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
          <ShimmerButton
            type="button"
            disabled={leaving}
            onClick={() => goTo("/colecao")}
            background="#ffffff"
            shimmerColor="#0ea5e9"
            shimmerDuration="7s"
            borderRadius="12px"
            borderWidth={1}
            className="px-10 py-3.5 shadow-[0_0_36px_rgba(77,217,255,0.28)] hover:shadow-[0_0_48px_rgba(77,217,255,0.4)] sm:px-12 sm:py-4"
          >
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#083048] sm:text-[13px]">
              Comprar Agora
            </span>
          </ShimmerButton>
          <ShimmerButton
            type="button"
            disabled={leaving}
            onClick={() => goTo("/sobre")}
            background="#0a3344"
            shimmerColor="#e8fbff"
            shimmerDuration="2.8s"
            borderRadius="12px"
            borderWidth={1}
            className="px-10 py-3.5 shadow-[0_4px_24px_rgba(20,80,110,0.25)] sm:px-12 sm:py-4"
          >
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#d9f6ff] sm:text-[13px]">
              Conheça a Marca
            </span>
          </ShimmerButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
