import crypto from "crypto";

// Janela de tolerância: 30 segundos
const TOLERANCE_MS = 30_000;

/**
 * Gera a assinatura HMAC para uma request.
 */
export function signRequest(
  method: string,
  path: string,
  timestamp: number,
  body?: string,
): string {
  const SECRET = process.env.API_HMAC_SECRET;
  // Proteção contra SECRET indefinido
  if (!SECRET) {
    console.error(
      "ERRO CRÍTICO: A variável de ambiente API_HMAC_SECRET não está definida!",
    );
    throw new Error("INTERNAL_SERVER_ERROR");
  }

  // Normaliza o método e o path para evitar variações
  const payload = [
    method.toUpperCase(),
    path,
    timestamp.toString(),
    body ?? "",
  ].join("\n");

  console.log("payload gerado:\n", payload);

  // Agora sim, seguro e síncrono
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");

  console.log("signature gerada:", signature);
  return signature;
}

/**
 * Verifica a assinatura HMAC de uma request recebida.
 */
export function verifyRequest(
  method: string,
  path: string,
  timestamp: string | null,
  signature: string | null,
  body?: string,
): void {
  if (!timestamp || !signature) {
    throw new Error("MISSING_SIGNATURE_HEADERS");
  }

  const ts = parseInt(timestamp, 10);
  const now = Date.now();

  // Verifica janela de tempo (anti-replay)
  if (Math.abs(now - ts) > TOLERANCE_MS) {
    throw new Error("SIGNATURE_EXPIRED");
  }

  const expected = signRequest(method, path, ts, body);

  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(signature, "hex");

  if (
    expectedBuf.length !== receivedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    throw new Error("INVALID_SIGNATURE");
  }
}

/**
 * Helper para Route Handlers
 */
export async function checkHmac(request: Request): Promise<Response | null> {
  const { NextResponse } = await import("next/server");

  const method = request.method;
  const path = new URL(request.url).pathname;
  const timestamp = request.headers.get("x-timestamp");
  const signature = request.headers.get("x-signature");

  try {
    verifyRequest(method, path, timestamp, signature);
    return null; // OK
  } catch (err: any) {
    console.error("Erro na verificação HMAC:", err.message); // Adicionado para debugar no terminal!

    const messages: Record<string, string> = {
      MISSING_SIGNATURE_HEADERS: "Assinatura ausente",
      SIGNATURE_EXPIRED: "Request expirada",
      INVALID_SIGNATURE: "Assinatura inválida",
      INTERNAL_SERVER_ERROR: "Erro interno no servidor",
    };

    return NextResponse.json(
      { error: messages[err.message] ?? "Não autorizado" },
      { status: err.message === "INTERNAL_SERVER_ERROR" ? 500 : 401 },
    );
  }
}

/**
 * Versão com body para POST/PUT/DELETE.
 */
export async function checkHmacWithBody(
  request: Request,
  rawBody: string,
): Promise<Response | null> {
  const { NextResponse } = await import("next/server");

  const method = request.method;
  const path = new URL(request.url).pathname;
  const timestamp = request.headers.get("x-timestamp");
  const signature = request.headers.get("x-signature");
  try {
    verifyRequest(method, path, timestamp, signature, rawBody);
    return null;
  } catch (err: any) {
    console.error("Erro na verificação HMAC (com Body):", err.message); // Adicionado para debugar

    const messages: Record<string, string> = {
      MISSING_SIGNATURE_HEADERS: "Assinatura ausente",
      SIGNATURE_EXPIRED: "Request expirada",
      INVALID_SIGNATURE: "Assinatura inválida",
      INTERNAL_SERVER_ERROR: "Erro interno no servidor",
    };

    return NextResponse.json(
      { error: messages[err.message] ?? "Não autorizado" },
      { status: err.message === "INTERNAL_SERVER_ERROR" ? 500 : 401 },
    );
  }
}
