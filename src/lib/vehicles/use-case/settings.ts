import type { ApiResponse } from "@/lib/response";

export interface Settings {
  whatsappNumber: string;
}

export const getSettings = async (): Promise<ApiResponse<Settings>> => {
  const res = await fetch(`http://localhost:3000/api/settings`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  return res.json();
};

export const updateSettings = async (
  data: Partial<Settings>
): Promise<ApiResponse<Settings>> => {
  const res = await fetch(`http://localhost:3000/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error("Failed to update settings");
  }

  return res.json();
};
