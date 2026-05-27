import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

import { VehicleService } from "../services/vehicle-service";

export const getVehiclesRelated = async (
  vehicleId: string,
  limit: number = 10,
): Promise<GetVehiclesResponse> => {
  if (typeof window === "undefined") {
    const data = await VehicleService.getRelated(vehicleId, limit);
    return { data, success: true, ts: Date.now() };
  }

  const url = `/api/vehicles/${vehicleId}/related?limit=${limit}`;
  const res = await fetch(url);
  const data: GetVehiclesResponse = await res.json();
  return data;
};

export interface GetVehiclesResponse extends ApiResponse<Vehicle[]> {}
