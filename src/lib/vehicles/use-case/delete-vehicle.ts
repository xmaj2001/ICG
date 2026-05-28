import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

export const deleteVehicle = async (
  id: string,
): Promise<ApiResponse<{ id: string }>> => {
  return apiClient<ApiResponse<{ id: string }>>(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
};
