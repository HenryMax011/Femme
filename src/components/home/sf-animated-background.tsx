"use client";

import { useEffect, useRef } from "react";

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
  monogram?: string;
  className?: string;
  /** 0–1, vertical position of the monogram (0.5 = center) */
  verticalBias?: number;
};

export function SfAnimatedBackground({
  monogram = "SF",
  className = "",
  verticalBias = 0.48,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const tRef = useRef(0);
  const edgesRef = useRef<[number, number][]>([]);
  const motesRef = useRef<Mote[]>([]);
  const fsRef = useRef(0);
  const dimRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    offRef.current = document.createElement("canvas");

    function measureFont(w: number, h: number) {
      const off = offRef.current!;
      const ctx = off.getContext("2d")!;
      // Escala do template AnimatedBackgroundWithSF
      let size = h * 0.78;
      ctx.font = `300 ${size}px 'Cormorant Garamond', Georgia, serif`;
      const tw = ctx.measureText(monogram).width;
      if (tw > w * 0.92) size = (size * (w * 0.92)) / tw;
      return size;
    }

    function buildEdges(w: number, h: number, fs: number) {
      const off = offRef.current!;
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `300 ${fs}px 'Cormorant Garamond', Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      const cy = h * verticalBias;
      ctx.fillText(monogram, w / 2, cy);
      const data = ctx.getImageData(0, 0, w, h).data;
      const step = 4;
      const out: [number, number][] = [];
      for (let y = step; y < h - step; y += step) {
        for (let x = step; x < w - step; x += step) {
          const idx = (y * w + x) * 4;
          if (data[idx + 3] > 20) {
            const ns = [
              data[((y - step) * w + x) * 4 + 3],
              data[((y + step) * w + x) * 4 + 3],
              data[(y * w + x - step) * 4 + 3],
              data[(y * w + x + step) * 4 + 3],
            ];
            if (ns.some((n) => n < 20)) out.push([x, y]);
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
      const fs = measureFont(rect.width, rect.height);
      fsRef.current = fs;
      dimRef.current = { w: rect.width, h: rect.height };
      buildEdges(Math.floor(rect.width), Math.floor(rect.height), fs);
      motesRef.current = [];
    }

    resize();
    window.addEventListener("resize", resize);

    function spawnMote(): Mote {
      const edges = edgesRef.current;
      const [ex, ey] = edges[Math.floor(Math.random() * edges.length)] || [
        dimRef.current.w / 2,
        dimRef.current.h / 2,
      ];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.25 + 0.05;
      return {
        x: ex + (Math.random() - 0.5) * 6,
        y: ey + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.08,
        life: 0,
        maxLife: Math.random() * 120 + 80,
        r: Math.random() * 1.4 + 0.4,
      };
    }

    function drawBG(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const drift = Math.sin(t * 0.005) * 0.04;
      const g = ctx.createRadialGradient(
        w * (0.5 + drift),
        h * 0.48,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.9,
      );
      g.addColorStop(0, "#dff6fb");
      g.addColorStop(0.3, "#b8e8f5");
      g.addColorStop(0.6, "#8dd5ea");
      g.addColorStop(1, "#5bbcd6");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function drawHalo(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const pulse = 1 + Math.sin(t * 0.022) * 0.06;
      const r = Math.min(w, h) * 0.46 * pulse;
      const cy = h * verticalBias;
      const g = ctx.createRadialGradient(w / 2, cy, 0, w / 2, cy, r);
      g.addColorStop(0, "rgba(255,255,255,0.18)");
      g.addColorStop(0.45, "rgba(200,240,252,0.08)");
      g.addColorStop(1, "rgba(180,230,248,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function drawLightSweep(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const period = 420;
      const pos = ((t % period) / period) * (w + w * 0.4) - w * 0.2;
      const wd = w * 0.22;
      const g = ctx.createLinearGradient(pos - wd, 0, pos + wd, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,255,255,0.08)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function drawMotes(ctx: CanvasRenderingContext2D) {
      const edges = edgesRef.current;
      if (!edges.length) return;
      for (let i = 0; i < 4; i++) {
        if (motesRef.current.length < 300) motesRef.current.push(spawnMote());
      }
      motesRef.current = motesRef.current.filter((p) => p.life < p.maxLife);
      motesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.001;
        p.vx *= 0.995;
        p.life++;
        const prog = p.life / p.maxLife;
        const alpha = prog < 0.15 ? (prog / 0.15) * 0.7 : (1 - prog) * 0.7;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.5, `rgba(202,240,248,${alpha * 0.5})`);
        g.addColorStop(1, "rgba(173,232,244,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
    }

    function drawSF(
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) {
      const fs = fsRef.current;
      if (!fs) return;
      const cx = w / 2;
      const cy = h * verticalBias;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `300 ${fs}px 'Cormorant Garamond', Georgia, serif`;
      const sh = Math.sin(t * 0.014) * 0.07;
      const fill = ctx.createLinearGradient(
        cx - fs * 0.5,
        cy - fs * 0.48,
        cx + fs * 0.5,
        cy + fs * 0.48,
      );
      fill.addColorStop(0, "#ffffff");
      fill.addColorStop(0.18 + sh, "#f0fafd");
      fill.addColorStop(0.5, "#caf0f8");
      fill.addColorStop(0.78, "#90d5ea");
      fill.addColorStop(1, "#5bbcd6");
      ctx.fillStyle = fill;
      ctx.shadowColor = "rgba(30,110,150,0.15)";
      ctx.shadowBlur = fs * 0.035;
      ctx.shadowOffsetY = fs * 0.007;
      ctx.fillText(monogram, cx, cy);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      const sp = cx - fs * 0.65 + ((t * 0.85) % (fs * 1.45));
      const sheen = ctx.createLinearGradient(sp - fs * 0.1, 0, sp + fs * 0.1, 0);
      sheen.addColorStop(0, "rgba(255,255,255,0)");
      sheen.addColorStop(0.5, "rgba(255,255,255,0.16)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = sheen;
      ctx.fillText(monogram, cx, cy);
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = fs * 0.0025;
      ctx.strokeText(monogram, cx, cy);
      ctx.restore();
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
      drawSF(ctx, w, h, t);
    }

    if (reduceMotion) {
      paintFrame(false);
      return () => window.removeEventListener("resize", resize);
    }

    function tick() {
      paintFrame(true);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [monogram, verticalBias]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 block size-full ${className}`}
      aria-hidden
    />
  );
}
