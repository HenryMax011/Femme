import React, { type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Cor da luz que percorre a borda */
  shimmerColor?: string;
  /** Espessura da linha em px */
  borderWidth?: number;
  borderRadius?: string;
  shimmerDuration?: string;
  /** Cor sólida do miolo */
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      borderWidth = 1,
      shimmerDuration = "2.4s",
      borderRadius = "0px",
      background = "#000000",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--bg": background,
            "--bw": `${borderWidth}px`,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          "disabled:cursor-wait disabled:opacity-70",
          className,
        )}
        ref={ref}
        {...props}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden [border-radius:var(--radius)]"
        >
          {/* Só a luz que passa — sem borda fixa */}
          <span
            className="absolute left-1/2 top-1/2 aspect-square w-[max(200%,200%)] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 animate-border-shimmer"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, transparent 78%, var(--shimmer-color) 86%, #38bdf8 90%, var(--shimmer-color) 94%, transparent 100%)`,
            }}
          />
        </span>

        <span
          aria-hidden
          className="pointer-events-none absolute z-[1] [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--bw)]"
        />

        <span className="relative z-10">{children}</span>
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
