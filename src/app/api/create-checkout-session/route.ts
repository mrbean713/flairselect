import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { userId, form, tier } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Keep metadata small & string-only
    const metadata: Record<string, string> = {
      user_id: String(userId),
      tier: String(tier || ""),
      campaignName: String(form?.campaignName ?? ""),
      niche: String(form?.niche ?? ""),
      platform: String(form?.platform ?? ""),
      briefPath: String(form?.briefPath ?? ""),
    };

    // Map your three price options
    if (tier === "list_only") {
      // $250 one-time
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 25000, // $250
              product_data: { name: "Influencer List" },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?paid=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
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
              unit_amount: 100000, // $1,000
              product_data: { name: "List + DM Outreach" },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?paid=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "integration_setup") {
      // $2,500 installation (one-time)
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 250000, // $2,500
              product_data: { name: "Integrated Outreach – Installation" },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?setup_paid=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    if (tier === "integration_subscription") {
      // $1,000 / month recurring
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 100000, // $1,000
              recurring: { interval: "month" },
              product_data: { name: "Integrated Outreach – Monthly Maintenance" },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?subscribed=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
        metadata,
      });
      return NextResponse.json({ sessionId: session.id });
    }

    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
