export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "phone"
  | "dropdown"
  | "multiple_choice"
  | "checkboxes"
  | "file_upload"
  | "date"
  | "rating"
  | "heading"
  | "url"
  | "hidden";

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customError?: string;
}

export interface ConditionalRule {
  fieldId: string;
  operator: "equals" | "not_equals" | "contains" | "not_empty" | "empty";
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
  conditionalLogic?: ConditionalRule;
  defaultValue?: string;
  maxStars?: number; // for rating field
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: "none" | "small" | "medium" | "large";
  layout: "standard" | "card" | "conversational";
}

export interface FormSettings {
  title: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  notifyEmail?: string;
  closeDate?: string;
  responseLimit?: number;
  allowMultipleSubmissions: boolean;
}

export interface Form {
  id: string;
  fields: FormField[];
  settings: FormSettings;
  theme: FormTheme;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  responses: number;
  views: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: string;
  metadata: {
    userAgent?: string;
    referrer?: string;
    ip?: string;
  };
}

export const FIELD_TYPE_CONFIG: Record<
  FieldType,
  { label: string; icon: string; category: "input" | "choice" | "layout" | "advanced" }
> = {
  short_text: { label: "Short Text", icon: "Type", category: "input" },
  long_text: { label: "Long Text", icon: "AlignLeft", category: "input" },
  email: { label: "Email", icon: "Mail", category: "input" },
  number: { label: "Number", icon: "Hash", category: "input" },
  phone: { label: "Phone", icon: "Phone", category: "input" },
  url: { label: "URL", icon: "Link", category: "input" },
  dropdown: { label: "Dropdown", icon: "ChevronDown", category: "choice" },
  multiple_choice: { label: "Multiple Choice", icon: "CircleDot", category: "choice" },
  checkboxes: { label: "Checkboxes", icon: "CheckSquare", category: "choice" },
  rating: { label: "Rating", icon: "Star", category: "choice" },
  file_upload: { label: "File Upload", icon: "Upload", category: "advanced" },
  date: { label: "Date", icon: "Calendar", category: "advanced" },
  hidden: { label: "Hidden Field", icon: "EyeOff", category: "advanced" },
  heading: { label: "Heading", icon: "Heading", category: "layout" },
};

export const DEFAULT_THEME: FormTheme = {
  primaryColor: "#4c6ef5",
  backgroundColor: "#ffffff",
  textColor: "#1a1a2e",
  fontFamily: "Inter",
  borderRadius: "medium",
  layout: "standard",
};

export const DEFAULT_SETTINGS: FormSettings = {
  title: "Untitled Form",
  description: "",
  submitButtonText: "Submit",
  successMessage: "Thank you! Your response has been recorded.",
  allowMultipleSubmissions: false,
};
