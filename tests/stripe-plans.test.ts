import { describe, it, expect, beforeAll } from "vitest";

// stripe.ts instantiates a Stripe client at module load; give it a dummy key.
beforeAll(() => {
  process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";
});

describe("plan limits", () => {
  it("free plan caps forms and monthly responses", async () => {
    const { PLANS, getPlanLimits } = await import("@/lib/stripe");
    expect(PLANS.free.forms).toBe(3);
    expect(PLANS.free.responsesPerMonth).toBe(100);
    expect(getPlanLimits("free")).toBe(PLANS.free);
  });

  it("paid plans grant unlimited forms and responses", async () => {
    const { PLANS } = await import("@/lib/stripe");
    for (const key of ["pro", "business", "ltd"] as const) {
      expect(PLANS[key].forms).toBe(Infinity);
      expect(PLANS[key].responsesPerMonth).toBe(Infinity);
    }
  });

  it("getPlanLimits falls back to the free plan for unknown keys", async () => {
    const { PLANS, getPlanLimits } = await import("@/lib/stripe");
    expect(getPlanLimits("enterprise")).toBe(PLANS.free);
    expect(getPlanLimits("")).toBe(PLANS.free);
    expect(getPlanLimits("FREE")).toBe(PLANS.free); // case-sensitive lookup
  });

  it("resolves each known plan key to its own definition", async () => {
    const { PLANS, getPlanLimits } = await import("@/lib/stripe");
    expect(getPlanLimits("pro")).toBe(PLANS.pro);
    expect(getPlanLimits("business")).toBe(PLANS.business);
    expect(getPlanLimits("ltd")).toBe(PLANS.ltd);
  });

  it("every plan exposes a human name and a non-empty feature list", async () => {
    const { PLANS } = await import("@/lib/stripe");
    for (const plan of Object.values(PLANS)) {
      expect(typeof plan.name).toBe("string");
      expect(plan.name.length).toBeGreaterThan(0);
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });
});
