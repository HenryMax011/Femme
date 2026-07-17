"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/categories";
import { brands } from "@/data/products";
import { FancySelect } from "@/components/ui/fancy-select";
import { cn } from "@/lib/utils";

const sorts = [
  { value: "bestseller", label: "Mais vendidos" },
  { value: "newest", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

const genders = [
  { value: "all", label: "Todos" },
  { value: "FEMALE", label: "Feminino" },
  { value: "MALE", label: "Masculino" },
  { value: "UNISEX", label: "Unissex" },
];

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [minPrice, setMinPrice] = useState(params.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("max") || "");
  const [query, setQuery] = useState(params.get("q") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const applyPrice = () => {
    const next = new URLSearchParams(params.toString());
    if (minPrice) next.set("min", minPrice);
    else next.delete("min");
    if (maxPrice) next.set("max", maxPrice);
    else next.delete("max");
    router.push(`/produtos?${next.toString()}`);
  };

  const applySearch = () => {
    update("q", query.trim() || undefined);
  };

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    setQuery("");
    router.push("/produtos");
  };

  const activeFilters = useMemo(() => {
    const items: { key: string; label: string; clear: () => void }[] = [];
    const category = params.get("categoria");
    const gender = params.get("genero");
    const brand = params.get("marca");
    const min = params.get("min");
    const max = params.get("max");
    const q = params.get("q");

    if (category) {
      const name =
        categories.find((item) => item.slug === category)?.name || category;
      items.push({
        key: "categoria",
        label: name,
        clear: () => update("categoria"),
      });
    }
    if (gender && gender !== "all") {
      items.push({
        key: "genero",
        label: genders.find((item) => item.value === gender)?.label || gender,
        clear: () => update("genero"),
      });
    }
    if (brand) {
      items.push({
        key: "marca",
        label: brand,
        clear: () => update("marca"),
      });
    }
    if (min || max) {
      items.push({
        key: "preco",
        label: `R$ ${min || "0"} – ${max || "∞"}`,
        clear: () => {
          setMinPrice("");
          setMaxPrice("");
          const next = new URLSearchParams(params.toString());
          next.delete("min");
          next.delete("max");
          router.push(`/produtos?${next.toString()}`);
        },
      });
    }
    if (q) {
      items.push({
        key: "q",
        label: `"${q}"`,
        clear: () => {
          setQuery("");
          update("q");
        },
      });
    }
    if (params.get("maisVendidos") === "1") {
      items.push({
        key: "maisVendidos",
        label: "Mais vendidos",
        clear: () => toggleFlag("maisVendidos"),
      });
    }
    if (params.get("novidades") === "1") {
      items.push({
        key: "novidades",
        label: "Novidades",
        clear: () => toggleFlag("novidades"),
      });
    }
    return items;
  }, [params, router]);

  const hasFilters = activeFilters.length > 0;

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const panel = (
    <FiltersPanel
      activeFilters={activeFilters}
      hasFilters={hasFilters}
      query={query}
      setQuery={setQuery}
      applySearch={applySearch}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      applyPrice={applyPrice}
      update={update}
      toggleFlag={toggleFlag}
      clearAll={clearAll}
      params={params}
    />
  );

  return (
    <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
      {/* Mobile toolbar */}
      <div className="lg:hidden">
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ade8f4] bg-white/90 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1a5f7a] shadow-[0_8px_24px_rgba(91,188,214,0.12)] backdrop-blur-md"
          >
            <SlidersHorizontal size={15} />
            Filtros
            {hasFilters ? (
              <span className="rounded-full bg-[#1a5f7a] px-2 py-0.5 text-[10px] text-white">
                {activeFilters.length}
              </span>
            ) : null}
          </button>
          <div className="min-w-0 flex-1">
            <FancySelect
              value={params.get("sort") || "bestseller"}
              options={sorts}
              onChange={(value) => update("sort", value)}
            />
          </div>
        </div>

        {hasFilters ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.clear}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#ade8f4] bg-[#eef9fc] px-3 py-1.5 text-[11px] text-[#1a5f7a]"
              >
                {filter.label}
                <X size={12} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtros"
            className="absolute inset-0 bg-[#1a5f7a]/35 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-[#f7fcfd] shadow-[0_-20px_60px_rgba(26,95,122,0.25)]">
            <div className="flex shrink-0 items-center justify-between border-b border-[#e8f4f7] bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#1a5f7a]" />
                <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a5f7a]">
                  Filtros
                </h2>
                {hasFilters ? (
                  <span className="rounded-full bg-[#1a5f7a] px-2 py-0.5 text-[10px] font-medium text-white">
                    {activeFilters.length}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#ade8f4] text-[#1a5f7a]"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {panel}
            </div>

            <div className="shrink-0 border-t border-[#e8f4f7] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-2">
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="cursor-pointer rounded-xl border border-[#ade8f4] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#3a8fa8]"
                  >
                    Limpar
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 cursor-pointer rounded-xl bg-[#1a5f7a] py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white"
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden overflow-hidden rounded-2xl border border-white/90 bg-white/80 shadow-[0_12px_40px_rgba(91,188,214,0.12)] backdrop-blur-md lg:block">
        <div className="flex items-center justify-between border-b border-[#e8f4f7] bg-[#f7fcfd] px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#1a5f7a]" />
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a5f7a]">
              Filtros
            </h2>
            {hasFilters ? (
              <span className="rounded-full bg-[#1a5f7a] px-2 py-0.5 text-[10px] font-medium text-white">
                {activeFilters.length}
              </span>
            ) : null}
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="cursor-pointer text-[11px] font-medium uppercase tracking-[0.14em] text-[#3a8fa8] transition-colors hover:text-[#1a5f7a]"
            >
              Limpar
            </button>
          ) : null}
        </div>
        <div className="p-5">{panel}</div>
      </aside>
    </div>
  );
}

