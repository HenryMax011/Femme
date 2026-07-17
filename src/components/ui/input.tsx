import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, error, id, ...props }, ref) => (
    <label className="block space-y-1.5" htmlFor={id}>
      {label ? (
        <span className="text-sm font-medium text-ink/80">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-xl border border-[#ade8f4]/80 bg-white/60 px-4 py-3 text-sm font-light text-ink outline-none transition-all duration-200 placeholder:text-muted/70 focus:border-aqua focus:ring-2 focus:ring-aqua/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-200",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  ),
);

Input.displayName = "Input";
