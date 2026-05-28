import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const updateVehicle = async (
  id: string,
  data: Partial<Vehicle>,
): Promise<ApiResponse<Vehicle>> => {
  return apiClient<ApiResponse<Vehicle>>(`/api/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
