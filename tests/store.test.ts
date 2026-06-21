import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock the API module so store actions never hit the network.
vi.mock("@/lib/api", () => ({
  api: {
    getForms: vi.fn().mockResolvedValue({ forms: [] }),
    getForm: vi.fn(),
    createForm: vi.fn(),
    deleteForm: vi.fn().mockResolvedValue({}),
    duplicateForm: vi.fn(),
    publishForm: vi.fn(),
    updateForm: vi.fn().mockResolvedValue({}),
  },
}));

import { useFormStore, FormData } from "@/lib/store";
import { DEFAULT_THEME, DEFAULT_SETTINGS, FormField } from "@/lib/types";

function makeForm(fields: FormField[] = []): FormData {
  return {
    id: "form_1",
    slug: "slug-1",
    title: "Test Form",
    description: "",
    fields,
    settings: { ...DEFAULT_SETTINGS },
    theme: { ...DEFAULT_THEME },
    published: false,
    views: 0,
    responses: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

const initial = useFormStore.getState();

beforeEach(() => {
  vi.useFakeTimers();
  // Reset to a clean, known state before each test.
  useFormStore.setState({
    currentForm: null,
    selectedFieldId: null,
    previewMode: false,
    forms: [],
    loading: false,
    saving: false,
  });
});

afterEach(() => {
  // Flush any pending debounced saves so timers don't bleed across tests.
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("addField", () => {
  it("does nothing when there is no current form", () => {
    initial.addField("short_text");
    expect(useFormStore.getState().currentForm).toBeNull();
  });

  it("appends a field and selects it", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().addField("email");
    const state = useFormStore.getState();
    expect(state.currentForm!.fields).toHaveLength(1);
    expect(state.currentForm!.fields[0].type).toBe("email");
    expect(state.selectedFieldId).toBe(state.currentForm!.fields[0].id);
  });

  it("preserves order across multiple adds", () => {
    useFormStore.setState({ currentForm: makeForm() });
    const s = useFormStore.getState();
    s.addField("short_text");
    s.addField("email");
    s.addField("number");
    expect(
      useFormStore.getState().currentForm!.fields.map((f) => f.type)
    ).toEqual(["short_text", "email", "number"]);
  });
});

describe("removeField", () => {
  it("removes the matching field and clears selection if it was selected", () => {
    const f = makeForm();
    useFormStore.setState({ currentForm: f });
    useFormStore.getState().addField("short_text");
    const id = useFormStore.getState().currentForm!.fields[0].id;
    useFormStore.getState().removeField(id);
    expect(useFormStore.getState().currentForm!.fields).toHaveLength(0);
    expect(useFormStore.getState().selectedFieldId).toBeNull();
  });

  it("keeps selection when a different field is removed", () => {
    useFormStore.setState({ currentForm: makeForm() });
    const s = useFormStore.getState();
    s.addField("short_text");
    s.addField("email");
    const [first, second] = useFormStore.getState().currentForm!.fields;
    useFormStore.getState().selectField(second.id);
    useFormStore.getState().removeField(first.id);
    expect(useFormStore.getState().selectedFieldId).toBe(second.id);
    expect(useFormStore.getState().currentForm!.fields).toHaveLength(1);
  });
});

describe("updateField", () => {
  it("merges updates into only the targeted field", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().addField("short_text");
    const id = useFormStore.getState().currentForm!.fields[0].id;
    useFormStore.getState().updateField(id, { label: "New Label" });
    const field = useFormStore.getState().currentForm!.fields[0];
    expect(field.label).toBe("New Label");
    expect(field.type).toBe("short_text"); // untouched
  });
});

describe("reorderFields", () => {
  it("moves a field from one index to another", () => {
    useFormStore.setState({ currentForm: makeForm() });
    const s = useFormStore.getState();
    s.addField("short_text");
    s.addField("email");
    s.addField("number");
    useFormStore.getState().reorderFields(0, 2);
    expect(
      useFormStore.getState().currentForm!.fields.map((f) => f.type)
    ).toEqual(["email", "number", "short_text"]);
  });
});

describe("duplicateField", () => {
  it("inserts a deep copy right after the original with a new id and (Copy) label", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().addField("dropdown");
    const original = useFormStore.getState().currentForm!.fields[0];
    useFormStore.getState().duplicateField(original.id);

    const fields = useFormStore.getState().currentForm!.fields;
    expect(fields).toHaveLength(2);
    const copy = fields[1];
    expect(copy.id).not.toBe(original.id);
    expect(copy.label).toBe(`${original.label} (Copy)`);
    expect(copy.type).toBe("dropdown");
  });

  it("deep-clones options so editing the copy does not mutate the original", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().addField("dropdown");
    const original = useFormStore.getState().currentForm!.fields[0];
    useFormStore.getState().duplicateField(original.id);

    const [orig, copy] = useFormStore.getState().currentForm!.fields;
    expect(copy.options).not.toBe(orig.options);
    copy.options![0].label = "Mutated";
    expect(orig.options![0].label).toBe("Option 1");
  });

  it("does nothing when the target field id is unknown", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().addField("short_text");
    useFormStore.getState().duplicateField("does-not-exist");
    expect(useFormStore.getState().currentForm!.fields).toHaveLength(1);
  });
});

