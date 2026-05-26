"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Fuel, Transmission, Category } from "@/lib/vehicles/type";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComboboxBrands from "./ComboboxBrand";
import Image from "next/image";

export function SearchNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to build query strings
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "" || value === "all") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      }
      return current.toString();
    },
    [searchParams],
  );

  const updateFilter = (key: string, value: string) => {
    const qs = createQueryString({ [key]: value === "all" ? null : value });
    router.push(pathname + (qs ? "?" + qs : ""));
  };

  // Price slider local state
  const [priceRange, setPriceRange] = useState([0, 200000]);
  useEffect(() => {
    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");
    setPriceRange([Number(minP) || 0, Number(maxP) || 200000]);
  }, [searchParams]);

  const onPriceCommit = (vals: number[]) => {
    const qs = createQueryString({
      minPrice: vals[0] > 0 ? vals[0].toString() : null,
      maxPrice: vals[1] < 200000 ? vals[1].toString() : null,
    });
    router.push(pathname + (qs ? "?" + qs : ""));
  };

  // Year slider local state
  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState([2000, currentYear]);
  useEffect(() => {
    const minY = searchParams.get("minYear");
    const maxY = searchParams.get("maxYear");
    setYearRange([Number(minY) || 2000, Number(maxY) || currentYear]);
  }, [searchParams, currentYear]);

  const onYearCommit = (vals: number[]) => {
    const qs = createQueryString({
      minYear: vals[0] > 2000 ? vals[0].toString() : null,
      maxYear: vals[1] < currentYear ? vals[1].toString() : null,
    });
    router.push(pathname + (qs ? "?" + qs : ""));
  };

  // Count active filters
  const activeFilterCount = [
    searchParams.get("category"),
    searchParams.get("fuel"),
    searchParams.get("transmission"),
    searchParams.get("brand"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("minYear"),
    searchParams.get("maxYear"),
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Mobile filter expand
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <header className="fixed w-full top-0 z-40">
      {/* ── Row 1: Brand bar ── */}
      <div className="bg-gold/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ICG Logo" width={40} height={40} />
            <span className="hidden sm:block text-sm font-semibold text-background tracking-wide">
              International Car Group
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/search"
              className="text-background/90 hover:text-background font-medium transition-colors"
            >
              Veículos
            </Link>
            <Link
              href="/#sobre"
              className="hidden sm:inline text-background/70 hover:text-background transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/#contacto"
              className="hidden sm:inline text-background/70 hover:text-background transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/admin"
              className="hidden md:inline text-background/70 hover:text-background transition-colors text-xs uppercase tracking-wider font-medium"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Row 2: Filter bar (desktop) ── */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-3 h-14">
            {/* Brand combobox */}
            <div className="w-[180px]">
              <ComboboxBrands />
            </div>

            {/* Category */}
            <Select
              value={searchParams.get("category") || "all"}
              onValueChange={(v) => updateFilter("category", v)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {Object.values(Category).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Fuel */}
            <Select
              value={searchParams.get("fuel") || "all"}
              onValueChange={(v) => updateFilter("fuel", v)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                <SelectValue placeholder="Combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todo Combustível</SelectItem>
                  {Object.values(Fuel).map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Transmission */}
            <Select
              value={searchParams.get("transmission") || "all"}
              onValueChange={(v) => updateFilter("transmission", v)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                <SelectValue placeholder="Caixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas Caixas</SelectItem>
                  {Object.values(Transmission).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Separator */}
            <div className="h-6 w-px bg-border/60" />

            {/* Price range */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">
                Preço
              </span>
              <div className="flex-1">
                <Slider
                  min={0}
                  max={200000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={onPriceCommit}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap tabular-nums">
                ${priceRange[0].toLocaleString()} – $
                {priceRange[1].toLocaleString()}
              </span>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-border/60" />

            {/* Year range */}
            <div className="flex items-center gap-2 min-w-[160px]">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">
                Ano
              </span>
              <div className="flex-1">
                <Slider
                  min={2000}
                  max={currentYear}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                  onValueCommit={onYearCommit}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap tabular-nums">
                {yearRange[0]} – {yearRange[1]}
              </span>
            </div>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-gold gap-1 ml-auto"
              >
                <X data-icon="inline-start" />
                Limpar ({activeFilterCount})
              </Button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <div className="flex md:hidden items-center justify-between h-12">
            <div className="flex-1 mr-3">
              <ComboboxBrands />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="gap-1.5 text-xs border-border/60"
            >
              <SlidersHorizontal data-icon="inline-start" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center size-5 rounded-full bg-gold text-background text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile filters expanded */}
          {showMobileFilters && (
            <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-border pt-3 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={searchParams.get("category") || "all"}
                  onValueChange={(v) => updateFilter("category", v)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todas Categorias</SelectItem>
                      {Object.values(Category).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.get("fuel") || "all"}
                  onValueChange={(v) => updateFilter("fuel", v)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Combustível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todo Combustível</SelectItem>
                      {Object.values(Fuel).map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.get("transmission") || "all"}
                  onValueChange={(v) => updateFilter("transmission", v)}
                >
                  <SelectTrigger className="h-9 text-xs col-span-2">
                    <SelectValue placeholder="Caixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todas Caixas</SelectItem>
                      {Object.values(Transmission).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile sliders */}
              <div className="flex flex-col gap-3 px-1">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Preço (USD)
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      ${priceRange[0].toLocaleString()} – $
                      {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={200000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    onValueCommit={onPriceCommit}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Ano
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {yearRange[0]} – {yearRange[1]}
                    </span>
                  </div>
                  <Slider
                    min={2000}
                    max={currentYear}
                    step={1}
                    value={yearRange}
                    onValueChange={setYearRange}
                    onValueCommit={onYearCommit}
                  />
                </div>
              </div>

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full text-xs gap-1"
                >
                  <X data-icon="inline-start" />
                  Limpar Todos os Filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
