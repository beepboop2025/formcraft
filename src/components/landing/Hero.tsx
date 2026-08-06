"use client";

import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import { STATS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 hero-gradient overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 mb-8 animate-fade-in">
            <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
            <span className="text-sm font-medium text-brand-700">
              Lifetime Deal — Limited spots available
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-brand-500" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance animate-slide-up">
            Build and publish
            <br />
            <span className="gradient-text">forms without code</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto text-balance animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Add conditional logic, payments, file uploads, embeds, custom branding,
            and response analytics from one editor.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/register" className="btn-primary !px-8 !py-3.5 !text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40">
              Start Building — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="btn-secondary !px-8 !py-3.5 !text-base">
              <Play className="h-4 w-4 fill-gray-700" />
              Watch Demo
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            A free plan is available; current limits are shown at signup.
          </p>
        </div>

        {/* Form builder preview */}
        <div className="mt-20 relative animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="mx-auto max-w-5xl">
            {/* Browser chrome mockup */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="mx-auto max-w-md rounded-md bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-400">
                    app.formary.io/builder
                  </div>
                </div>
              </div>

              {/* Builder preview content */}
              <div className="flex h-[420px] sm:h-[500px]">
                {/* Left sidebar */}
                <div className="hidden sm:block w-64 border-r border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fields</p>
                  {["Short Text", "Email", "Dropdown", "Rating", "File Upload"].map((f) => (
                    <div key={f} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 mb-2 text-sm text-gray-700 cursor-grab hover:border-brand-300 hover:shadow-sm transition-all">
                      <div className="h-2 w-2 rounded-full bg-brand-400" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Center canvas */}
                <div className="flex-1 p-8 bg-gradient-to-b from-gray-50/50 to-white">
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                      <p className="text-sm text-gray-500 mt-1">We&apos;d love to hear from you</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-400">John Doe</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <div className="w-full rounded-lg border-2 border-brand-500 bg-white px-4 py-2.5 text-sm text-gray-400 ring-2 ring-brand-500/10">john@example.com</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-8 text-sm text-gray-400">Tell us about your project...</div>
                    </div>
                  </div>
                </div>

                {/* Right sidebar */}
                <div className="hidden lg:block w-72 border-l border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Field Settings</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                      <div className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm">Email Address</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Placeholder</label>
                      <div className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-400">john@example.com</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Required</span>
                      <div className="h-5 w-9 rounded-full bg-brand-600 relative">
                        <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Validate email</span>
                      <div className="h-5 w-9 rounded-full bg-brand-600 relative">
                        <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
