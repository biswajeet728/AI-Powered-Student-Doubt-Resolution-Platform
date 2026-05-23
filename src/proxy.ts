import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const authRoutes = new Set(["/sign-in", "/sign-up"]);
const protectedRoutes = ["/profile"];

function needsSessionCheck(pathname: string): boolean {
  if (authRoutes.has(pathname)) return true;
  return protectedRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip all non-essential routes — no DB call
  if (pathname.startsWith("/api/") || !needsSessionCheck(pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Auth routes: redirect to dashboard if already logged in
  if (authRoutes.has(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: redirect to sign-in if not logged in
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
