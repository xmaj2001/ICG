import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const getVehicleDetails = async (
  id: string,
): Promise<GetVehicleDetailsResponse> => {
  return apiClient<GetVehicleDetailsResponse>(`/api/vehicles/${id}`);
};

export interface GetVehicleDetailsResponse extends ApiResponse<Vehicle> {}
