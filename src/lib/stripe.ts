import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export const PLANS = {
  free: {
    name: "Free",
    forms: 3,
    responsesPerMonth: 100,
    features: ["3 forms", "100 responses/month", "Basic themes", "Formary branding"],
  },
  pro: {
    name: "Pro",
    forms: Infinity,
    responsesPerMonth: Infinity,
    features: [
      "Unlimited forms",
      "Unlimited responses",
      "Conditional logic",
      "Custom branding",
      "File uploads",
      "Zapier & Webhooks",
    ],
  },
  business: {
    name: "Business",
    forms: Infinity,
    responsesPerMonth: Infinity,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom domain",
      "API access",
      "Advanced analytics",
      "White-label forms",
    ],
  },
  ltd: {
    name: "Lifetime Deal",
    forms: Infinity,
    responsesPerMonth: Infinity,
    features: [
      "Everything in Pro — forever",
      "Unlimited forms & responses",
      "All future features",
      "Priority support for life",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanLimits(plan: string) {
  return PLANS[plan as PlanKey] || PLANS.free;
}
