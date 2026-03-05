"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2, Star } from "lucide-react";
import { FormField } from "@/lib/types";
import { useFormStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface FormFieldCardProps {
  field: FormField;
}

export default function FormFieldCard({ field }: FormFieldCardProps) {
  const { selectedFieldId, selectField, removeField, duplicateField } = useFormStore();
  const isSelected = selectedFieldId === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "builder-field group",
        isSelected && "selected",
        isDragging && "dragging z-50"
      )}
      onClick={() => selectField(field.id)}
    >
      {/* Drag handle + actions */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateField(field.id);
          }}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          title="Duplicate"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeField(field.id);
          }}
          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Field preview */}
      <div className="pl-4">
        {field.type === "heading" ? (
          <h3 className="text-lg font-bold text-gray-900">{field.label}</h3>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}
              {field.validation?.required && (
                <span className="text-red-500 ml-0.5">*</span>
              )}
            </label>
            {field.helpText && (
              <p className="text-xs text-gray-400 mb-1.5">{field.helpText}</p>
            )}
            {renderFieldPreview(field)}
          </>
        )}
      </div>
    </div>
  );
}

function renderFieldPreview(field: FormField) {
  switch (field.type) {
    case "short_text":
    case "email":
    case "phone":
    case "url":
    case "number":
      return (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400">
          {field.placeholder || "Type here..."}
        </div>
      );

    case "long_text":
      return (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-400">
          {field.placeholder || "Type your message..."}
        </div>
      );

    case "dropdown":
      return (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 flex items-center justify-between">
          <span>{field.placeholder || "Select..."}</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      );

    case "multiple_choice":
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2.5 text-sm text-gray-600">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 shrink-0" />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "checkboxes":
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2.5 text-sm text-gray-600">
              <div className="h-4 w-4 rounded border-2 border-gray-300 shrink-0" />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "rating":
      return (
        <div className="flex gap-1">
          {Array.from({ length: field.maxStars || 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 text-gray-300" />
          ))}
        </div>
      );

    case "file_upload":
      return (
        <div className="w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-center">
          <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
        </div>
      );

    case "date":
      return (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400">
          {field.placeholder || "MM/DD/YYYY"}
        </div>
      );

    default:
      return null;
  }
}
