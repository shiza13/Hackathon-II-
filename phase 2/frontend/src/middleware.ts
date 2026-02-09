// src/middleware.ts
// Middleware for the application

import { NextRequest, NextResponse } from 'next/server';

// Protect specific routes
export function middleware(request: NextRequest) {
  // Get the token from cookies or localStorage (if we were handling cookies server-side)
  // For client-side only apps, this would typically be handled by the AuthContext

  // Define protected routes
  const protectedPaths = ['/tasks', '/tasks/create', '/profile'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Check if user is trying to access protected route without authentication
  // In a real implementation, this would check cookies or headers for auth tokens
  if (isProtectedPath) {
    // For now, just allow everything through - actual auth check would happen in the AuthContext
    // The AuthContext handles the actual redirect logic
  }

  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};