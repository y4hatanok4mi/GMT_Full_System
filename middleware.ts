import { apiAuthPrefix, authRoutes } from "@/routes";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (
    nextUrl.pathname.startsWith("/api/verify-email") || 
    nextUrl.pathname.startsWith("/api/uploadthing") || 
    nextUrl.pathname.startsWith("/auth/reset-password")
  ) {
    return NextResponse.next();
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      } else if (role === "student") {
        return NextResponse.redirect(new URL("/student", nextUrl));
      }
    }

    if (nextUrl.pathname === "/") {
      return Response.redirect(new URL("/auth/signin", nextUrl));
    }
  
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};

