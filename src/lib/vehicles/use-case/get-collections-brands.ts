import type { ApiResponse } from "@/lib/response";

import { VehicleService } from "../services/vehicle-service";

export const getCollectionsBrands = async (): Promise<
  ServiceCollectionFilter[]
> => {
  if (typeof window === "undefined") {
    const data = await VehicleService.getBrandCounts();
    return generateCollections(data ?? []);
  }

  const res = await fetch(`/api/vehicles/brand`);
  const result: ApiResponse<{ count: number; brand: string }[]> = await res.json();

  return generateCollections(result.data ?? []);
};

export type ServiceCollectionFilter = {
  title: string;
  slug: string;
  path: string;
};

function generateCollections(collections: { count: number; brand: string }[]) {
  const baseFilters: ServiceCollectionFilter[] = [
    { title: "Todos", slug: "all", path: "/search" },
  ];

  const collectionFilters: ServiceCollectionFilter[] = collections.map((c) => ({
    title: c.brand,
    slug: c.brand,
    path: `/search/${c.brand}`,
  }));

  return [...baseFilters, ...collectionFilters];
}

