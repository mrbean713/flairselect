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
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Auth session missing!" }, { status: 401 });
    }

    const user = session.user;

    // Optionally let the client tell us a promo_code to auto-apply (Stripe ID like 'promo_...')
    const { form, tier, promotion_code } = await req.json(); // 👈 optional

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

    // Helper to add shared Checkout params, including promotions
    const withPromos = (base: Stripe.Checkout.SessionCreateParams) => {
      const params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: true, // 👈 shows the discount code box
        customer_email: user.email ?? undefined,
        metadata,
        ...base,
      };

      // If you want to auto-apply a specific code, pass promotion_code from client
      if (promotion_code) {
        params.discounts = [{ promotion_code }]; // 👈 pre-applies the code
      }

      return params;
    };

    if (tier === "list_only") {
      const session = await stripe.checkout.sessions.create(
        withPromos({
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
          cancel_url: cancelTo("/pricing?canceled=true"),
        })
      );
      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    if (tier === "list_plus_dm") {
      const session = await stripe.checkout.sessions.create(
        withPromos({
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
          cancel_url: cancelTo("/pricing?canceled=true"),
        })
      );
      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    if (tier === "integration_setup") {
      const session = await stripe.checkout.sessions.create(
        withPromos({
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
          cancel_url: cancelTo("/pricing?canceled=true"),
        })
      );
      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    if (tier === "integration_subscription") {
      const session = await stripe.checkout.sessions.create(
        withPromos({
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
          cancel_url: cancelTo("/pricing?canceled=true"),
        })
      );
      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  } catch (e: any) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
