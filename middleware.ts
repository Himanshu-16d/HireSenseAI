import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log("Middleware executing for path:", req.nextUrl.pathname)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("Authorization check:", { token, path: req.nextUrl.pathname })
        // Allow access to all routes for now
        return true
      }
    },
  }
)

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
    // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [    "/resume-builder/:path*",
    "/job-finder/:path*",
    "/settings/:path*",
    "/api/protected/:path*",
    "/api/:path*"
  ]
}
