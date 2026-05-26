import type { ApiResponse } from "@/lib/response";

export const getBrands = async (): Promise<
  ApiResponse<{ count: number; brand: string }[]>
> => {
  const res = await fetch(`http://localhost:3000/api/vehicles/brand`);
  const data: ApiResponse<{ count: number; brand: string }[]> = await res.json();
  return data;
};

