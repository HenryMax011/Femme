"use client";

import { forwardRef } from "react";
import { cn, sanitizePhoneDigits } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (digits: string) => void;
};

/** Remove +55 / 55 do início quando o autofill traz o código do país. */
export function normalizeBrazilPhoneDigits(raw: string) {
  let digits = sanitizePhoneDigits(raw, 13);

  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }

  return sanitizePhoneDigits(digits, 11);
}

/** Exibe (11) 99999-9999 ou (11) 9999-9999. */
export function formatBrazilPhoneDisplay(digits: string) {
  const value = sanitizePhoneDigits(digits, 11);
  if (!value) return "";

  if (value.length <= 2) return `(${value}`;
  if (value.length <= 6) {
    return `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }
  if (value.length <= 10) {
    return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  }
  return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, id, value = "", onChange, onBlur, name, ...props }, ref) => (
    <label className="block space-y-1.5" htmlFor={id}>
      {label ? (
        <span className="text-sm font-medium text-ink/80">{label}</span>
      ) : null}
      <div
        className={cn(
          "flex overflow-hidden rounded-xl border border-[#ade8f4]/80 bg-white/60 transition-all duration-200 focus-within:border-aqua focus-within:ring-2 focus-within:ring-aqua/20",
          error && "border-red-400 focus-within:border-red-400 focus-within:ring-red-200",
        )}
      >
        <span className="flex shrink-0 items-center border-r border-[#ade8f4]/80 bg-[#eef9fc] px-3 text-sm font-medium text-[#1a5f7a]">
          +55
        </span>
        <input
          ref={ref}
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={15}
          placeholder="(11) 99999-9999"
          value={formatBrazilPhoneDisplay(value)}
          onBlur={onBlur}
          onChange={(event) => {
            onChange?.(normalizeBrazilPhoneDigits(event.target.value));
          }}
          className={cn(
            "w-full bg-transparent px-4 py-3 text-sm font-light text-ink outline-none placeholder:text-muted/70",
            className,
          )}
          {...props}
        />
      </div>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  ),
);

PhoneInput.displayName = "PhoneInput";
