"use client";

import { useFormStore } from "@/lib/store";

const colorPresets = [
  { name: "Indigo", color: "#4c6ef5" },
  { name: "Blue", color: "#228be6" },
  { name: "Teal", color: "#12b886" },
  { name: "Green", color: "#40c057" },
  { name: "Orange", color: "#fd7e14" },
  { name: "Red", color: "#fa5252" },
  { name: "Pink", color: "#e64980" },
  { name: "Violet", color: "#7950f2" },
  { name: "Dark", color: "#343a40" },
];

const fontOptions = [
  "Inter",
  "Georgia",
  "Courier New",
  "Arial",
  "Verdana",
];

const radiusOptions = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const;

export default function DesignPanel() {
  const { currentForm, updateTheme, updateSettings } = useFormStore();

  if (!currentForm) return null;

  const { theme, settings } = currentForm;

  return (
    <div className="w-64 border-r border-gray-100 bg-gray-50/50 overflow-y-auto flex-shrink-0">
      <div className="p-4 space-y-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Design
        </h3>

        {/* Form Title & Description */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Form Details
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => updateSettings({ title: e.target.value })}
                className="input-field !py-1.5 !text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea
                value={settings.description || ""}
                onChange={(e) => updateSettings({ description: e.target.value })}
                className="input-field !py-1.5 !text-sm resize-none"
                rows={2}
                placeholder="Optional form description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Button Text</label>
              <input
                type="text"
                value={settings.submitButtonText}
                onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
                className="input-field !py-1.5 !text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Success Message
              </label>
              <textarea
                value={settings.successMessage}
                onChange={(e) => updateSettings({ successMessage: e.target.value })}
                className="input-field !py-1.5 !text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Brand Color */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Brand Color
          </p>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.color}
                onClick={() => updateTheme({ primaryColor: preset.color })}
                className={`h-8 w-8 rounded-lg transition-all hover:scale-110 ${
                  theme.primaryColor === preset.color
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : ""
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => updateTheme({ primaryColor: e.target.value })}
              className="h-8 w-8 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => updateTheme({ primaryColor: e.target.value })}
              className="input-field !py-1.5 !text-sm flex-1 font-mono"
            />
          </div>
        </div>

        {/* Font */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Font
          </p>
          <select
            value={theme.fontFamily}
            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
            className="input-field !py-1.5 !text-sm"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Border Radius */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Corner Radius
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {radiusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateTheme({ borderRadius: opt.value })}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-all ${
                  theme.borderRadius === opt.value
                    ? "bg-brand-100 text-brand-700 border border-brand-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Background
          </p>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
              className="h-8 w-8 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={theme.backgroundColor}
              onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
              className="input-field !py-1.5 !text-sm flex-1 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
