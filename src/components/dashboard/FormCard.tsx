"use client";

import Link from "next/link";
import { MoreHorizontal, Eye, BarChart3, Copy, Trash2, ExternalLink, Globe, Share2, FileText } from "lucide-react";
import { FormData } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

interface FormCardProps {
  form: FormData;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function FormCard({ form, onDelete, onDuplicate }: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const title = form.title || form.settings?.title || "Untitled Form";
  const description = form.description || form.settings?.description;
  const fieldCount = form.fields?.length || 0;

  function copyShareLink() {
    const url = `${window.location.origin}/f/${form.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <div className="card group relative">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            form.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          <div className={`h-1.5 w-1.5 rounded-full ${form.published ? "bg-green-500" : "bg-gray-400"}`} />
          {form.published ? "Published" : "Draft"}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-slide-down">
                {form.published && (
                  <>
                    <Link
                      href={`/f/${form.slug}`}
                      target="_blank"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      View Live Form
                    </Link>
                    <button
                      onClick={() => { copyShareLink(); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Share2 className="h-4 w-4 text-gray-400" />
                      Copy Link
                    </button>
                  </>
                )}
                <Link
                  href={`/dashboard/forms/${form.id}/responses`}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <FileText className="h-4 w-4 text-gray-400" />
                  View Responses
                </Link>
                <button
                  onClick={() => { onDuplicate(form.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4 text-gray-400" />
                  Duplicate
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { onDelete(form.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Link href={`/builder/${form.id}`} className="block">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>
        {description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>}
      </Link>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {form.views} views
        </div>
        <Link
          href={`/dashboard/forms/${form.id}/responses`}
          className="flex items-center gap-1 hover:text-brand-600 transition-colors"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          {form.responses} responses
        </Link>
        <div className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          {fieldCount} fields
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400">Updated {formatDate(form.updatedAt)}</p>
        <Link href={`/builder/${form.id}`} className="text-xs font-medium text-brand-600 hover:text-brand-700">
          Edit &rarr;
        </Link>
      </div>
    </div>
  );
}
