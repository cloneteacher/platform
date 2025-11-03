import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const authState = await auth();

  // If authenticated user hits root, redirect to dashboard
  if (authState.userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  // Protect routes that require authentication
  if (!isPublicRoute(request) && !authState.userId) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
