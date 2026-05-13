import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except the login page itself)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get('admin_token')?.value;

  if (isLoginPage) {
    // Already logged in → redirect to dashboard
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // All other /admin/* routes need a valid admin JWT
  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.set({ name: 'admin_token', value: '', path: '/', maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
