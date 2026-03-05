"use client";

import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { useFormStore } from "@/lib/store";
import { FIELD_TYPE_CONFIG } from "@/lib/types";
import { generateId } from "@/lib/utils";

export default function FieldSettings() {
  const { currentForm, selectedFieldId, selectField, updateField } = useFormStore();

  const field = currentForm?.fields.find((f) => f.id === selectedFieldId);

  if (!field) {
    return (
      <div className="w-80 border-l border-gray-100 bg-gray-50/50 flex-shrink-0 hidden lg:block">
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <p className="text-sm text-gray-400">
            Select a field to edit its settings
          </p>
        </div>
      </div>
    );
  }

  const config = FIELD_TYPE_CONFIG[field.type];
  const hasOptions =
    field.type === "dropdown" ||
    field.type === "multiple_choice" ||
    field.type === "checkboxes";

  return (
    <div className="w-80 border-l border-gray-100 bg-gray-50/50 flex-shrink-0 overflow-y-auto hidden lg:block">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Field Settings</h3>
            <p className="text-xs text-gray-400">{config.label}</p>
          </div>
          <button
            onClick={() => selectField(null)}
            className="p-1.5 rounded-md hover:bg-gray-200 text-gray-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Label */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Placeholder */}
          {field.type !== "heading" &&
            field.type !== "multiple_choice" &&
            field.type !== "checkboxes" &&
            field.type !== "rating" &&
            field.type !== "file_upload" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(field.id, { placeholder: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            )}

          {/* Help text */}
          {field.type !== "heading" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Help Text
              </label>
              <input
                type="text"
                value={field.helpText || ""}
                onChange={(e) =>
                  updateField(field.id, { helpText: e.target.value })
                }
                className="input-field"
                placeholder="Optional help text"
              />
            </div>
          )}

          {/* Options (for dropdown, multiple choice, checkboxes) */}
          {hasOptions && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {field.options?.map((opt, index) => (
                  <div key={opt.id} className="flex items-center gap-1.5">
                    <GripVertical className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const options = [...(field.options || [])];
                        options[index] = {
                          ...opt,
                          label: e.target.value,
                          value: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "_"),
                        };
                        updateField(field.id, { options });
                      }}
                      className="input-field !py-1.5 !text-sm"
                    />
                    <button
                      onClick={() => {
                        const options = field.options?.filter(
                          (o) => o.id !== opt.id
                        );
                        updateField(field.id, { options });
                      }}
                      className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const options = [
                    ...(field.options || []),
                    {
                      id: generateId(),
                      label: `Option ${(field.options?.length || 0) + 1}`,
                      value: `option_${(field.options?.length || 0) + 1}`,
                    },
                  ];
                  updateField(field.id, { options });
                }}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Option
              </button>
            </div>
          )}

          {/* Rating stars count */}
          {field.type === "rating" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Number of Stars
              </label>
              <select
                value={field.maxStars || 5}
                onChange={(e) =>
                  updateField(field.id, { maxStars: parseInt(e.target.value) })
                }
                className="input-field"
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Validation */}
          {field.type !== "heading" && (
            <>
              <hr className="border-gray-200" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Validation
              </p>

              {/* Required toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Required
                </label>
                <button
                  onClick={() =>
                    updateField(field.id, {
                      validation: {
                        ...field.validation,
                        required: !field.validation?.required,
                      },
                    })
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    field.validation?.required
                      ? "bg-brand-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      field.validation?.required
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Min/Max length for text fields */}
              {(field.type === "short_text" || field.type === "long_text") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Min Length
                    </label>
                    <input
                      type="number"
                      value={field.validation?.minLength || ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          validation: {
                            ...field.validation,
                            minLength: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      className="input-field !py-1.5"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Max Length
                    </label>
                    <input
                      type="number"
                      value={field.validation?.maxLength || ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          validation: {
                            ...field.validation,
                            maxLength: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      className="input-field !py-1.5"
                      placeholder="∞"
                      min={0}
                    />
                  </div>
                </div>
              )}

              {/* Min/Max for number fields */}
              {field.type === "number" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Minimum
                    </label>
                    <input
                      type="number"
                      value={field.validation?.min ?? ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          validation: {
                            ...field.validation,
                            min: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      className="input-field !py-1.5"
                      placeholder="-∞"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Maximum
                    </label>
                    <input
                      type="number"
                      value={field.validation?.max ?? ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          validation: {
                            ...field.validation,
                            max: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      className="input-field !py-1.5"
                      placeholder="∞"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
