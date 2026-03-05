"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Save, Globe, Zap, Settings, Palette, Loader2, Check, Share2 } from "lucide-react";
import { useFormStore } from "@/lib/store";
import { useState } from "react";
import toast from "react-hot-toast";
import ShareModal from "./ShareModal";

type Tab = "fields" | "design";

interface BuilderHeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BuilderHeader({ activeTab, onTabChange }: BuilderHeaderProps) {
  const { currentForm, previewMode, saving, setPreviewMode, saveForm, togglePublish, updateSettings } =
    useFormStore();
  const [editingTitle, setEditingTitle] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!currentForm) return null;

  async function handleSave() {
    await saveForm();
    setSaved(true);
    toast.success("Form saved");
    setTimeout(() => setSaved(false), 2000);
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      await togglePublish();
      toast.success(currentForm!.published ? "Form unpublished" : "Form published!");
    } catch {
      toast.error("Failed to update publish status");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 h-14 flex-shrink-0">
      {/* Left: Back + Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-600 text-white">
            <Zap className="h-3 w-3" />
          </div>
          {editingTitle ? (
            <input
              autoFocus
              type="text"
              value={currentForm.settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              onBlur={() => {
                setEditingTitle(false);
                saveForm();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingTitle(false);
                  saveForm();
                }
              }}
              className="text-sm font-semibold text-gray-900 border-b border-brand-500 outline-none bg-transparent px-0 py-0.5"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="text-sm font-semibold text-gray-900 hover:text-brand-700 transition-colors"
            >
              {currentForm.settings.title}
            </button>
          )}
          {saving && (
            <span className="text-xs text-gray-400 ml-1">Saving...</span>
          )}
        </div>
      </div>

      {/* Center: Tabs */}
      <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
        {[
          { key: "fields" as Tab, label: "Fields", icon: Settings },
          { key: "design" as Tab, label: "Design", icon: Palette },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="btn-ghost !py-1.5 !px-3 !text-xs"
        >
          {previewMode ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Edit
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Preview
            </>
          )}
        </button>

        <button onClick={handleSave} disabled={saving} className="btn-ghost !py-1.5 !px-3 !text-xs">
          {saved ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "Saved" : "Save"}
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            currentForm.published
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          {publishing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
          {currentForm.published ? "Published" : "Publish"}
        </button>

        {currentForm.published && (
          <button
            onClick={() => setShareOpen(true)}
            className="btn-ghost !py-1.5 !px-3 !text-xs"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        )}
      </div>

      {shareOpen && (
        <ShareModal
          formSlug={currentForm.slug}
          formId={currentForm.id}
          isPublished={currentForm.published}
          onClose={() => setShareOpen(false)}
        />
      )}
    </header>
  );
}
