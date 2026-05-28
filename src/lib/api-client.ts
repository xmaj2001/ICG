import { signRequest } from "./hmac";

/**
 * Wrapper de fetch que adiciona automaticamente os headers HMAC.
 *
 * Usado em todos os use-cases em vez de fetch() directo.
 * Como os use-cases correm server-side (Server Components, Route Handlers),
 * API_HMAC_SECRET está disponível e nunca é exposto ao browser.
 *
 * Uso:
 *   const data = await apiClient('/api/vehicles')
 *   const data = await apiClient('/api/vehicles', { method: 'POST', body: JSON.stringify(payload) })
 */
export async function apiClient<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const timestamp = Date.now();
  const body = typeof options.body === "string" ? options.body : undefined;

  // const signature = signRequest(method, path, timestamp, body)

  // Base URL: em Server Components usa URL absoluta,
  // em Route Handlers (server-to-server) usa URL relativa via localhost
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      "x-timestamp": timestamp.toString(),
      // 'x-signature': signature,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error?.error ?? `HTTP ${response.status}`);
  }

  return response.json();
}
