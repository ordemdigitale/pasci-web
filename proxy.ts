import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protection de /profil uniquement
  // (/admin est géré par ProtectedRoute dans app/admin/layout.tsx)
  if (!pathname.startsWith("/profil")) return NextResponse.next();

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profil", "/profil/:path*"],
};
