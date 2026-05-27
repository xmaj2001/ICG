import type { ApiResponse } from "@/lib/response";

import { VehicleService } from "../services/vehicle-service";

export const getBrands = async (): Promise<
  ApiResponse<{ count: number; brand: string }[]>
> => {
  if (typeof window === "undefined") {
    const data = await VehicleService.getBrandCounts();
    return { data, success: true, ts: Date.now() };
  }

  const res = await fetch(`/api/vehicles/brand`);
  const data: ApiResponse<{ count: number; brand: string }[]> = await res.json();
  return data;
};

