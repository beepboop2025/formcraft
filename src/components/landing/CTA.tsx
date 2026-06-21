"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white text-balance">
          Ready to build forms that actually convert?
        </h2>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Join thousands of creators, marketers, and businesses who trust Formary
          for their forms. Start for free — no credit card required.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            Start Building for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-8 py-3.5 text-base font-semibold text-gray-300 transition-all hover:bg-gray-800 hover:border-gray-600"
          >
            View Pricing
          </a>
        </div>
      </div>
    </section>
  );
}
