import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

// Define role-based route matchers
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher(.*)"]);
const isStudentRoute = createRouteMatcher(["/student(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const { userId, sessionClaims } = await auth();

  // If authenticated user hits root, redirect to dashboard
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  // Protect routes that require authentication
  if (!isPublicRoute(request) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  // Role-based route protection
  if (userId) {
    const role = sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role || "student";

    // Admin routes - only accessible by admin
    if (isAdminRoute(request) && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", url));
    }

    // Teacher routes - accessible by admin and teacher
    if (isTeacherRoute(request) && role !== "teacher" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", url));
    }

    // Student routes - only accessible by student
    if (isStudentRoute(request) && role !== "student") {
      return NextResponse.redirect(new URL("/dashboard", url));
    }
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
