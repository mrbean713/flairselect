import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Build a full site URL with an explicit scheme.
// Set NEXT_PUBLIC_SITE_URL=https://flairselect.vercel.app in your env for production.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// Validate the URL to avoid Stripe errors
try {
  // will throw if invalid
  new URL(SITE_URL);
} catch {
  throw new Error(
    `Invalid NEXT_PUBLIC_SITE_URL/VERCEL_URL. Got "${SITE_URL}". It must include scheme, e.g. https://yourdomain.com`
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // let Stripe use your dashboard default API version

export async function POST(req: NextRequest) {
  try {
    const { userId, form, tier } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Keep metadata small & string-only
    const metadata: Record<string, string> = {
      user_id: String(userId ?? ""),
      tier: String(tier ?? ""),
      campaignName: String(form?.campaignName ?? ""),
      niche: String(form?.niche ?? ""),
      platform: String(form?.platform ?? ""),
      briefPath: String(form?.briefPath ?? ""), // storage path; optional
    };

    const successTo = (path: string) => `${SITE_URL}${path}`;
    const cancelTo  = (path: string) => `${SITE_URL}${path}`;

    if (tier === "list_only") {
      // $250 one-time
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
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
        cancel_url:  cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "list_plus_dm") {
      // $1,000 one-time
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
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
        cancel_url:  cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "integration_setup") {
      // $2,500 install (one-time)
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
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
        cancel_url:  cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "integration_subscription") {
      // $1,000 / month
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
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
        cancel_url:  cancelTo("/pricing?canceled=true"),
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
