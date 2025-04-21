/**
 * Middleware configuration for the Study Group Finder application.
 * Uses Clerk for authentication and applies middleware to specific routes.

 * Matcher:
 * - Skips Next.js internals and static files unless found in search params.
 * - Always applies to API routes (`/api` and `/trpc`).
 */
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
