import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/response";

/**
 * Extrai o public_id de um URL do Cloudinary.
 * Exemplo: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
 * Retorna: folder/filename
 */
export const getPublicIdFromCloudinaryUrl = (url: string): string | null => {
  try {
    const afterUpload = url.split("/upload/")[1];
    if (!afterUpload) return null;

    const pathParts = afterUpload.split("/");
    // Se a primeira parte começar por "v" seguido de números, é a versão (ex: v1717326880) e removemos
    if (
      pathParts[0].startsWith("v") &&
      !Number.isNaN(Number(pathParts[0].substring(1)))
    ) {
      pathParts.shift();
    }

    const publicIdWithExt = pathParts.join("/");
    const dotIndex = publicIdWithExt.lastIndexOf(".");

    // Remove a extensão (ex: .jpg, .png)
    return dotIndex !== -1
      ? publicIdWithExt.substring(0, dotIndex)
      : publicIdWithExt;
  } catch (e) {
    return null;
  }
};

export const deleteCloudinaryImages = async (
  urls: string[],
): Promise<ApiResponse<any>> => {
  if (!urls || urls.length === 0) {
    return { success: true, data: [] } as any;
  }

  const publicIds = urls
    .map(getPublicIdFromCloudinaryUrl)
    .filter(Boolean) as string[];

  if (publicIds.length === 0) {
    return { success: true, data: [] } as any;
  }

  return apiClient<ApiResponse<any>>("/api/cloudinary/delete", {
    method: "POST",
    body: JSON.stringify({ publicIds }),
  });
};
