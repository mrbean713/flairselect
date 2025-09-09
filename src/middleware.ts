import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only gate these paths; do NOT include /auth/*
  const protectedPaths = ["/dashboard", "/onboarding"];
  const isProtected = protectedPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  if (!session && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/forms";
    // Preserve where they were going so we can send them back after login
    url.searchParams.set("mode", "login");
    url.searchParams.set(
      "next",
      req.nextUrl.pathname + (req.nextUrl.search || "")
    );
    return NextResponse.redirect(url);
  }

  return res;
}

// Run only on protected pages
export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
