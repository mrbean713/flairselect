import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();

  const url = new URL("/", new URL(req.url).origin);
  return NextResponse.redirect(url, { status: 302 });
}
