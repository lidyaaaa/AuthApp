import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 🚫 BELUM LOGIN
  if (!token) {
     return NextResponse.redirect(
      new URL("/unauthorized", req.url)
    );
  }

  // 🚫 ADMIN ONLY
  if (
    pathname.startsWith("/dashboard/admin") &&
    token.role !== "admin"
  ) {
    return NextResponse.redirect(
      new URL("/forbidden", req.url)
    );
  }

  // 🚫 USER ONLY
  if (
    pathname.startsWith("/dashboard/user") &&
    token.role !== "user"
  ) {
    return NextResponse.redirect(
      new URL("/forbidden", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