describe("updateSettings / updateTheme", () => {
  it("merges partial settings without dropping other keys", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().updateSettings({ title: "Renamed" });
    const settings = useFormStore.getState().currentForm!.settings;
    expect(settings.title).toBe("Renamed");
    expect(settings.submitButtonText).toBe(DEFAULT_SETTINGS.submitButtonText);
  });

  it("merges partial theme without dropping other keys", () => {
    useFormStore.setState({ currentForm: makeForm() });
    useFormStore.getState().updateTheme({ primaryColor: "#ff0000" });
    const theme = useFormStore.getState().currentForm!.theme;
    expect(theme.primaryColor).toBe("#ff0000");
    expect(theme.layout).toBe(DEFAULT_THEME.layout);
  });
});

describe("selectField / setPreviewMode", () => {
  it("setPreviewMode clears the current selection", () => {
    useFormStore.setState({ currentForm: makeForm(), selectedFieldId: "x" });
    useFormStore.getState().setPreviewMode(true);
    const state = useFormStore.getState();
    expect(state.previewMode).toBe(true);
    expect(state.selectedFieldId).toBeNull();
  });
});

describe("async data fetching", () => {
  it("fetchForms loads forms and toggles loading off", async () => {
    const { api } = await import("@/lib/api");
    (api.getForms as any).mockResolvedValueOnce({ forms: [makeForm()] });
    await useFormStore.getState().fetchForms();
    const state = useFormStore.getState();
    expect(state.forms).toHaveLength(1);
    expect(state.loading).toBe(false);
  });

  it("fetchForms swallows errors and still clears loading", async () => {
    const { api } = await import("@/lib/api");
    (api.getForms as any).mockRejectedValueOnce(new Error("network"));
    await useFormStore.getState().fetchForms();
    expect(useFormStore.getState().loading).toBe(false);
  });

  it("fetchForm sets currentForm and resets selection + preview", async () => {
    const { api } = await import("@/lib/api");
    (api.getForm as any).mockResolvedValueOnce({ form: makeForm() });
    useFormStore.setState({ selectedFieldId: "x", previewMode: true });
    await useFormStore.getState().fetchForm("form_1");
    const state = useFormStore.getState();
    expect(state.currentForm!.id).toBe("form_1");
    expect(state.selectedFieldId).toBeNull();
    expect(state.previewMode).toBe(false);
  });

  it("fetchForm nulls currentForm on error", async () => {
    const { api } = await import("@/lib/api");
    (api.getForm as any).mockRejectedValueOnce(new Error("404"));
    await useFormStore.getState().fetchForm("missing");
    expect(useFormStore.getState().currentForm).toBeNull();
  });

  it("createForm prepends the new form and returns its id", async () => {
    const { api } = await import("@/lib/api");
    const existing = { ...makeForm(), id: "old" };
    useFormStore.setState({ forms: [existing] });
    (api.createForm as any).mockResolvedValueOnce({ form: { ...makeForm(), id: "new" } });
    const id = await useFormStore.getState().createForm();
    expect(id).toBe("new");
    expect(useFormStore.getState().forms.map((f) => f.id)).toEqual(["new", "old"]);
  });

  it("createForm returns null on failure without mutating the list", async () => {
    const { api } = await import("@/lib/api");
    useFormStore.setState({ forms: [makeForm()] });
    (api.createForm as any).mockRejectedValueOnce(new Error("boom"));
    const id = await useFormStore.getState().createForm();
    expect(id).toBeNull();
    expect(useFormStore.getState().forms).toHaveLength(1);
  });

  it("duplicateForm re-fetches the list and returns the new id", async () => {
    const { api } = await import("@/lib/api");
    (api.duplicateForm as any).mockResolvedValueOnce({ form: { id: "dup" } });
    (api.getForms as any).mockResolvedValueOnce({ forms: [{ ...makeForm(), id: "dup" }] });
    const id = await useFormStore.getState().duplicateForm("form_1");
    expect(id).toBe("dup");
    expect(api.getForms).toHaveBeenCalled();
  });

  it("togglePublish saves then applies the returned published flag and slug", async () => {
    const { api } = await import("@/lib/api");
    useFormStore.setState({ currentForm: makeForm() });
    (api.publishForm as any).mockResolvedValueOnce({
      form: { published: true, slug: "live-slug" },
    });
    await useFormStore.getState().togglePublish();
    const cf = useFormStore.getState().currentForm!;
    expect(api.updateForm).toHaveBeenCalled(); // saved first
    expect(cf.published).toBe(true);
    expect(cf.slug).toBe("live-slug");
  });
});

describe("deleteForm", () => {
  it("removes the form from the list and nulls currentForm if it was active", async () => {
    const a = makeForm();
    const b = { ...makeForm(), id: "form_2" };
    useFormStore.setState({ forms: [a, b], currentForm: a });
    await useFormStore.getState().deleteForm("form_1");
    const state = useFormStore.getState();
    expect(state.forms.map((f) => f.id)).toEqual(["form_2"]);
    expect(state.currentForm).toBeNull();
  });

  it("keeps a different active form intact when deleting another", async () => {
    const a = makeForm();
    const b = { ...makeForm(), id: "form_2" };
    useFormStore.setState({ forms: [a, b], currentForm: b });
    await useFormStore.getState().deleteForm("form_1");
    expect(useFormStore.getState().currentForm!.id).toBe("form_2");
  });
});
