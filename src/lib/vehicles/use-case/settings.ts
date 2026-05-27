import type { ApiResponse } from "@/lib/response";

import { SettingsService } from "../services/settings-service";

export interface Settings {
  whatsappNumber: string;
}

export const getSettings = async (): Promise<ApiResponse<Settings>> => {
  if (typeof window === "undefined") {
    const data = await SettingsService.getSettings();
    return { data, success: true, ts: Date.now() };
  }

  const res = await fetch(`/api/settings`, {
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
  const res = await fetch(`/api/settings`, {
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
