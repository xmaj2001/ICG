import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

export interface DashboardStats {
  inStock: number;
  soldThisMonth: number;
  totalBrands: number;
  totalVehicles: number;
}

export const getStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiClient<ApiResponse<DashboardStats>>(`/api/stats`);
};
