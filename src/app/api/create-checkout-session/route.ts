// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Stripe Checkout route placeholder" });
}
