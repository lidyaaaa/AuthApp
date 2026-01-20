import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = req.nextUrl.clone();
  const { pathname } = url;

  // ✅ IZINKAN halaman ini lewat (ANTI LOOP)
  if (
    pathname === "/unauthorized" ||
    pathname === "/forbidden"
  ) {
    return NextResponse.next();
  }

  // 🚫 BELUM LOGIN
  if (!token) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // 🚫 ADMIN ONLY
  if (
    pathname.startsWith("/dashboard/admin") &&
    token.role !== "admin"
  ) {
    url.pathname = "/forbidden";
    return NextResponse.redirect(url);
  }

  // 🚫 USER ONLY
  if (
    pathname.startsWith("/dashboard/user") &&
    token.role !== "user"
  ) {
    url.pathname = "/forbidden";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
