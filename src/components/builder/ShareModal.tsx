"use client";

import { useState } from "react";
import { X, Copy, Check, Link2, Code, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface ShareModalProps {
  formSlug: string;
  formId: string;
  isPublished: boolean;
  onClose: () => void;
}

export default function ShareModal({ formSlug, formId, isPublished, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<"link" | "embed">("link");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const formUrl = `${baseUrl}/f/${formSlug}`;

  const embedCode = `<iframe
  src="${formUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
></iframe>`;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Share Form</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          {!isPublished ? (
            <div className="p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-50">
                <Link2 className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Form not published</h3>
              <p className="text-sm text-gray-500">
                Publish your form first to get a shareable link.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setTab("link")}
                  className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${
                    tab === "link"
                      ? "text-brand-700 border-b-2 border-brand-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Link2 className="h-3.5 w-3.5 inline mr-1.5" />
                  Direct Link
                </button>
                <button
                  onClick={() => setTab("embed")}
                  className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${
                    tab === "embed"
                      ? "text-brand-700 border-b-2 border-brand-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Code className="h-3.5 w-3.5 inline mr-1.5" />
                  Embed Code
                </button>
              </div>

              <div className="p-6">
                {tab === "link" ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={formUrl}
                        className="flex-1 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700 border border-gray-200 outline-none"
                      />
                      <button
                        onClick={() => copy(formUrl, "Link")}
                        className="btn-primary !py-2.5 !px-4 !text-sm shrink-0"
                      >
                        {copied === "Link" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied === "Link" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <a
                      href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open in new tab
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                        <code>{embedCode}</code>
                      </pre>
                    </div>
                    <button
                      onClick={() => copy(embedCode, "Embed code")}
                      className="btn-primary !text-sm w-full"
                    >
                      {copied === "Embed code" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied === "Embed code" ? "Copied" : "Copy Embed Code"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
