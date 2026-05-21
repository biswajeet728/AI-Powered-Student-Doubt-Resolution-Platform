import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Auth routes - redirect to dashboard if already logged in
const authRoutes = ["/sign-in", "/sign-up"];

// Protected routes - require login (add more as needed)
const protectedRoutes = ["/profile"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Auth routes: redirect to dashboard if already logged in
  if (isRoute(pathname, authRoutes)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: redirect to sign-in if not logged in
  if (isRoute(pathname, protectedRoutes)) {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // Public routes: accessible to everyone
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/sign-in", "/sign-up", "/profile"],
};
