"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { brands } from "@/data/products";
import { cn } from "@/lib/utils";

const sorts = [
  { value: "bestseller", label: "Mais vendidos" },
  { value: "newest", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.push(`/produtos?${next.toString()}`);
  };

  const toggleFlag = (key: string) => {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === "1") next.delete(key);
    else next.set(key, "1");
    router.push(`/produtos?${next.toString()}`);
  };

  return (
    <aside className="space-y-6 border border-[#ade8f4]/60 bg-white/60 p-5 backdrop-blur-sm">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Ordenar
        </h3>
        <select
          className="mt-3 w-full cursor-pointer rounded-2xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-aqua"
          value={params.get("sort") || "bestseller"}
          onChange={(e) => update("sort", e.target.value)}
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Categoria
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip
            active={!params.get("categoria")}
            onClick={() => update("categoria")}
            label="Todas"
          />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              active={params.get("categoria") === c.slug}
              onClick={() => update("categoria", c.slug)}
              label={c.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Gênero
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { value: "all", label: "Todos" },
            { value: "FEMALE", label: "Feminino" },
            { value: "MALE", label: "Masculino" },
            { value: "UNISEX", label: "Unissex" },
          ].map((g) => (
            <FilterChip
              key={g.value}
              active={(params.get("genero") || "all") === g.value}
              onClick={() => update("genero", g.value)}
              label={g.label}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Faixa de preço
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mín"
            defaultValue={params.get("min") || ""}
            className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-aqua"
            onBlur={(e) => update("min", e.target.value || undefined)}
          />
          <input
            type="number"
            placeholder="Máx"
            defaultValue={params.get("max") || ""}
            className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-aqua"
            onBlur={(e) => update("max", e.target.value || undefined)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Marca
        </h3>
        <select
          className="mt-3 w-full cursor-pointer rounded-2xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-aqua"
          value={params.get("marca") || "all"}
          onChange={(e) => update("marca", e.target.value)}
        >
          <option value="all">Todas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleFlag("maisVendidos")}
          className={cn(
            "w-full cursor-pointer rounded-2xl border px-4 py-2.5 text-left text-sm transition-colors",
            params.get("maisVendidos") === "1"
              ? "border-aqua bg-soft text-ink"
              : "border-border hover:bg-soft",
          )}
        >
          Mais vendidos
        </button>
        <button
          type="button"
          onClick={() => toggleFlag("novidades")}
          className={cn(
            "w-full cursor-pointer rounded-2xl border px-4 py-2.5 text-left text-sm transition-colors",
            params.get("novidades") === "1"
              ? "border-aqua bg-soft text-ink"
              : "border-border hover:bg-soft",
          )}
        >
          Novidades
        </button>
      </div>
    </aside>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-aqua bg-aqua/30 text-ink"
          : "border-border text-muted hover:border-aqua hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
