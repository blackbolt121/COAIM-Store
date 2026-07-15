import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIVATE_ROUTES = ["/dashboard", "/usuarios", "/pedidos", "/cotizaciones", "/productos", "/carousel"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const isAuthed = request.cookies.get("cotizanet_admin_session")?.value === "1";
    return NextResponse.redirect(new URL(isAuthed ? "/dashboard" : "/login", request.url));
  }

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  const isAuthed = request.cookies.get("cotizanet_admin_session")?.value === "1";
  if (!isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/usuarios/:path*", "/pedidos/:path*", "/cotizaciones/:path*", "/productos/:path*", "/carousel/:path*"],
};
