import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

const PRICE_MAP: Record<string, string | undefined> = {
  ltd: process.env.STRIPE_LTD_PRICE_ID,
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  business_monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
  business_yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
};

export async function POST(req: Request) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const { plan } = await req.json();
  const priceId = PRICE_MAP[plan];

  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  // Create or retrieve Stripe customer
  let customerId = user?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user?.email || session!.user.email!,
      name: user?.name || undefined,
      metadata: { userId: session!.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const isLTD = plan === "ltd";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isLTD ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      userId: session!.user.id,
      plan,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
