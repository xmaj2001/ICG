import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const getVehiclesRelated = async (
  vehicleId: string,
  limit: number = 10,
): Promise<GetVehiclesResponse> => {
  const url = `/api/vehicles/${vehicleId}/related?limit=${limit}`;
  const res = await fetch(url);
  const data: GetVehiclesResponse = await res.json();
  return data;
};

export interface GetVehiclesResponse extends ApiResponse<Vehicle[]> {}
