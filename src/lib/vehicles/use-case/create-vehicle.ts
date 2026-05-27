import type { ApiResponse } from "@/lib/response";
import type { Vehicle } from "../type";

export const createVehicle = async (
  data: Partial<Vehicle>
): Promise<ApiResponse<Vehicle>> => {
  const res = await fetch(`http://localhost:3000/api/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error("Failed to create vehicle");
  }

  return res.json();
};
