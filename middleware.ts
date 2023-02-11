import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  // Allow the request if the following is true...
  // 1) Its a request for next-auth session & provider fetching
  // 2) The token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }
  // Redirect user to login if they don't have a token AND are requesting a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

// Watch for requests to access these url's, for multiples matcher will be an array of routes
export const config = {
  matcher: ["/", "/artist"],
};
