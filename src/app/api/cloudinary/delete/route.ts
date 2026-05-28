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
    const { publicIds } = JSON.parse(rawBody);

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing publicIds" },
        { status: 400 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing Cloudinary credentials");
    }

    const timestamp = Math.round(Date.now() / 1000);

    const results = await Promise.all(
      publicIds.map(async (publicId) => {
        const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
        const signature = crypto
          .createHash("sha256")
          .update(paramsToSign + apiSecret)
          .digest("hex");

        const formData = new FormData();
        formData.append("public_id", publicId);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            body: formData,
          },
        );

        return response.json();
      }),
    );

    return NextResponse.json({
      success: true,
      data: results,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete images" },
      { status: 500 },
    );
  }
}
