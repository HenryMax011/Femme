"use client";

import { forwardRef } from "react";
import { cn, formatCpfDisplay, sanitizeCpfDigits } from "@/lib/utils";

type CpfInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (digits: string) => void;
};

export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
  ({ className, label, error, id, value = "", onChange, onBlur, name, ...props }, ref) => (
    <label className="block space-y-1.5" htmlFor={id}>
      {label ? (
        <span className="text-sm font-medium text-ink/80">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={14}
        placeholder="000.000.000-00"
        value={formatCpfDisplay(value)}
        onBlur={onBlur}
        onChange={(event) => {
          onChange?.(sanitizeCpfDigits(event.target.value));
        }}
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

CpfInput.displayName = "CpfInput";
