import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

import { VehicleService } from "../services/vehicle-service";

export const getVehicleDetails = async (
  id: string,
): Promise<GetVehicleDetailsResponse> => {
  if (typeof window === "undefined") {
    const data = await VehicleService.getById(id);
    return { data: data!, success: !!data, ts: Date.now() };
  }

  const url = `/api/vehicles/${id}`;
  const res = await fetch(url);
  const data: GetVehicleDetailsResponse = await res.json();
  return data;
};

export interface GetVehicleDetailsResponse extends ApiResponse<Vehicle> {}