function FiltersPanel({
  activeFilters,
  hasFilters,
  query,
  setQuery,
  applySearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  applyPrice,
  update,
  toggleFlag,
  clearAll,
  params,
}: {
  activeFilters: { key: string; label: string; clear: () => void }[];
  hasFilters: boolean;
  query: string;
  setQuery: (value: string) => void;
  applySearch: () => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  applyPrice: () => void;
  update: (key: string, value?: string) => void;
  toggleFlag: (key: string) => void;
  clearAll: () => void;
  params: ReturnType<typeof useSearchParams>;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {hasFilters ? (
        <div className="hidden flex-wrap gap-2 lg:flex">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.clear}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#ade8f4] bg-[#eef9fc] px-3 py-1.5 text-[11px] text-[#1a5f7a] transition-colors hover:border-[#5bbcd6]"
            >
              {filter.label}
              <X size={12} />
            </button>
          ))}
        </div>
      ) : null}

      <div>
        <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#5bbcd6]">
          Buscar
        </label>
        <div className="relative mt-3">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7aabba]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applySearch();
            }}
            placeholder="Nome do produto"
            className="w-full rounded-xl border border-[#ade8f4]/80 bg-white py-2.5 pl-9 pr-3 text-sm font-light text-[#1a5f7a] outline-none transition-colors placeholder:text-[#9bc4d2] focus:border-[#5bbcd6] focus:ring-2 focus:ring-[#5bbcd6]/15"
          />
        </div>
        <button
          type="button"
          onClick={applySearch}
          className="mt-2 w-full cursor-pointer rounded-xl bg-[#e8f7fb] py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1a5f7a] transition-colors hover:bg-[#dff6fb]"
        >
          Buscar
        </button>
      </div>

      <Section title="Ordenar" className="hidden lg:block">
        <FancySelect
          value={params.get("sort") || "bestseller"}
          options={sorts}
          onChange={(value) => update("sort", value)}
        />
      </Section>

      <Section title="Categoria">
        <FancySelect
          value={params.get("categoria") || "all"}
          options={[
            { value: "all", label: "Todas" },
            ...categories.map((category) => ({
              value: category.slug,
              label: category.name,
            })),
          ]}
          onChange={(value) => update("categoria", value)}
        />
      </Section>

      <Section title="Gênero">
        <FancySelect
          value={params.get("genero") || "all"}
          options={genders}
          onChange={(value) => update("genero", value)}
        />
      </Section>

      <Section title="Faixa de preço">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="min-w-0 rounded-xl border border-[#ade8f4]/80 bg-white px-3 py-2.5 text-sm font-light text-[#1a5f7a] outline-none transition-colors placeholder:text-[#9bc4d2] focus:border-[#5bbcd6] focus:ring-2 focus:ring-[#5bbcd6]/15"
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="min-w-0 rounded-xl border border-[#ade8f4]/80 bg-white px-3 py-2.5 text-sm font-light text-[#1a5f7a] outline-none transition-colors placeholder:text-[#9bc4d2] focus:border-[#5bbcd6] focus:ring-2 focus:ring-[#5bbcd6]/15"
          />
        </div>
        <button
          type="button"
          onClick={applyPrice}
          className="mt-2 w-full cursor-pointer rounded-xl border border-[#ade8f4] bg-white py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1a5f7a] transition-colors hover:border-[#5bbcd6] hover:bg-[#f7fcfd]"
        >
          Aplicar preço
        </button>
      </Section>

      <Section title="Marca">
        <FancySelect
          value={params.get("marca") || "all"}
          options={[
            { value: "all", label: "Todas" },
            ...brands.map((brand) => ({ value: brand, label: brand })),
          ]}
          onChange={(value) => update("marca", value)}
        />
      </Section>

      <Section title="Destaques">
        <div className="space-y-2">
          <ToggleRow
            active={params.get("maisVendidos") === "1"}
            onClick={() => toggleFlag("maisVendidos")}
            label="Mais vendidos"
          />
          <ToggleRow
            active={params.get("novidades") === "1"}
            onClick={() => toggleFlag("novidades")}
            label="Novidades"
          />
        </div>
      </Section>

      {hasFilters ? (
        <button
          type="button"
          onClick={clearAll}
          className="w-full cursor-pointer rounded-xl border border-[#ade8f4] py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#3a8fa8] lg:hidden"
        >
          Limpar filtros
        </button>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t border-[#e8f4f7] pt-5 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#5bbcd6]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ToggleRow({
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
        "flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-light transition-all duration-300",
        active
          ? "border-[#1a5f7a] bg-[#1a5f7a] text-white shadow-[0_4px_14px_rgba(26,95,122,0.22)]"
          : "border-[#ade8f4]/80 bg-white text-[#3a8fa8] hover:border-[#5bbcd6] hover:text-[#1a5f7a]",
      )}
    >
      {label}
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          active ? "bg-white/30" : "bg-[#dff1f6]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full transition-all",
            active ? "left-4 bg-white" : "left-0.5 bg-[#7aabba]",
          )}
        />
      </span>
    </button>
  );
}
