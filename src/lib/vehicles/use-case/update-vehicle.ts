import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const updateVehicle = async (
  id: string,
  data: Partial<Vehicle>,
): Promise<ApiResponse<Vehicle>> => {
  const res = await fetch(`/api/vehicles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update vehicle");
  }

  return res.json();
};
