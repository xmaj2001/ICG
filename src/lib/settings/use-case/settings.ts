import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

export interface Settings {
  whatsappNumber: string;
  email: string;
  address: string;
}

export const getSettings = async (): Promise<ApiResponse<Settings>> => {
  return apiClient<ApiResponse<Settings>>(`/api/settings`);
};

export const updateSettings = async (
  data: Partial<Settings>,
): Promise<ApiResponse<Settings>> => {
  return apiClient<ApiResponse<Settings>>(`/api/settings`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
