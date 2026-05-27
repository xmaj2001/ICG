"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { VehicleCard } from "./vehicles/VehicleCard";
import type { Vehicle } from "@/lib/vehicles/type";
import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";
import { VehicleListRow } from "./vehicles/VehicleListRow";

interface InfiniteServicesGridProps {
  initialServices: Vehicle[];
  initialNextCursor: string | null;
  brand?: string;
  searchParams: Record<string, string | string[] | undefined>;
  view: "grid" | "list";
}

export function InfiniteServicesGrid({
  initialServices,
  initialNextCursor,
  brand,
  view,
  searchParams,
}: InfiniteServicesGridProps) {
  const [items, setItems] = useState<Vehicle[]>(initialServices);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Se os serviços iniciais mudarem (por causa de alteração de busca, ordenação ou categoria no server),
  // reinicia o estado local do cliente.
  useEffect(() => {
    setItems(initialServices);
    setNextCursor(initialNextCursor);
  }, [initialServices, initialNextCursor]);

  const loadMore = async () => {
    if (!nextCursor || loading) return;

    setLoading(true);
    try {
      // Extrair parâmetros atuais de busca, ordenação e filtros
      const searchValue = searchParams?.q as string | undefined;
      const category = searchParams?.category as string | undefined;
      const fuel = searchParams?.fuel as string | undefined;
      const transmission = searchParams?.transmission as string | undefined;
      const minYear = searchParams?.minYear
        ? Number(searchParams.minYear)
        : undefined;
      const maxYear = searchParams?.maxYear
        ? Number(searchParams.maxYear)
        : undefined;
      const minPrice = searchParams?.minPrice
        ? Number(searchParams.minPrice)
        : undefined;
      const maxPrice = searchParams?.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined;
      const brandParam = searchParams?.brand as string | undefined;

      // Chama a função utilitária getVehicles que bate no BFF
      const response = await getVehicles({
        cursor: nextCursor,
        limit: 9,
        brand: brandParam || brand,
        search: searchValue,
        category,
        fuel,
        transmission,
        minYear,
        maxYear,
        minPrice,
        maxPrice,
      });

      if (response.success && response.data) {
        setItems((prev) => [...prev, ...response.data.vehicles]);
        setNextCursor(response.data.nextCursor ?? null);
      }
    } catch (error) {
      console.error("Erro ao carregar mais serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  // Configura o IntersectionObserver para detetar quando o utilizador faz scroll até ao fundo
  useEffect(() => {
    const currentObserver = observerRef.current;
    if (!nextCursor || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [nextCursor, loading, loadMore]);

  return (
    <div className="flex flex-col gap-6 mt-10">
      {view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((v) => (
            <VehicleListRow key={v.id} vehicle={v} />
          ))}
        </div>
      )}

      {/* Trigger de carregamento ou feedback visual */}
      {nextCursor && (
        <div
          ref={observerRef}
          className="flex w-full items-center justify-center py-10"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">
                A carregar mais serviços...
              </span>
            </div>
          ) : (
            <div className="h-1 w-full" />
          )}
        </div>
      )}

      {!nextCursor && items.length > 0 && (
        <div className="flex w-full items-center justify-center py-8 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
            Chegou ao fim dos resultados.
          </span>
        </div>
      )}
    </div>
  );
}
