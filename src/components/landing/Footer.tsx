"use client";

import { Zap } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const footerLinks = {
  Product: ["Features", "Pricing", "Templates", "Integrations", "Changelog"],
  Resources: ["Documentation", "Blog", "Help Center", "API Reference", "Status"],
  Company: ["About", "Careers", "Contact", "Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Beautiful forms that convert. Built for creators, marketers, and businesses of all sizes.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
              Twitter
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
              GitHub
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
