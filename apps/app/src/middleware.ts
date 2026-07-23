import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  const hasClearParam = request.nextUrl.searchParams.has('clear') || request.nextUrl.searchParams.has('logout');

  if (hasClearParam) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('onboarding_status');
    return response;
  }

  const token = request.cookies.get('access_token')?.value;
  const onboardingStatus = request.cookies.get('onboarding_status')?.value;

  const isPublicPage = pathname === '/login' || pathname === '/register';
  const isRoot = pathname === '/';

  // 1. Unauthenticated User
  if (!token) {
    // If trying to access protected or onboarding pages, redirect to login
    if (!isPublicPage && !isRoot) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Authenticated User
  if (isPublicPage) {
    // If already logged in, redirect straight to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isRoot) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
