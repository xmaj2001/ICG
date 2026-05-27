import type { Metadata } from "next";

import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";
import { getBrands } from "@/lib/vehicles/use-case/get-brands";
import { SearchMain } from "./_components/main";
import { Navbar } from "@/components/Navbar";

/* ─── Dynamic SEO Metadata ─── */
interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const brand = params.brand as string | undefined;
  const fuel = params.fuel as string | undefined;
  const category = params.category as string | undefined;

  // Build a human-readable title from active filters
  const parts: string[] = [];
  if (brand) parts.push(brand.split(",").join(", "));
  if (category) parts.push(category.split(",").join(", "));
  if (fuel) parts.push(fuel.split(",").join(", "));

  const filterText = parts.length > 0 ? parts.join(" · ") + " — " : "";

  return {
    title: `${filterText}Veículos à Venda`,
    description: `Encontre ${filterText ? filterText.toLowerCase() : ""}veículos de qualidade na ICG Angola. Filtros avançados, estoque actualizado e os melhores preços.`,
    robots: { index: true, follow: true },
  };
}

/* ─── Page Component ─── */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = (await searchParams) ?? {};
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
  } = params as { [key: string]: string };

  // Fetch vehicles with server-side filters
  const vehiclesResponse = await getVehicles({
    search: searchValue,
    cursor,
    limit: 12,
    brand,
    category,
    fuel,
    transmission,
    minYear: minYear ? Number(minYear) : undefined,
    maxYear: maxYear ? Number(maxYear) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  // Fetch brand list with counts (for the filter sidebar)
  const brandsResponse = await getBrands();

  const vehicles = vehiclesResponse.success
    ? vehiclesResponse.data.vehicles
    : [];
  const nextCursor = vehiclesResponse.success
    ? (vehiclesResponse.data.nextCursor ?? null)
    : null;
  const totalCount = vehicles.length;
  const brands =
    brandsResponse.success && Array.isArray(brandsResponse.data)
      ? brandsResponse.data
      : [];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <SearchMain
          vehicles={vehicles}
          totalCount={totalCount}
          searchParams={params}
          nextCursor={nextCursor}
          brands={brands}
        />
      </main>
    </>
  );
}
