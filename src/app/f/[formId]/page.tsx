"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import FormRenderer from "@/components/form/FormRenderer";
import { Zap, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.formId as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadForm() {
      try {
        const { form } = await api.getPublicForm(slug);
        setForm(form);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadForm();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Form not found</h2>
          <p className="text-sm text-gray-500 mt-1">
            This form may have been deleted or is no longer available.
          </p>
          <Link href="/" className="text-sm text-brand-600 hover:text-brand-700 mt-4 inline-block">
            &larr; Go Home
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(data: Record<string, unknown>) {
    await api.submitResponse(form.id, data);
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        backgroundColor: form.theme?.backgroundColor === "#ffffff" ? "#f8f9fa" : (form.theme?.backgroundColor || "#f8f9fa"),
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <FormRenderer form={form} onSubmit={handleSubmit} />
        </div>

        {/* FormCraft branding */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <span>Powered by</span>
          <Link href="/" className="flex items-center gap-1 font-medium text-gray-500 hover:text-gray-700 transition-colors">
            <Zap className="h-3 w-3" />
            FormCraft
          </Link>
        </div>
      </div>
    </div>
  );
}
