import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge Runtime — não suporta Firebase Admin SDK nem crypto Node.js.
 * Faz apenas verificação superficial (cookie presente?).
 * A verificação real do token acontece no admin/layout.tsx.
 */

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const isTokenExpired = searchParams.get("expired") === "true";

  // Se o Layout nos mandou para aqui porque o token expirou, limpamos o cookie no cliente imediatamente
  if (pathname === "/login" && isTokenExpired) {
    const response = NextResponse.next();
    response.cookies.delete("auth-token"); // Remove o cookie inválido no browser
    return response;
  }

  // Protege /admin e /dashboard
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Se já tem um token (e não veio de um fluxo de expiração), não deixa ir ao login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
