"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFormStore } from "@/lib/store";
import BuilderHeader from "@/components/builder/BuilderHeader";
import FieldPalette from "@/components/builder/FieldPalette";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import FieldSettings from "@/components/builder/FieldSettings";
import DesignPanel from "@/components/builder/DesignPanel";
import FormRenderer from "@/components/form/FormRenderer";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type Tab = "fields" | "design";

export default function BuilderPage() {
  const params = useParams();
  const formId = params.formId as string;
  const { currentForm, fetchForm, loading, previewMode } = useFormStore();
  const [activeTab, setActiveTab] = useState<Tab>("fields");

  useEffect(() => {
    fetchForm(formId);
  }, [formId, fetchForm]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Form not found</h2>
          <p className="text-sm text-gray-500 mt-1">
            This form may have been deleted or doesn&apos;t exist.
          </p>
          <Link href="/dashboard" className="text-sm text-brand-600 hover:text-brand-700 mt-4 inline-block">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="flex flex-col h-screen">
        <BuilderHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto max-w-2xl py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
              <FormRenderer form={currentForm} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <BuilderHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        {activeTab === "fields" ? <FieldPalette /> : <DesignPanel />}
        <BuilderCanvas />
        {activeTab === "fields" && <FieldSettings />}
      </div>
    </div>
  );
}
