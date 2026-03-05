"use client";

import { Check, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PRICING_PLANS, LTD_PLAN } from "@/lib/constants";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function Pricing() {
  const { data: session } = useSession();

  async function handleCheckout(plan: string) {
    if (!session) {
      // Redirect to register first
      window.location.href = "/register";
      return;
    }
    try {
      const { url } = await api.createCheckout(plan);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    }
  }

  return (
    <section id="pricing" className="py-24 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            No per-response fees. No hidden charges. Pick a plan and start building.
          </p>
        </div>

        {/* Lifetime Deal Banner */}
        <div className="mb-12 mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 p-8 sm:p-10 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-3">
                  <Zap className="h-3 w-3" />
                  LIMITED TIME OFFER
                </div>
                <h3 className="text-2xl font-bold">{LTD_PLAN.name}</h3>
                <p className="text-white/80 mt-1 text-sm max-w-md">
                  {LTD_PLAN.description}
                </p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-extrabold">${LTD_PLAN.price}</span>
                  <span className="text-lg text-white/60 line-through">
                    ${LTD_PLAN.originalPrice}
                  </span>
                  <span className="text-sm text-white/80">one-time payment</span>
                </div>
                {/* Progress bar */}
                <div className="mt-4 w-full max-w-xs">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>{LTD_PLAN.spotsLeft} spots left</span>
                    <span>{LTD_PLAN.totalSpots} total</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{
                        width: `${((LTD_PLAN.totalSpots - LTD_PLAN.spotsLeft) / LTD_PLAN.totalSpots) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleCheckout("ltd")}
                className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                Claim Your Spot
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white border-2 border-brand-500 shadow-xl shadow-brand-500/10 scale-105"
                  : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-gray-500">/{plan.period}</span>
                  )}
                </div>
              </div>

              {plan.price === 0 ? (
                <Link
                  href="/register"
                  className="block w-full text-center rounded-lg py-2.5 text-sm font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.name.toLowerCase())}
                  className={`block w-full text-center rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </button>
              )}

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
