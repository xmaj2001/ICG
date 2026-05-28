import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const getVehiclesRelated = async (
  vehicleId: string,
  limit: number = 10,
): Promise<GetVehiclesResponse> => {
  return apiClient<GetVehiclesResponse>(`/api/vehicles/${vehicleId}/related?limit=${limit}`);
};

export interface GetVehiclesResponse extends ApiResponse<Vehicle[]> {}
