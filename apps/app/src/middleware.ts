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
    // If already logged in, redirect to dashboard or onboarding
    if (onboardingStatus === 'complete') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/onboarding/start', request.url));
    }
  }

  // TODO: re-enable the onboardingStatus !== 'complete' gate below once the
  // onboarding backend endpoints are wired up and reliably set this cookie.
  // With them stubbed out client-side, gating here just bounces users back
  // into onboarding on every reload.
  if (isRoot) {
    return NextResponse.redirect(new URL(onboardingStatus === 'complete' ? '/dashboard' : '/onboarding/start', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
