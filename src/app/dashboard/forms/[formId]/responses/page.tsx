"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Download,
  Loader2,
  Zap,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3,
  Clock,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ResponseData {
  id: string;
  data: Record<string, unknown>;
  metadata: { userAgent?: string; referrer?: string; ip?: string };
  completedAt: string;
}

interface FormInfo {
  id: string;
  title: string;
  fields: { id: string; label: string; type: string }[];
  settings: { title: string };
  views: number;
  responses: number;
  published: boolean;
  slug: string;
}

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const [form, setForm] = useState<FormInfo | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<ResponseData | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [formRes, responsesRes] = await Promise.all([
          api.getForm(formId),
          api.getResponses(formId),
        ]);
        setForm({
          ...formRes.form,
          fields: formRes.form.fields || [],
          settings: formRes.form.settings || { title: "Untitled" },
        });
        setResponses(responsesRes.responses);
        setTotal(responsesRes.total);
        setTotalPages(Math.ceil(responsesRes.total / 50));
      } catch {
        toast.error("Failed to load responses");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [formId, page]);

  function getFieldLabel(fieldId: string): string {
    if (!form) return fieldId;
    const field = form.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  }

  function exportCSV() {
    if (!form || responses.length === 0) return;

    const dataFields = form.fields.filter((f) => f.type !== "heading" && f.type !== "hidden");
    const headers = ["Submitted At", ...dataFields.map((f) => f.label)];
    const rows = responses.map((r) => [
      new Date(r.completedAt).toLocaleString(),
      ...dataFields.map((f) => {
        const val = r.data[f.id];
        if (Array.isArray(val)) return val.join(", ");
        return String(val ?? "");
      }),
    ]);

    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.settings.title || "form"}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  const conversionRate = form && form.views > 0
    ? ((form.responses / form.views) * 100).toFixed(1)
    : "0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900">{form?.settings.title || "Form"}</h1>
                  <p className="text-xs text-gray-500">Responses</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/builder/${formId}`}
                className="btn-ghost !py-1.5 !px-3 !text-xs"
              >
                Edit Form
              </Link>
              <button
                onClick={exportCSV}
                disabled={responses.length === 0}
                className="btn-primary !py-1.5 !px-3 !text-xs disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card !p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total Responses</p>
              </div>
            </div>
          </div>
          <div className="card !p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2.5">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{form?.views || 0}</p>
                <p className="text-xs text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
          <div className="card !p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2.5">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
                <p className="text-xs text-gray-500">Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responses table */}
        {responses.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-2xl bg-gray-50 p-5">
              <Inbox className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No responses yet</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Share your form link to start collecting responses. They&apos;ll appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    {form?.fields
                      .filter((f) => f.type !== "heading" && f.type !== "hidden")
                      .slice(0, 4)
                      .map((field) => (
                        <th
                          key={field.id}
                          className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {field.label}
                        </th>
                      ))}
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {responses.map((response, idx) => (
                    <tr
                      key={response.id}
                      onClick={() => setSelectedResponse(response)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                        {(page - 1) * 50 + idx + 1}
                      </td>
                      {form?.fields
                        .filter((f) => f.type !== "heading" && f.type !== "hidden")
                        .slice(0, 4)
                        .map((field) => {
                          const val = response.data[field.id];
                          const display = Array.isArray(val)
                            ? val.join(", ")
                            : String(val ?? "—");
                          return (
                            <td key={field.id} className="py-3 px-4 text-gray-700 max-w-[200px] truncate">
                              {display}
                            </td>
                          );
                        })}
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(response.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Showing {(page - 1) * 50 + 1}-{Math.min(page * 50, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-600 px-2">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Response detail modal */}
      {selectedResponse && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelectedResponse(null)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-down">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Response Details</h2>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-xs text-gray-500">
                Submitted {new Date(selectedResponse.completedAt).toLocaleString()}
              </div>

              {form?.fields
                .filter((f) => f.type !== "heading" && f.type !== "hidden")
                .map((field) => {
                  const val = selectedResponse.data[field.id];
                  const display = Array.isArray(val)
                    ? val.join(", ")
                    : String(val ?? "—");
                  return (
                    <div key={field.id}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {field.label}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                        {display || "—"}
                      </p>
                    </div>
                  );
                })}

              {selectedResponse.metadata && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="text-xs font-medium text-gray-500 mb-3">Metadata</h3>
                  <div className="space-y-2 text-xs text-gray-500">
                    {selectedResponse.metadata.referrer && (
                      <div>
                        <span className="font-medium">Referrer:</span> {selectedResponse.metadata.referrer}
                      </div>
                    )}
                    {selectedResponse.metadata.userAgent && (
                      <div>
                        <span className="font-medium">Browser:</span>{" "}
                        {selectedResponse.metadata.userAgent.substring(0, 80)}...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
