import { InfiniteServicesGrid } from "@/components/infinite-services-grid";

import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";

export const metadata = {
  title: "Qcena - Pesquisar",
  description: "Pesquise por serviços na Qcena.",
};

interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const {

    q: searchValue,
    cursor,
    brand,
    category,
    fuel,
    transmission,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
  } = (params ?? {}) as {
    [key: string]: string;
  };
  // Sort config (reserved for future use)
  // const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const vehiclesResponse = await getVehicles({
    search: searchValue,
    cursor,
    limit: 9,
    brand,
    category,
    fuel,
    transmission,
    minYear: minYear ? Number(minYear) : undefined,
    maxYear: maxYear ? Number(maxYear) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  if (!vehiclesResponse.success) {
    return <p className="py-3 text-lg">Nenhum serviço encontrado</p>;
  }

  const vehicles = vehiclesResponse.data.vehicles;
  const nextCursor = vehiclesResponse.data.nextCursor;
  const resultsText = vehicles.length > 1 ? "resultados" : "resultado";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {vehicles.length === 0
            ? "Não há resultados para a sua busca:"
            : `Os ${resultsText} encontrados para a sua busca foram:`}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {vehicles.length > 0 ? (
        <InfiniteServicesGrid
          initialServices={vehicles}
          initialNextCursor={nextCursor ?? null}
          searchParams={params ?? {}}
        />
      ) : null}
    </>
  );
}
