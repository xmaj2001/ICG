import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

export const getAvailableCount = async (): Promise<ApiResponse<number>> => {
  return apiClient<ApiResponse<number>>(`/api/vehicles/available`);
};
