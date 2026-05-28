import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const createVehicle = async (
  data: Partial<Vehicle>,
): Promise<ApiResponse<Vehicle>> => {
  return apiClient<ApiResponse<Vehicle>>(`/api/vehicles`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
