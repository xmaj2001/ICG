import { NextRequest, NextResponse } from "next/server";
import { checkHmac } from "@/lib/hmac";

export async function POST(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
