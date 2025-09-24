// app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ✅ no apiVersion

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook verify failed:", err?.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("🔔 Stripe event:", event.id, event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const md = session.metadata ?? {};

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const payload = {
      user_id: md.user_id ?? null,
      campaign_name: md.campaignName ?? null,
      niche: md.niche ?? null,
      platform: md.platform ?? null,
      brief_url: md.briefUrl ?? null,
      status: "active",
      stripe_session_id: session.id,
      amount_paid: session.amount_total ?? null,
    };

    console.log("📝 Upserting payload:", payload);

    const { error } = await supabase
      .from("requests")
      .upsert(payload, { onConflict: "stripe_session_id" });

    if (error) {
      console.error("❌ Supabase upsert failed:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    console.log("✅ Request recorded for session:", session.id);
  }

  return NextResponse.json({ received: true });
}
