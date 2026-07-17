"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
};

type Props = {
  className?: string;
  /** 0–1, vertical position of the logo (0.5 = center) */
  verticalBias?: number;
  /** Opacidade da logo (lido a cada frame; default 1) */
  letterOpacityRef?: MutableRefObject<number>;
  /** Intensidade da transição de saída (0–1), lida a cada frame */
  leaveIntensityRef?: MutableRefObject<number>;
  logoSrc?: string;
};

export function SfAnimatedBackground({
  className = "",
  verticalBias = 0.48,
  letterOpacityRef,
  leaveIntensityRef,
  logoSrc = "/images/logo-selavie-tight.png?v=1",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);
  const tRef = useRef(0);
  const edgesRef = useRef<[number, number][]>([]);
  const motesRef = useRef<Mote[]>([]);
  const dimRef = useRef({ w: 0, h: 0 });
  const logoBoxRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const opacityFallback = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    offRef.current = document.createElement("canvas");

    function getLogoRect(w: number, h: number) {
      const logo = logoRef.current;
      if (!logo || !logo.naturalWidth) {
        return { x: 0, y: 0, w: 0, h: 0 };
      }
      const aspect = logo.naturalWidth / logo.naturalHeight;
      // Header em cima; título + CTAs embaixo (não sobrepor a logo)
      const topSafe = Math.max(76, h * 0.08);
      const bottomSafe = Math.max(240, h * 0.36);
      const availableH = Math.max(140, h - topSafe - bottomSafe);
      const maxH = availableH;
      const maxW = w * 0.88;
      let drawH = maxH;
      let drawW = drawH * aspect;
      if (drawW > maxW) {
        drawW = maxW;
        drawH = drawW / aspect;
      }
      const y = topSafe + Math.max(0, (availableH - drawH) * 0.2);
      return {
        x: (w - drawW) / 2,
        y,
        w: drawW,
        h: drawH,
      };
    }

    function drawLogoTo(
      ctx: CanvasRenderingContext2D,
      box: { x: number; y: number; w: number; h: number },
      alpha = 1,
    ) {
      const logo = logoRef.current;
      if (!logo || !box.w) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(logo, box.x, box.y, box.w, box.h);
      ctx.restore();
    }

    function buildEdges(w: number, h: number) {
      const logo = logoRef.current;
      if (!logo) {
        edgesRef.current = [];
        return;
      }
      const box = getLogoRect(w, h);
      logoBoxRef.current = box;
      const off = offRef.current!;
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(logo, box.x, box.y, box.w, box.h);
      const data = ctx.getImageData(0, 0, w, h).data;
      const step = 5;
      const out: [number, number][] = [];
      for (let y = step; y < h - step; y += step) {
        for (let x = step; x < w - step; x += step) {
          const idx = (y * w + x) * 4;
          // Ignora branco quase puro do fundo da logo
          const a = data[idx + 3];
          if (a > 30) {
            const ns = [
              data[((y - step) * w + x) * 4 + 3],
              data[((y + step) * w + x) * 4 + 3],
              data[(y * w + x - step) * 4 + 3],
              data[(y * w + x + step) * 4 + 3],
            ];
            if (ns.some((n) => n < 30)) out.push([x, y]);
          }
        }
      }
      edgesRef.current = out;
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = { w: rect.width, h: rect.height };
      buildEdges(Math.floor(rect.width), Math.floor(rect.height));
      motesRef.current = [];
    }

    const logo = new Image();
    logo.decoding = "async";
    logo.src = logoSrc;
    logoRef.current = logo;

    const onLogoReady = () => {
      resize();
    };
    if (logo.complete && logo.naturalWidth) onLogoReady();
    else logo.addEventListener("load", onLogoReady);

    window.addEventListener("resize", resize);

    function spawnMote(burst = false): Mote {
      const edges = edgesRef.current;
      const [ex, ey] = edges[Math.floor(Math.random() * edges.length)] || [
        dimRef.current.w / 2,
        dimRef.current.h / 2,
      ];
      const angle = Math.random() * Math.PI * 2;
      const speed = burst
        ? Math.random() * 2.8 + 1.2
        : Math.random() * 0.25 + 0.05;
      return {
        x: ex + (Math.random() - 0.5) * 6,
        y: ey + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 0.2 : 0.08),
        life: 0,
        maxLife: burst ? Math.random() * 90 + 50 : Math.random() * 120 + 80,
        r: burst ? Math.random() * 2.4 + 0.8 : Math.random() * 1.4 + 0.4,
      };
    }

    function drawBG(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const drift = Math.sin(t * 0.005) * 0.04;
      // Deep Ocean Luxe: centro teal profundo escurecendo nas bordas
      const g = ctx.createRadialGradient(
        w * (0.5 + drift),
        h * 0.4,
        0,
        w * 0.5,
        h * 0.45,
        Math.max(w, h) * 0.95,
      );
      g.addColorStop(0, "#12526b");
      g.addColorStop(0.55, "#082e45");
      g.addColorStop(1, "#031726");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Aurora ciano no topo
      const aurora = ctx.createRadialGradient(
        w * (0.5 + drift * 2),
        h * 0.02,
        0,
        w * 0.5,
        0,
        Math.max(w, h) * 0.62,
      );
      const aPulse = 0.3 + Math.sin(t * 0.008) * 0.06;
      aurora.addColorStop(0, `rgba(77,217,255,${aPulse})`);
      aurora.addColorStop(1, "rgba(77,217,255,0)");
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, w, h);

      // Brilho lilás sutil no canto inferior esquerdo
      const warm = ctx.createRadialGradient(
        w * 0.06,
        h * 1.02,
        0,
        w * 0.06,
        h * 1.02,
        Math.max(w, h) * 0.55,
      );
      warm.addColorStop(0, "rgba(191,128,230,0.2)");
      warm.addColorStop(1, "rgba(191,128,230,0)");
      ctx.fillStyle = warm;
      ctx.fillRect(0, 0, w, h);
    }

    function drawHalo(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const pulse = 1 + Math.sin(t * 0.022) * 0.06;
      const leave = leaveIntensityRef?.current ?? 0;
      const r = Math.min(w, h) * (0.42 + leave * 0.22) * pulse;
      const cy = logoBoxRef.current.h
        ? logoBoxRef.current.y + logoBoxRef.current.h / 2
        : h * verticalBias;
      const g = ctx.createRadialGradient(w / 2, cy, 0, w / 2, cy, r);
      g.addColorStop(0, `rgba(140,242,255,${0.4 + leave * 0.28})`);
      g.addColorStop(0.45, `rgba(90,205,242,${0.14 + leave * 0.12})`);
      g.addColorStop(1, "rgba(90,205,242,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Anel de profundidade sutil quando se aproxima
      if (leave > 0.05 && logoBoxRef.current.w) {
        const box = logoBoxRef.current;
        const ringR = (Math.min(box.w, box.h) / 2) * (1.05 + leave * 0.25);
        ctx.save();
        ctx.strokeStyle = `rgba(180,240,255,${0.12 + leave * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(w / 2, cy, ringR, ringR * 0.92, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawLightSweep(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const leave = leaveIntensityRef?.current ?? 0;
      const period = leave > 0.05 ? 280 : 420;
      const pos = ((t % period) / period) * (w + w * 0.4) - w * 0.2;
      const wd = w * (0.22 + leave * 0.08);
      const peak = 0.08 + leave * 0.08;
      const g = ctx.createLinearGradient(pos - wd, 0, pos + wd, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, `rgba(210,250,255,${peak})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function drawMotes(ctx: CanvasRenderingContext2D) {
      const edges = edgesRef.current;
      if (!edges.length) return;
      const letterAlpha = letterOpacityRef?.current ?? opacityFallback.current;
      const leave = leaveIntensityRef?.current ?? 0;
      const spawnCount = leave > 0.05 ? Math.floor(5 + leave * 10) : 4;
      const cap = leave > 0.05 ? 360 : 300;
      for (let i = 0; i < spawnCount; i++) {
        if (motesRef.current.length < cap) {
          motesRef.current.push(spawnMote(leave > 0.35));
        }
      }
      motesRef.current = motesRef.current.filter((p) => p.life < p.maxLife);
      ctx.save();
      ctx.globalAlpha = Math.max(letterAlpha, leave * 0.55);
      motesRef.current.forEach((p) => {
        p.x += p.vx * (1 + leave * 0.6);
        p.y += p.vy * (1 + leave * 0.6);
        p.vy -= 0.001 + leave * 0.0015;
        p.vx *= 0.995;
        p.life++;
        const prog = p.life / p.maxLife;
        const alpha = prog < 0.15 ? (prog / 0.15) * 0.75 : (1 - prog) * 0.75;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.5, `rgba(180,245,255,${alpha * 0.5})`);
        g.addColorStop(1, "rgba(173,232,244,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (2.5 + leave * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      ctx.restore();
    }

    function drawLogo(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const box = logoBoxRef.current.w
        ? logoBoxRef.current
        : getLogoRect(w, h);
      if (!box.w) return;
      const letterAlpha = letterOpacityRef?.current ?? opacityFallback.current;
      const leave = leaveIntensityRef?.current ?? 0;
      // Mais transparente conforme se aproxima
      const glassAlpha = letterAlpha * (1 - leave * 0.55);
      const pulse = 1 + Math.sin(t * 0.018) * 0.012 + leave * 0.02;
      const cx = box.x + box.w / 2;
      const cy = box.y + box.h / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);
      ctx.translate(-cx, -cy);
      ctx.globalCompositeOperation = "screen";
      ctx.shadowColor = `rgba(80,210,255,${0.35 + leave * 0.35})`;
      ctx.shadowBlur = Math.min(w, h) * (0.05 + leave * 0.06);
      drawLogoTo(ctx, box, glassAlpha);
      ctx.restore();

      // Specular highlight no topo (vidro 3D)
      if (glassAlpha > 0.05) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = glassAlpha * (0.18 + leave * 0.2);
        const hl = ctx.createLinearGradient(
          box.x,
          box.y,
          box.x + box.w * 0.35,
          box.y + box.h * 0.55,
        );
        hl.addColorStop(0, "rgba(255,255,255,0.55)");
        hl.addColorStop(0.45, "rgba(180,240,255,0.12)");
        hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl;
        ctx.beginPath();
        ctx.ellipse(
          cx - box.w * 0.08,
          cy - box.h * 0.12,
          box.w * 0.38,
          box.h * 0.28,
          -0.35,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      }
    }

    function paintFrame(animate: boolean) {
      const target = canvasRef.current;
      if (!target) return;
      const ctx = target.getContext("2d");
      if (!ctx) return;
      const { w, h } = dimRef.current;
      if (!w || !h) return;
      const t = animate ? tRef.current++ : 0;
      drawBG(ctx, w, h, t);
      drawHalo(ctx, w, h, t);
      drawLightSweep(ctx, w, h, t);
      if (animate) drawMotes(ctx);
      drawLogo(ctx, w, h, t);
    }

    if (reduceMotion) {
      const wait = () => {
        if (logoRef.current?.naturalWidth) paintFrame(false);
        else requestAnimationFrame(wait);
      };
      wait();
      return () => {
        window.removeEventListener("resize", resize);
        logo.removeEventListener("load", onLogoReady);
      };
    }

    function tick() {
      paintFrame(true);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      logo.removeEventListener("load", onLogoReady);
    };
  }, [verticalBias, logoSrc]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 block size-full ${className}`}
      aria-hidden
    />
  );
}
