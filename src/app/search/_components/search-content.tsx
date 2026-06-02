import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { SearchMain } from "./main";

interface SearchContentProps {
  searchParamsPromise?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export async function SearchContent({
  searchParamsPromise,
}: SearchContentProps) {
  const searchParams = (await searchParamsPromise) ?? {};

  const {
    q: searchValue,
    cursor,
    brand,
    category,
    fuel,
    transmission,
    vehicleType,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
  } = searchParams as { [key: string]: string };

  // Fetch vehicles with server-side filters
  const data = await VehicleService.getVehicles(
    {
      search: searchValue,
      brand,
      category,
      fuel,
      transmission,
      vehicleType,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    },
    { limitSize: 12, cursorId: cursor },
  );

  // Fetch brand list with counts (for the filter sidebar)
  const brandsResponse = await VehicleService.getBrandCounts();

  const vehicles = data.vehicles;
  const nextCursor = data.nextCursor ?? null;
  const totalCount = vehicles.length;
  const brands = brandsResponse || [];

  return (
    <SearchMain
      vehicles={vehicles}
      totalCount={totalCount}
      searchParams={searchParams}
      nextCursor={nextCursor}
      brands={brands}
    />
  );
}
