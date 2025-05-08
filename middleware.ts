import { apiAuthPrefix, authRoutes } from "@/routes";
import { auth } from "@/auth";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log("isLoggedIn:", isLoggedIn, req.auth);

  if (nextUrl.pathname.startsWith("/api/verify-email") || 
      nextUrl.pathname.startsWith("/api/uploadthing") || 
      nextUrl.pathname.startsWith("/auth/reset-password")) {
    return;
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const user = req.auth?.user;
      const role = user?.role;

      // Redirect based on user role if they are logged in
      if (role === "admin") {
        return Response.redirect(new URL("/admin", nextUrl));
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
    "/(api|trpc)(.*)", // Protect API routes and ensure proper authentication
  ],
};