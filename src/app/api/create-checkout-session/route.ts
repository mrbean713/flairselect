// app/api/create-checkout-session/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

export const runtime = "nodejs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

try {
  new URL(SITE_URL);
} catch {
  throw new Error(
    `Invalid NEXT_PUBLIC_SITE_URL/VERCEL_URL. Got "${SITE_URL}". It must include scheme, e.g. https://yourdomain.com`
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // ✅ Hydrate Supabase from cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Auth session missing!" }, { status: 401 });
    }

    const { form, tier } = await req.json();

    // Metadata: safe, small, string-only
    const metadata: Record<string, string> = {
      user_id: user.id,
      email: user.email ?? "",
      tier: String(tier ?? ""),
      campaignName: String(form?.campaignName ?? ""),
      niche: String(form?.niche ?? ""),
      platform: String(form?.platform ?? ""),
      briefPath: String(form?.briefPath ?? ""),
    };

    const successTo = (path: string) => `${SITE_URL}${path}`;
    const cancelTo = (path: string) => `${SITE_URL}${path}`;

    if (tier === "list_only") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: user.email ?? undefined, // ✅ attach real email
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 25000,
              product_data: { name: "Influencer List" },
            },
            quantity: 1,
          },
        ],
        success_url: successTo("/dashboard?paid=true"),
        cancel_url: cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "list_plus_dm") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 100000,
              product_data: { name: "List + DM Outreach" },
            },
            quantity: 1,
          },
        ],
        success_url: successTo("/dashboard?paid=true"),
        cancel_url: cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "integration_setup") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 250000,
              product_data: { name: "Integrated Outreach – Installation" },
            },
            quantity: 1,
          },
        ],
        success_url: successTo("/pricing?setup_paid=true"),
        cancel_url: cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "integration_subscription") {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 100000,
              recurring: { interval: "month" },
              product_data: { name: "Integrated Outreach – Monthly Maintenance" },
            },
            quantity: 1,
          },
        ],
        success_url: successTo("/dashboard?subscribed=true"),
        cancel_url: cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  } catch (e: any) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
