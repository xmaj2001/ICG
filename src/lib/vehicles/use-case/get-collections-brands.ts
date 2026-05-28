import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

export const getCollectionsBrands = async (): Promise<
  ServiceCollectionFilter[]
> => {
  const result = await apiClient<ApiResponse<{ count: number; brand: string }[]>>(`/api/vehicles/brand`);

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
