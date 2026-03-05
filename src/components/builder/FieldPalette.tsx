"use client";

import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  Phone,
  Link,
  ChevronDown,
  CircleDot,
  CheckSquare,
  Star,
  Upload,
  Calendar,
  EyeOff,
  Heading,
} from "lucide-react";
import { FieldType, FIELD_TYPE_CONFIG } from "@/lib/types";
import { useFormStore } from "@/lib/store";

const iconMap: Record<string, React.ElementType> = {
  Type, AlignLeft, Mail, Hash, Phone, Link: Link,
  ChevronDown, CircleDot, CheckSquare, Star, Upload,
  Calendar, EyeOff, Heading,
};

const categories = [
  { key: "input", label: "Input Fields" },
  { key: "choice", label: "Choice Fields" },
  { key: "advanced", label: "Advanced" },
  { key: "layout", label: "Layout" },
] as const;

export default function FieldPalette() {
  const addField = useFormStore((s) => s.addField);

  return (
    <div className="w-64 border-r border-gray-100 bg-gray-50/50 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Add Fields
        </h3>

        {categories.map((cat) => {
          const fields = Object.entries(FIELD_TYPE_CONFIG).filter(
            ([, config]) => config.category === cat.key
          );
          if (fields.length === 0) return null;

          return (
            <div key={cat.key} className="mb-6">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                {cat.label}
              </p>
              <div className="space-y-1.5">
                {fields.map(([type, config]) => {
                  const Icon = iconMap[config.icon];
                  return (
                    <button
                      key={type}
                      onClick={() => addField(type as FieldType)}
                      className="flex w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-brand-300 hover:shadow-sm hover:text-brand-700 active:scale-[0.98] cursor-pointer"
                    >
                      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                      <span className="font-medium">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
