import type { ApiResponse } from "@/lib/response";

import { VehicleService } from "../services/vehicle-service";

export const getAvailableCount = async (): Promise<ApiResponse<number>> => {
  if (typeof window === "undefined") {
    const data = await VehicleService.getAvailableCount();
    return { data, success: true, ts: Date.now() };
  }

  const res = await fetch(`/api/vehicles/available`);
  const data: ApiResponse<number> = await res.json();
  return data;
};
