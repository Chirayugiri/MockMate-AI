import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Define protected routes (like `/`, `/dashboard`, etc.)
const protectedRoutes = ["/", "/interview", "/profile"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/interview/:path*", "/profile/:path*"], // adding restriction
};
