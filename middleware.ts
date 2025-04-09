import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true"

  // Get the path from the URL
  const path = request.nextUrl.pathname

  // If maintenance mode is enabled and the path is not already the maintenance page
  if (isMaintenanceMode && !path.startsWith("/maintenance")) {
    // Allow static assets to be loaded
    if (path.includes("/_next") || path.includes("/favicon.ico")) {
      return NextResponse.next()
    }

    // Redirect to the maintenance page
    const url = request.nextUrl.clone()
    url.pathname = "/maintenance"
    return NextResponse.rewrite(url)
  }

  // If maintenance mode is disabled but user is on maintenance page, redirect to home
  if (!isMaintenanceMode && path === "/maintenance") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
}
