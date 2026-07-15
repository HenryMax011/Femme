import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink/90 border border-transparent",
  secondary:
    "bg-aqua/20 text-ink border border-pastel hover:bg-aqua/30",
  ghost: "bg-transparent text-ink hover:bg-white/50",
  outline:
    "bg-white/60 text-ink border border-[#ade8f4] hover:bg-white/80",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[11px] tracking-[0.16em] uppercase",
  md: "h-11 px-5 text-[11px] tracking-[0.18em] uppercase",
  lg: "h-12 px-7 text-xs tracking-[0.2em] uppercase",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 font-light transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua/50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
