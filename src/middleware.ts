import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Exclude the login page itself
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for the admin token
    // Using admin_refresh_token or a separate admin access token if stored in cookies
    const adminToken = request.cookies.get('admin_refresh_token');

    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
