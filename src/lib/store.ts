"use client";

import { create } from "zustand";
import { FormField, FormTheme, FormSettings, FieldType } from "./types";
import { createField, generateId } from "./utils";
import { api } from "./api";

export interface FormData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  theme: FormTheme;
  published: boolean;
  views: number;
  responses: number;
  createdAt: string;
  updatedAt: string;
}

interface FormBuilderState {
  currentForm: FormData | null;
  selectedFieldId: string | null;
  previewMode: boolean;
  forms: FormData[];
  loading: boolean;
  saving: boolean;

  // Data fetching
  fetchForms: () => Promise<void>;
  fetchForm: (id: string) => Promise<void>;
  createForm: () => Promise<string | null>;
  deleteForm: (id: string) => Promise<void>;
  duplicateForm: (id: string) => Promise<string | null>;
  saveForm: () => Promise<void>;

  // Field actions
  addField: (type: FieldType) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  selectField: (fieldId: string | null) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;
  duplicateField: (fieldId: string) => void;

  // Form settings
  updateSettings: (settings: Partial<FormSettings>) => void;
  updateTheme: (theme: Partial<FormTheme>) => void;
  togglePublish: () => Promise<void>;
  setPreviewMode: (mode: boolean) => void;
}

// Debounce auto-save
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(get: () => FormBuilderState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    get().saveForm();
  }, 1500);
}

export const useFormStore = create<FormBuilderState>((set, get) => ({
  currentForm: null,
  selectedFieldId: null,
  previewMode: false,
  forms: [],
  loading: false,
  saving: false,

  fetchForms: async () => {
    set({ loading: true });
    try {
      const { forms } = await api.getForms();
      set({ forms, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchForm: async (id: string) => {
    set({ loading: true });
    try {
      const { form } = await api.getForm(id);
      set({ currentForm: form, loading: false, selectedFieldId: null, previewMode: false });
    } catch {
      set({ currentForm: null, loading: false });
    }
  },

  createForm: async () => {
    try {
      const { form } = await api.createForm();
      set({ forms: [form, ...get().forms] });
      return form.id;
    } catch {
      return null;
    }
  },

  deleteForm: async (id: string) => {
    try {
      await api.deleteForm(id);
      set({
        forms: get().forms.filter((f) => f.id !== id),
        currentForm: get().currentForm?.id === id ? null : get().currentForm,
      });
    } catch {
      // ignore
    }
  },

  duplicateForm: async (id: string) => {
    try {
      const { form } = await api.duplicateForm(id);
      await get().fetchForms();
      return form.id;
    } catch {
      return null;
    }
  },

  saveForm: async () => {
    const { currentForm } = get();
    if (!currentForm) return;
    set({ saving: true });
    try {
      await api.updateForm(currentForm.id, {
        title: currentForm.settings.title,
        description: currentForm.settings.description,
        fields: currentForm.fields,
        settings: currentForm.settings,
        theme: currentForm.theme,
      });
    } catch {
      // ignore
    } finally {
      set({ saving: false });
    }
  },

  addField: (type: FieldType) => {
    const { currentForm } = get();
    if (!currentForm) return;
    const field = createField(type);
    set({
      currentForm: {
        ...currentForm,
        fields: [...currentForm.fields, field],
      },
      selectedFieldId: field.id,
    });
    debouncedSave(get);
  },

  removeField: (fieldId: string) => {
    const { currentForm, selectedFieldId } = get();
    if (!currentForm) return;
    set({
      currentForm: {
        ...currentForm,
        fields: currentForm.fields.filter((f) => f.id !== fieldId),
      },
      selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId,
    });
    debouncedSave(get);
  },

  updateField: (fieldId: string, updates: Partial<FormField>) => {
    const { currentForm } = get();
    if (!currentForm) return;
    set({
      currentForm: {
        ...currentForm,
        fields: currentForm.fields.map((f) =>
          f.id === fieldId ? { ...f, ...updates } : f
        ),
      },
    });
    debouncedSave(get);
  },

  selectField: (fieldId: string | null) => {
    set({ selectedFieldId: fieldId });
  },

  reorderFields: (oldIndex: number, newIndex: number) => {
    const { currentForm } = get();
    if (!currentForm) return;
    const fields = [...currentForm.fields];
    const [moved] = fields.splice(oldIndex, 1);
    fields.splice(newIndex, 0, moved);
    set({ currentForm: { ...currentForm, fields } });
    debouncedSave(get);
  },

  duplicateField: (fieldId: string) => {
    const { currentForm } = get();
    if (!currentForm) return;
    const field = currentForm.fields.find((f) => f.id === fieldId);
    if (!field) return;
    const newField: FormField = {
      ...JSON.parse(JSON.stringify(field)),
      id: generateId(),
      label: `${field.label} (Copy)`,
    };
    const index = currentForm.fields.findIndex((f) => f.id === fieldId);
    const fields = [...currentForm.fields];
    fields.splice(index + 1, 0, newField);
    set({ currentForm: { ...currentForm, fields }, selectedFieldId: newField.id });
    debouncedSave(get);
  },

  updateSettings: (settings: Partial<FormSettings>) => {
    const { currentForm } = get();
    if (!currentForm) return;
    set({
      currentForm: {
        ...currentForm,
        settings: { ...currentForm.settings, ...settings },
      },
    });
    debouncedSave(get);
  },

  updateTheme: (theme: Partial<FormTheme>) => {
    const { currentForm } = get();
    if (!currentForm) return;
    set({
      currentForm: {
        ...currentForm,
        theme: { ...currentForm.theme, ...theme },
      },
    });
    debouncedSave(get);
  },

  togglePublish: async () => {
    const { currentForm } = get();
    if (!currentForm) return;
    await get().saveForm();
    try {
      const { form } = await api.publishForm(currentForm.id);
      set({
        currentForm: { ...currentForm, published: form.published, slug: form.slug },
      });
    } catch {
      // ignore
    }
  },

  setPreviewMode: (mode: boolean) => {
    set({ previewMode: mode, selectedFieldId: null });
  },
}));
