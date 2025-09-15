// app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  const from = url.searchParams.get("from");

  console.log("AuthCallback incoming request:", {
    url: req.url,
    codePresent: !!code,
    next,
    from,
  });

  if (!code) {
    url.pathname = "/forms";
    url.searchParams.set("mode", "login");
    return NextResponse.redirect(url);
  }

  // ✅ Grab cookie store once, reuse it
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("exchangeCodeForSession error:", error.message);
      url.pathname = "/forms";
      url.searchParams.set("mode", "login");
      url.searchParams.delete("code");
      return NextResponse.redirect(url);
    }

    console.log("Session exchange successful:", {
      user: data?.user?.id,
      expires: data?.session?.expires_at,
    });
  } catch (err) {
    console.error("Exception in exchangeCodeForSession:", err);
    url.pathname = "/forms";
    url.searchParams.set("mode", "login");
    url.searchParams.delete("code");
    return NextResponse.redirect(url);
  }

  const target = from === "onboarding" ? "/onboarding?from=google" : next;
  return NextResponse.redirect(new URL(target, url.origin));
}
