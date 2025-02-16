import { apiAuthPrefix, authRoutes } from "@/routes";
import { auth } from "@/auth"

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (nextUrl.pathname.startsWith("/api/verify-email")) {
    return;
  }

  if (nextUrl.pathname.startsWith("/api/uploadthing")) {
    return;
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;

      if (role === "admin") {
        return Response.redirect(new URL("/admin", nextUrl));
      } else if (role === "teacher") {
        return Response.redirect(new URL("/teacher", nextUrl));
      } else if (role === "student") {
        return Response.redirect(new URL("/student", nextUrl));
      }
    }
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth/signin", nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
