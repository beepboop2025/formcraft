"use client";

import {
  MousePointerClick,
  GitBranch,
  Infinity,
  Palette,
  BarChart3,
  Plug,
  Upload,
  Brush,
  Share2,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick,
  GitBranch,
  Infinity,
  Palette,
  BarChart3,
  Plug,
  Upload,
  Brush,
  Share2,
};

export default function Features() {
  return (
    <section id="features" className="py-24 feature-grid-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            Everything you need to build better forms
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Editing, logic, collection, and reporting tools in one form workflow.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-brand-50 p-3 text-brand-600 transition-colors group-hover:bg-brand-100">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
