import type { ApiResponse } from "@/lib/response";

import { VehicleService } from "../services/vehicle-service";

export interface DashboardStats {
  inStock: number;
  soldThisMonth: number;
  totalBrands: number;
  totalVehicles: number;
}

export const getStats = async (): Promise<ApiResponse<DashboardStats>> => {
  if (typeof window === "undefined") {
    const data = await VehicleService.getDashboardStats();
    return { data, success: true, ts: Date.now() };
  }

  const res = await fetch(`/api/stats`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  return res.json();
};
