import type { ApiResponse } from "@/lib/response";

export interface DashboardStats {
  inStock: number;
  soldThisMonth: number;
  totalBrands: number;
  totalVehicles: number;
}

export const getStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const res = await fetch(`http://localhost:3000/api/stats`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  return res.json();
};
