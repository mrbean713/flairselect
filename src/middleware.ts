import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log("🛡️ Running middleware");

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/forms';
    redirectUrl.searchParams.set('mode', 'login');
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// ✅ Only run middleware on dashboard routes
export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
