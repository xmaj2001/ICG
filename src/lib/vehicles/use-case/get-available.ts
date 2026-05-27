import type { ApiResponse } from "@/lib/response";

export const getAvailableCount = async (): Promise<ApiResponse<number>> => {
  const res = await fetch(`/api/vehicles/available`);
  const data: ApiResponse<number> = await res.json();
  return data;
};
