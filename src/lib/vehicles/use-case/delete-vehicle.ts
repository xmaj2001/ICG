import type { ApiResponse } from "@/lib/response";

export const deleteVehicle = async (
  id: string
): Promise<ApiResponse<{ id: string }>> => {
  const res = await fetch(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    throw new Error("Failed to delete vehicle");
  }

  return res.json();
};
