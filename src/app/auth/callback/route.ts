import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/onboarding', request.url));
  const supabase = createMiddlewareClient({ req: request, res: response });
  await supabase.auth.getSession(); // sets the cookie
  return response;
}
