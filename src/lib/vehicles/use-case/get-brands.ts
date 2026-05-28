import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

export const getBrands = async (): Promise<
  ApiResponse<{ count: number; brand: string }[]>
> => {
  return apiClient<ApiResponse<{ count: number; brand: string }[]>>(`/api/vehicles/brand`);
};
