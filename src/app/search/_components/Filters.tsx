"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Fuel, Transmission, Category, VehicleType } from "@/lib/vehicles/type";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

/* ─── Enum-driven option lists ─── */
const FUELS = Object.values(Fuel);
const TRANSMISSIONS = Object.values(Transmission);
const CATEGORIES = Object.values(Category);
const VEHICLE_TYPES = Object.values(VehicleType);

/* ─── Component ─── */
interface FiltersProps {
  /** Brand list with counts from the API – keeps the filter dynamic */
  brands: { brand: string; count: number }[];
}

export function Filters({ brands }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const anchor = useComboboxAnchor();

  /* ─── Read current filter state from URL ─── */
  const currentSearch = searchParams.get("q") ?? "";
  const currentBrands =
    searchParams.get("brand")?.split(",").filter(Boolean) ?? [];
  const currentFuels =
    searchParams.get("fuel")?.split(",").filter(Boolean) ?? [];
  const currentTransmissions =
    searchParams.get("transmission")?.split(",").filter(Boolean) ?? [];
  const currentCategories =
    searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const currentVehicleTypes =
    searchParams.get("vehicleType")?.split(",").filter(Boolean) ?? [];
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentMinYear = searchParams.get("minYear") ?? "";
  const currentMaxYear = searchParams.get("maxYear") ?? "";

  const hasActiveFilters =
    currentSearch ||
    currentBrands.length > 0 ||
    currentFuels.length > 0 ||
    currentTransmissions.length > 0 ||
    currentCategories.length > 0 ||
    currentVehicleTypes.length > 0 ||
    currentMinPrice ||
    currentMaxPrice ||
    currentMinYear ||
    currentMaxYear;

  /* ─── URL update helper ─── */
  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Remove cursor on every filter change (resets pagination)
      params.delete("cursor");

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  /* ─── Toggle helpers for multi-select arrays ─── */
  const toggleArray = useCallback(
    (paramKey: string, currentValues: string[], value: string) => {
      const next = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      pushParams({ [paramKey]: next.length ? next.join(",") : null });
    },
    [pushParams],
  );

  /* ─── Clear all filters ─── */
  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [router, pathname]);

  return (
    <aside
      className={`w-full space-y-6 ${isPending ? "pointer-events-none opacity-60" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-border">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-full border border-border bg-transparent px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
          >
            <X className="h-3 w-3" /> Limpar
          </Button>
        )}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          key={currentSearch} // reset uncontrolled input on URL change
          defaultValue={currentSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              pushParams({ q: (e.target as HTMLInputElement).value || null });
            }
          }}
          placeholder="Buscar marca ou modelo..."
          className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-foreground/40"
        />
      </div>

      {/* ─── Tipo de Veículo ─── */}
      <FilterSection title="Tipo de Veículo">
        <div className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((t) => {
            const active = currentVehicleTypes.includes(t);
            return (
              <Button
                key={t}
                onClick={() => toggleArray("vehicleType", currentVehicleTypes, t)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/40"
                }`}
              >
                {t}
              </Button>
            );
          })}
        </div>
      </FilterSection>

      {/* ─── Combustível ─── */}
      <FilterSection title="Combustível">
        <div className="flex flex-wrap gap-2">
          {FUELS.map((f) => {
            const active = currentFuels.includes(f);
            return (
              <Button
                key={f}
                onClick={() => toggleArray("fuel", currentFuels, f)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/40"
                }`}
              >
                {f}
              </Button>
            );
          })}
        </div>
      </FilterSection>

      {/* ─── Transmissão ─── */}
      <FilterSection title="Transmissão">
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map((t) => {
            const active = currentTransmissions.includes(t);
            return (
              <Button
                key={t}
                onClick={() =>
                  toggleArray("transmission", currentTransmissions, t)
                }
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/40"
                }`}
              >
                {t}
              </Button>
            );
          })}
        </div>
      </FilterSection>

      {/* ─── Categoria ─── */}
      <FilterSection title="Categoria">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = currentCategories.includes(c);
            return (
              <Button
                key={c}
                onClick={() => toggleArray("category", currentCategories, c)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/40"
                }`}
              >
                {c}
              </Button>
            );
          })}
        </div>
      </FilterSection>

      {/* ─── Marcas ─── */}
      <FilterSection title="Marcas">
        <Combobox
          items={brands}
          // @ts-ignore
          multiple
          autoHighlight
          value={currentBrands}
          onValueChange={(val: string[]) =>
            pushParams({ brand: val.length ? val.join(",") : null })
          }
        >
          <ComboboxChips ref={anchor} className="w-full">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Selecione marcas..." />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>Nenhuma marca encontrada.</ComboboxEmpty>
            <ComboboxList>
              {(item: { count: number; brand: string }) => (
                <ComboboxItem
                  key={`${item.brand}-${item.count}`}
                  value={item.brand}
                  className="flex justify-between items-center"
                >
                  <span>{item.brand}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.count}
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </FilterSection>

      {/* ─── Faixa de Preço ─── */}
      <FilterSection title="Preço (USD)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice}
            onBlur={(e) => pushParams({ minPrice: e.target.value || null })}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                pushParams({
                  minPrice: (e.target as HTMLInputElement).value || null,
                });
            }}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onBlur={(e) => pushParams({ maxPrice: e.target.value || null })}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                pushParams({
                  maxPrice: (e.target as HTMLInputElement).value || null,
                });
            }}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
          />
        </div>
      </FilterSection>

      {/* ─── Faixa de Ano ─── */}
      <FilterSection title="Ano">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="De"
            defaultValue={currentMinYear}
            onBlur={(e) => pushParams({ minYear: e.target.value || null })}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                pushParams({
                  minYear: (e.target as HTMLInputElement).value || null,
                });
            }}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Até"
            defaultValue={currentMaxYear}
            onBlur={(e) => pushParams({ maxYear: e.target.value || null })}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                pushParams({
                  maxYear: (e.target as HTMLInputElement).value || null,
                });
            }}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
          />
        </div>
      </FilterSection>
    </aside>
  );
}

/* ─── Reusable section wrapper ─── */
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
