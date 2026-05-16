import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const url = req.nextUrl.clone();
    const { pathname } = url;

    // ✅ HALAMAN PUBLIK — lewati middleware (ANTI LOOP)
    const publicPaths = [
      "/login",
      "/register",
      "/unauthorized",
      "/forbidden",
      "/checkout",
      "/notifications",
      "/user/products",
      "/user/orders",
    ];

    const isPublicPath =
      pathname === "/" ||
      publicPaths.some((p) => pathname === p || pathname.startsWith(p)) ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.startsWith("/images/") ||
      pathname.startsWith("/uploads/");

    if (isPublicPath) {
      return NextResponse.next();
    }

    // 🚫 BELUM LOGIN
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url.toString());
    }

    // 🚫 ADMIN ONLY
    if (pathname.startsWith("/dashboard/admin") && token.role !== "admin") {
      url.pathname = "/forbidden";
      return NextResponse.redirect(url.toString());
    }

    // 🚫 USER ONLY
    if (pathname.startsWith("/dashboard/user") && token.role !== "user") {
      url.pathname = "/forbidden";
      return NextResponse.redirect(url.toString());
    }

    return NextResponse.next();
  } catch (error) {
    // Kalau middleware error, lewati saja
    console.log("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};