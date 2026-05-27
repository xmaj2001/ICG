import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

interface GetVehiclesInput {
  cursor?: string;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  fuel?: string;
  transmission?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
}

import { VehicleService } from "../services/vehicle-service";

export const getVehicles = async (
  input?: GetVehiclesInput,
): Promise<GetVehiclesResponse> => {
  const { cursor, limit, search, category, brand, fuel, transmission, minYear, maxYear, minPrice, maxPrice } = input ?? {};
  
  if (typeof window === "undefined") {
    const data = await VehicleService.getVehicles(
      { search, category, brand, fuel, transmission, minYear, maxYear, minPrice, maxPrice },
      { cursorId: cursor, limitSize: limit }
    );
    return { data, success: true, ts: Date.now() };
  }

  const params = new URLSearchParams();

  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", limit.toString());
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (fuel) params.set("fuel", fuel);
  if (transmission) params.set("transmission", transmission);
  if (minYear) params.set("minYear", minYear.toString());
  if (maxYear) params.set("maxYear", maxYear.toString());
  if (minPrice) params.set("minPrice", minPrice.toString());
  if (maxPrice) params.set("maxPrice", maxPrice.toString());

  const url = `/api/vehicles/?${params.toString()}`;
  const res = await fetch(url);
  const data: GetVehiclesResponse = await res.json();
  return data;
};

export interface GetVehiclesResponse extends ApiResponse<{
  vehicles: Vehicle[];
  brand: Record<string, number>;
  availableCount: number;
  nextCursor?: string | null;
}> {}
