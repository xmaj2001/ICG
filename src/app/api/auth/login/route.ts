import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { checkHmacWithBody } from "@/lib/hmac";

export async function POST(request: NextRequest) {
  // 1. Verificar HMAC
  console.log("ENV", process.env);

  const rawBody = await request.text();
  // const hmacError = await checkHmacWithBody(request, rawBody);
  // if (hmacError) return hmacError;

  try {
    const { email, password } = JSON.parse(rawBody);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password obrigatórios" },
        { status: 400 },
      );
    }
    console.log("email", email);
    console.log("password", password);

    // 2. Autenticar via Firebase Auth REST API (server-side)
    // O Admin SDK não tem signInWithEmailAndPassword —
    // usamos a REST API que recebe email+password e devolve o ID Token
    const firebaseRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    if (!firebaseRes.ok) {
      const err = await firebaseRes.json();
      const code = err.error?.message ?? "";
      const messages: Record<string, string> = {
        INVALID_LOGIN_CREDENTIALS: "Email ou password incorrectos.",
        TOO_MANY_ATTEMPTS_TRY_LATER:
          "Demasiadas tentativas. Aguarda alguns minutos.",
        USER_DISABLED: "Conta desactivada.",
      };
      console.log(err);
      return NextResponse.json(
        { error: messages[code] ?? "Erro ao fazer login." },
        { status: 401 },
      );
    }

    const { idToken } = await firebaseRes.json();

    // 3. Verificar o token com Firebase Admin (garante que é legítimo)
    console.log("idToken", idToken);
    await adminAuth.verifyIdToken(idToken);

    // 4. Guardar em cookie httpOnly — inacessível via JavaScript
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
