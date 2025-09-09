// app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  const from = url.searchParams.get("from");

  console.log("🔐 [AuthCallback] Incoming request:", {
    url: req.url,
    codePresent: !!code,
    next,
    from,
    cookies: req.cookies.getAll().map(c => c.name), // show cookie names
  });

  // If no code, bounce to login
  if (!code) {
    console.log("⚠️ [AuthCallback] No code provided, redirecting to /forms");
    url.pathname = "/forms";
    url.searchParams.set("mode", "login");
    return NextResponse.redirect(url);
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ [AuthCallback] exchangeCodeForSession error:", error);
      url.pathname = "/forms";
      url.searchParams.set("mode", "login");
      url.searchParams.delete("code");
      return NextResponse.redirect(url);
    }

    console.log("✅ [AuthCallback] Session exchange successful:", {
      user: data?.user?.id,
      expires: data?.session?.expires_at,
    });
  } catch (err) {
    console.error("💥 [AuthCallback] exchangeCodeForSession threw:", err);
    url.pathname = "/forms";
    url.searchParams.set("mode", "login");
    url.searchParams.delete("code");
    return NextResponse.redirect(url);
  }

  // Successful: go where the user intended
  const target = from === "onboarding" ? "/onboarding?from=google" : next;
  console.log("➡️ [AuthCallback] Redirecting to:", target);
  return NextResponse.redirect(new URL(target, url.origin));
}
