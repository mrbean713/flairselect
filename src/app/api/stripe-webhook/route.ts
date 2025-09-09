import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  const buf = Buffer.from(await req.arrayBuffer());

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const md = session.metadata || {};

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
    );

    // If you saved only a storage path in metadata, create a signed URL now (optional)
    let brief_url: string | null = null;
    if (md.briefPath) {
      const { data } = await supabase
        .storage
        .from("requests-briefs")
        .createSignedUrl(md.briefPath, 60 * 60 * 24 * 7); // 7 days
      brief_url = data?.signedUrl ?? null;
    }

    // Insert the paid request
    await supabase.from("requests").insert([
      {
        user_id: md.user_id,
        campaign_name: md.campaignName || null,
        niche: md.niche || null,
        platform: md.platform || null,
        brief_url,
        status: "active",
        stripe_session_id: session.id,
        amount_paid: session.amount_total,
      },
    ]);
  }

  return NextResponse.json({ received: true });
}
