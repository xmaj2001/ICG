"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Fuel, Transmission, Category, Status } from "@/lib/vehicles/type";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state handlers
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const toggleArrayParam = (paramName: string, value: string) => {
    const current =
      searchParams.get(paramName)?.split(",").filter(Boolean) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    router.push(
      pathname + "?" + createQueryString(paramName, updated.join(",")),
    );
  };

  const isChecked = (paramName: string, value: string) => {
    return (searchParams.get(paramName)?.split(",") || []).includes(value);
  };

  // Local state for sliders so they don't stutter while dragging
  const [priceRange, setPriceRange] = useState([0, 200000000]); // AOA limits
  const [yearRange, setYearRange] = useState([2000, new Date().getFullYear()]);

  useEffect(() => {
    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");
    if (minP || maxP)
      setPriceRange([Number(minP) || 0, Number(maxP) || 200000000]);

    const minY = searchParams.get("minYear");
    const maxY = searchParams.get("maxYear");
    if (minY || maxY)
      setYearRange([
        Number(minY) || 2000,
        Number(maxY) || new Date().getFullYear(),
      ]);
  }, [searchParams]);

  const onPriceChangeCommited = (vals: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", vals[0].toString());
    params.set("maxPrice", vals[1].toString());
    router.push(pathname + "?" + params.toString());
  };

  const onYearChangeCommited = (vals: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minYear", vals[0].toString());
    params.set("maxYear", vals[1].toString());
    router.push(pathname + "?" + params.toString());
  };

  return (
    <div className="flex flex-col gap-6">
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <Accordion
          type="multiple"
          defaultValue={["status", "category", "fuel", "transmission", "price", "year"]}
          className="w-full"
        >
          {/* Status */}
          <AccordionItem value="status">
            <AccordionTrigger className="text-base font-semibold">
              Estado
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pt-2">
                {Object.values(Status).map((s) => (
                  <label
                    key={s}
                    htmlFor={`status-${s}`}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      id={`status-${s}`}
                      checked={isChecked("status", s)}
                      onCheckedChange={() => toggleArrayParam("status", s)}
                      className="border-neutral-400 group-hover:border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="text-sm font-medium">{s}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Categoria */}
          <AccordionItem value="category">
            <AccordionTrigger className="text-base font-semibold">
              Categoria
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pt-2">
                {Object.values(Category).map((cat) => (
                  <label
                    key={cat}
                    htmlFor={`category-${cat}`}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      id={`category-${cat}`}
                      checked={isChecked("category", cat)}
                      onCheckedChange={() => toggleArrayParam("category", cat)}
                      className="border-neutral-400 group-hover:border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="text-sm font-medium">{cat}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Combustível */}
          <AccordionItem value="fuel">
            <AccordionTrigger className="text-base font-semibold">
              Combustível
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pt-2">
                {Object.values(Fuel).map((f) => (
                  <label
                    key={f}
                    htmlFor={`fuel-${f}`}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      id={`fuel-${f}`}
                      checked={isChecked("fuel", f)}
                      onCheckedChange={() => toggleArrayParam("fuel", f)}
                      className="border-neutral-400 group-hover:border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="text-sm font-medium">{f}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Transmissão */}
          <AccordionItem value="transmission">
            <AccordionTrigger className="text-base font-semibold">
              Caixa
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pt-2">
                {Object.values(Transmission).map((t) => (
                  <label
                    key={t}
                    htmlFor={`transmission-${t}`}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      id={`transmission-${t}`}
                      checked={isChecked("transmission", t)}
                      onCheckedChange={() =>
                        toggleArrayParam("transmission", t)
                      }
                      className="border-neutral-400 group-hover:border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="text-sm font-medium">{t}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Preço */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-semibold">
              Preço (AOA)
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2 px-1">
                <Slider
                  min={0}
                  max={200000000}
                  step={1000000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={onPriceChangeCommited}
                  className="mb-6"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                  <span>{priceRange[0].toLocaleString()}</span>
                  <span>{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ano */}
          <AccordionItem value="year">
            <AccordionTrigger className="text-base font-semibold">
              Ano
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2 px-1">
                <Slider
                  min={2000}
                  max={new Date().getFullYear()}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                  onValueCommit={onYearChangeCommited}
                  className="mb-6"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
