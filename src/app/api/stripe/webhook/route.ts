import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        // Map checkout plan to stored plan value
        let planValue = "pro";
        if (plan === "ltd") planValue = "ltd";
        else if (plan.startsWith("business")) planValue = "business";
        else if (plan.startsWith("pro")) planValue = "pro";

        await prisma.user.update({
          where: { id: userId },
          data: { plan: planValue },
        });

        // Record payment
        await prisma.payment.create({
          data: {
            userId,
            stripePaymentId: session.payment_intent as string || session.subscription as string || session.id,
            amount: session.amount_total || 0,
            currency: session.currency || "usd",
            status: "succeeded",
            plan,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user && user.plan !== "ltd") {
        // LTD users keep their plan forever
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "free" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
