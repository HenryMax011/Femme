"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type FancySelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function FancySelect({
  value,
  options,
  onChange,
  placeholder = "Selecione",
  className,
}: FancySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm font-light text-[#1a5f7a] outline-none transition-all",
          open
            ? "border-[#5bbcd6] shadow-[0_0_0_3px_rgba(91,188,214,0.18)]"
            : "border-[#ade8f4]/80 hover:border-[#5bbcd6]",
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-[#5bbcd6] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-[#ade8f4] bg-white p-1.5 shadow-[0_16px_40px_rgba(26,95,122,0.16)]"
        >
          <div className="max-h-56 overflow-auto">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "bg-[#1a5f7a] text-white"
                      : "text-[#1a5f7a] hover:bg-[#eef9fc]",
                  )}
                >
                  <span className="font-light">{option.label}</span>
                  {active ? <Check size={14} className="shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
