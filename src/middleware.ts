import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define which routes require authentication
const protectedRoutes = ["/profile", "/emails"];

// Define which routes are for non-authenticated users only
const authRoutes = ["/signin"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const { pathname } = request.nextUrl;
  
  // If the user is not logged in and trying to access a protected route
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Redirect to the signin page
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // If the user is logged in and trying to access an auth route (like signin)
  if (token && authRoutes.includes(pathname)) {
    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    // Match all routes except for static files, api routes, and _next
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};