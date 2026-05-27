import type { ApiResponse } from "@/lib/response";

export interface CloudinaryUsage {
  used: number;
  limit: number;
  unit: string;
}

export const getCloudinaryUsage = async (): Promise<ApiResponse<CloudinaryUsage>> => {
  const res = await fetch(`/api/cloudinary/usage`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch cloudinary usage");
  }

  return res.json();
};
