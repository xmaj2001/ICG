import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { checkHmacWithBody } from '@/lib/hmac'
import { getAuthSession } from '@/lib/auth-session'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  // const hmacError = await checkHmacWithBody(req, rawBody)
  // if (hmacError) return hmacError

  try { await getAuthSession() }
  catch { return NextResponse.json({ error: 'Não autorizado' }, { status: 401 }) }

  try {
    const { folder } = JSON.parse(rawBody);

    const timestamp = Math.round(Date.now() / 1000);
    const uploadPreset = "icg";

    const paramsToSign = [
      `folder=${folder ?? "/vehicles/imagens"}`,
      `timestamp=${timestamp}`,
      `upload_preset=${uploadPreset}`,
    ]
      .sort()
      .join("&");

    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET!)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      uploadPreset,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Erro ao gerar assinatura" },
      { status: 500 },
    );
  }
}
