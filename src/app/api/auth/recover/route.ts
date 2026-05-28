import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { checkHmac } from "@/lib/hmac";

export async function POST(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

  try {
    const adminEmail = process.env.ADMIN_EMAIL!;
    await adminAuth.generatePasswordResetLink(adminEmail);
    // O Firebase envia o email automaticamente.
    // Para personalizar o template: Firebase Console → Authentication → Templates
    return NextResponse.json({
      success: true,
      message: "Email de recuperação enviado.",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao enviar recuperação" },
      { status: 500 },
    );
  }
}
