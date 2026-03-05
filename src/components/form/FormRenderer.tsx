"use client";

import { useState } from "react";
import { FormField, FormTheme, FormSettings } from "@/lib/types";
import { getBorderRadiusClass, cn } from "@/lib/utils";
import { Star, Upload, CheckCircle2, Loader2 } from "lucide-react";

interface FormRendererProps {
  form: {
    fields: FormField[];
    settings: FormSettings;
    theme: FormTheme;
  };
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
}

export default function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { theme, settings, fields } = form;
  const borderRadius = getBorderRadiusClass(theme.borderRadius);

  function setValue(fieldId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.type === "heading") continue;
      const val = values[field.id];
      if (field.validation?.required) {
        if (!val || (typeof val === "string" && !val.trim())) {
          newErrors[field.id] = "This field is required";
          continue;
        }
      }
      if (val && typeof val === "string") {
        if (field.validation?.minLength && val.length < field.validation.minLength) {
          newErrors[field.id] = `Minimum ${field.validation.minLength} characters`;
        }
        if (field.validation?.maxLength && val.length > field.validation.maxLength) {
          newErrors[field.id] = `Maximum ${field.validation.maxLength} characters`;
        }
        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors[field.id] = "Please enter a valid email";
        }
        if (field.type === "url" && !/^https?:\/\/.+/.test(val)) {
          newErrors[field.id] = "Please enter a valid URL";
        }
      }
      if (field.type === "number" && val !== undefined && val !== "") {
        const num = Number(val);
        if (field.validation?.min !== undefined && num < field.validation.min) {
          newErrors[field.id] = `Minimum value is ${field.validation.min}`;
        }
        if (field.validation?.max !== undefined && num > field.validation.max) {
          newErrors[field.id] = `Maximum value is ${field.validation.max}`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (onSubmit) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        await onSubmit(values);
        setSubmitted(true);
      } catch (err: any) {
        setSubmitError(err.message || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else {
      // Preview mode - just show success
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div
        className={cn("p-12 text-center", borderRadius)}
        style={{ backgroundColor: theme.backgroundColor, fontFamily: theme.fontFamily }}
      >
        <div
          className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-6"
          style={{ backgroundColor: theme.primaryColor + "15" }}
        >
          <CheckCircle2 className="h-8 w-8" style={{ color: theme.primaryColor }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textColor }}>
          {settings.successMessage}
        </h2>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("p-8 sm:p-10", borderRadius)}
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
      }}
    >
      {/* Form header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{settings.title}</h1>
        {settings.description && (
          <p className="text-sm opacity-60 mt-1">{settings.description}</p>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {fields.map((field) => (
          <RenderedField
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={(val) => setValue(field.id, val)}
            theme={form.theme}
            borderRadius={borderRadius}
          />
        ))}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Submit */}
      {fields.length > 0 && (
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "mt-8 w-full py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2",
            borderRadius
          )}
          style={{ backgroundColor: theme.primaryColor }}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Submitting..." : settings.submitButtonText}
        </button>
      )}
    </form>
  );
}

interface RenderedFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  theme: FormTheme;
  borderRadius: string;
}

function RenderedField({
  field,
  value,
  error,
  onChange,
  theme,
  borderRadius,
}: RenderedFieldProps) {
  if (field.type === "heading") {
    return (
      <div className="pt-4">
        <h3 className="text-lg font-bold">{field.label}</h3>
      </div>
    );
  }

  if (field.type === "hidden") return null;

  const inputClasses = cn(
    "w-full border bg-white px-4 py-2.5 text-sm outline-none transition-all",
    borderRadius,
    error
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:ring-2",
  );

  const focusStyle = { "--tw-ring-color": theme.primaryColor + "33", borderColor: error ? undefined : theme.primaryColor } as React.CSSProperties;

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {field.label}
        {field.validation?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {field.helpText && (
        <p className="text-xs opacity-50 mb-1.5">{field.helpText}</p>
      )}

      {/* Short text, email, phone, url, number */}
      {(field.type === "short_text" ||
        field.type === "email" ||
        field.type === "phone" ||
        field.type === "url" ||
        field.type === "number") && (
        <input
          type={
            field.type === "email"
              ? "email"
              : field.type === "number"
              ? "number"
              : field.type === "phone"
              ? "tel"
              : field.type === "url"
              ? "url"
              : "text"
          }
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClasses}
          style={focusStyle}
        />
      )}

      {/* Long text */}
      {field.type === "long_text" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={cn(inputClasses, "resize-none")}
          style={focusStyle}
        />
      )}

      {/* Dropdown */}
      {field.type === "dropdown" && (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          style={focusStyle}
        >
          <option value="">{field.placeholder || "Select..."}</option>
          {field.options?.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Multiple choice */}
      {field.type === "multiple_choice" && (
        <div className="space-y-2.5">
          {field.options?.map((opt) => (
            <label
              key={opt.id}
              className={cn(
                "flex items-center gap-3 border px-4 py-3 cursor-pointer transition-all",
                borderRadius,
                value === opt.value
                  ? "border-2 bg-opacity-5"
                  : "border-gray-200 hover:border-gray-300"
              )}
              style={
                value === opt.value
                  ? { borderColor: theme.primaryColor, backgroundColor: theme.primaryColor + "08" }
                  : undefined
              }
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                  value === opt.value ? "border-current" : "border-gray-300"
                )}
                style={value === opt.value ? { borderColor: theme.primaryColor } : undefined}
              >
                {value === opt.value && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                )}
              </div>
              <span className="text-sm">{opt.label}</span>
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      )}

      {/* Checkboxes */}
      {field.type === "checkboxes" && (
        <div className="space-y-2.5">
          {field.options?.map((opt) => {
            const checked = Array.isArray(value) && (value as string[]).includes(opt.value);
            return (
              <label
                key={opt.id}
                className={cn(
                  "flex items-center gap-3 border px-4 py-3 cursor-pointer transition-all",
                  borderRadius,
                  checked
                    ? "border-2 bg-opacity-5"
                    : "border-gray-200 hover:border-gray-300"
                )}
                style={
                  checked
                    ? { borderColor: theme.primaryColor, backgroundColor: theme.primaryColor + "08" }
                    : undefined
                }
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                    checked ? "border-current" : "border-gray-300"
                  )}
                  style={checked ? { borderColor: theme.primaryColor, backgroundColor: theme.primaryColor } : undefined}
                >
                  {checked && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{opt.label}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const current = Array.isArray(value) ? (value as string[]) : [];
                    const next = checked
                      ? current.filter((v) => v !== opt.value)
                      : [...current, opt.value];
                    onChange(next);
                  }}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      )}

      {/* Rating */}
      {field.type === "rating" && (
        <div className="flex gap-1.5">
          {Array.from({ length: field.maxStars || 5 }).map((_, i) => {
            const filled = typeof value === "number" && i < value;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i + 1)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="h-8 w-8 transition-colors"
                  style={{
                    color: filled ? theme.primaryColor : "#d1d5db",
                    fill: filled ? theme.primaryColor : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* File upload */}
      {field.type === "file_upload" && (
        <div
          className={cn(
            "border-2 border-dashed py-10 text-center cursor-pointer transition-all hover:border-gray-300",
            borderRadius
          )}
        >
          <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
        </div>
      )}

      {/* Date */}
      {field.type === "date" && (
        <input
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          style={focusStyle}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
}
