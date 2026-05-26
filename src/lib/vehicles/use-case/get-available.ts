import { ApiResponse } from "@/lib/response";

export const getAvailableCount = async (): Promise<ApiResponse<number>> => {
  const res = await fetch(`http://localhost:3000/api/vehicles/available`);
  const data: ApiResponse<number> = await res.json();
  return data;
};
