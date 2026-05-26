import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const getVehicleDetails = async (
  id: string,
): Promise<GetVehicleDetailsResponse> => {
  const url = `http://localhost:3000/api/vehicles/${id}`;
  const res = await fetch(url);
  const data: GetVehicleDetailsResponse = await res.json();
  return data;
};

export interface GetVehicleDetailsResponse extends ApiResponse<Vehicle> {}
