import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true"

  // Get the path from the URL
  const path = request.nextUrl.pathname

  // If we're in maintenance mode and not already on the maintenance page
  if (isMaintenanceMode && path !== "/maintenance") {
    // Create a new URL for the maintenance page
    const maintenanceUrl = new URL("/maintenance", request.url)

    // Use redirect instead of rewrite for more reliable behavior
    return NextResponse.redirect(maintenanceUrl, { status: 307 })
  }

  // If maintenance mode is disabled but user is on maintenance page, redirect to home
  if (!isMaintenanceMode && path === "/maintenance") {
    const homeUrl = new URL("/", request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

// Configure the middleware to run on all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next (Next.js internals)
     * - public files (favicon, images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)",
  ],
}
