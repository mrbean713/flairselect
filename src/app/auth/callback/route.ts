// app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const from = requestUrl.searchParams.get("from");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect accordingly
  const redirectPath = from === "onboarding" ? "/onboarding" : "/dashboard";
  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
