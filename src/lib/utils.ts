import { nanoid } from "nanoid";
import { FormField, FieldType, FieldOption, Form, DEFAULT_THEME, DEFAULT_SETTINGS } from "./types";

export function generateId(): string {
  return nanoid(10);
}

export function createField(type: FieldType): FormField {
  const base: FormField = {
    id: generateId(),
    type,
    label: getDefaultLabel(type),
    placeholder: getDefaultPlaceholder(type),
    validation: { required: false },
  };

  if (type === "dropdown" || type === "multiple_choice" || type === "checkboxes") {
    base.options = [
      { id: generateId(), label: "Option 1", value: "option_1" },
      { id: generateId(), label: "Option 2", value: "option_2" },
      { id: generateId(), label: "Option 3", value: "option_3" },
    ];
  }

  if (type === "rating") {
    base.maxStars = 5;
  }

  return base;
}

export function createForm(): Form {
  return {
    id: generateId(),
    fields: [],
    settings: { ...DEFAULT_SETTINGS },
    theme: { ...DEFAULT_THEME },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    responses: 0,
    views: 0,
  };
}

function getDefaultLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    short_text: "Your answer",
    long_text: "Your message",
    email: "Email address",
    number: "Number",
    phone: "Phone number",
    url: "Website URL",
    dropdown: "Select an option",
    multiple_choice: "Choose one",
    checkboxes: "Select all that apply",
    rating: "How would you rate this?",
    file_upload: "Upload a file",
    date: "Select a date",
    hidden: "Hidden field",
    heading: "Section Title",
  };
  return labels[type];
}

function getDefaultPlaceholder(type: FieldType): string {
  const placeholders: Record<FieldType, string> = {
    short_text: "Type your answer here...",
    long_text: "Type your message here...",
    email: "name@example.com",
    number: "0",
    phone: "+1 (555) 000-0000",
    url: "https://example.com",
    dropdown: "Choose...",
    multiple_choice: "",
    checkboxes: "",
    rating: "",
    file_upload: "",
    date: "MM/DD/YYYY",
    hidden: "",
    heading: "",
  };
  return placeholders[type];
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getBorderRadiusClass(radius: string): string {
  const map: Record<string, string> = {
    none: "rounded-none",
    small: "rounded",
    medium: "rounded-lg",
    large: "rounded-2xl",
  };
  return map[radius] || "rounded-lg";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function addOption(field: FormField): FieldOption {
  const newOption: FieldOption = {
    id: generateId(),
    label: `Option ${(field.options?.length || 0) + 1}`,
    value: `option_${(field.options?.length || 0) + 1}`,
  };
  return newOption;
}
