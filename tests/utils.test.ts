import { describe, it, expect } from "vitest";
import {
  generateId,
  createField,
  createForm,
  cn,
  getBorderRadiusClass,
  formatDate,
  formatNumber,
  addOption,
} from "@/lib/utils";
import { DEFAULT_THEME, DEFAULT_SETTINGS, FieldType } from "@/lib/types";

describe("generateId", () => {
  it("produces a 10-character id", () => {
    expect(generateId()).toHaveLength(10);
  });

  it("produces unique ids across calls", () => {
    const ids = new Set(Array.from({ length: 500 }, () => generateId()));
    expect(ids.size).toBe(500);
  });

  it("only uses url-safe nanoid characters", () => {
    expect(generateId()).toMatch(/^[A-Za-z0-9_-]{10}$/);
  });
});

describe("createField", () => {
  it("sets a non-required validation default", () => {
    const f = createField("short_text");
    expect(f.validation).toEqual({ required: false });
  });

  it("assigns a unique id and the requested type", () => {
    const f = createField("email");
    expect(f.type).toBe("email");
    expect(f.id).toHaveLength(10);
  });

  it("gives type-specific default labels and placeholders", () => {
    expect(createField("email").label).toBe("Email address");
    expect(createField("email").placeholder).toBe("name@example.com");
    expect(createField("phone").placeholder).toBe("+1 (555) 000-0000");
    expect(createField("heading").label).toBe("Section Title");
  });

  it("seeds three options only for choice field types", () => {
    for (const t of ["dropdown", "multiple_choice", "checkboxes"] as FieldType[]) {
      const f = createField(t);
      expect(f.options).toHaveLength(3);
      expect(f.options!.map((o) => o.value)).toEqual([
        "option_1",
        "option_2",
        "option_3",
      ]);
    }
  });

  it("gives unique ids to each seeded option", () => {
    const opts = createField("dropdown").options!;
    const ids = new Set(opts.map((o) => o.id));
    expect(ids.size).toBe(3);
  });

  it("does not attach options to non-choice fields", () => {
    expect(createField("short_text").options).toBeUndefined();
    expect(createField("rating").options).toBeUndefined();
  });

  it("sets maxStars=5 only for rating fields", () => {
    expect(createField("rating").maxStars).toBe(5);
    expect(createField("short_text").maxStars).toBeUndefined();
  });
});

describe("createForm", () => {
  it("starts empty, unpublished, with zeroed counters", () => {
    const form = createForm();
    expect(form.fields).toEqual([]);
    expect(form.published).toBe(false);
    expect(form.responses).toBe(0);
    expect(form.views).toBe(0);
  });

  it("clones the default theme and settings rather than sharing references", () => {
    const form = createForm();
    expect(form.theme).toEqual(DEFAULT_THEME);
    expect(form.settings).toEqual(DEFAULT_SETTINGS);
    expect(form.theme).not.toBe(DEFAULT_THEME);
    expect(form.settings).not.toBe(DEFAULT_SETTINGS);
  });

  it("mutating a created form's theme does not corrupt the shared default", () => {
    const form = createForm();
    form.theme.primaryColor = "#000000";
    expect(DEFAULT_THEME.primaryColor).toBe("#4c6ef5");
  });

  it("stamps ISO timestamps", () => {
    const form = createForm();
    expect(() => new Date(form.createdAt).toISOString()).not.toThrow();
    expect(form.createdAt).toBe(new Date(form.createdAt).toISOString());
  });
});

describe("cn", () => {
  it("joins truthy class names with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("getBorderRadiusClass", () => {
  it("maps known radius keys", () => {
    expect(getBorderRadiusClass("none")).toBe("rounded-none");
    expect(getBorderRadiusClass("small")).toBe("rounded");
    expect(getBorderRadiusClass("medium")).toBe("rounded-lg");
    expect(getBorderRadiusClass("large")).toBe("rounded-2xl");
  });

  it("falls back to rounded-lg for unknown keys", () => {
    expect(getBorderRadiusClass("gigantic")).toBe("rounded-lg");
    expect(getBorderRadiusClass("")).toBe("rounded-lg");
  });
});

describe("formatNumber", () => {
  it("leaves values under 1000 untouched", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
  });

  it("abbreviates thousands with K", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(999999)).toBe("1000.0K");
  });

  it("abbreviates millions with M", () => {
    expect(formatNumber(1000000)).toBe("1.0M");
    expect(formatNumber(2500000)).toBe("2.5M");
  });

  it("crosses the 1000 boundary exactly at 1000", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(1000)).toBe("1.0K");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as 'Mon D, YYYY'", () => {
    expect(formatDate("2026-06-21T00:00:00.000Z")).toMatch(
      /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/
    );
  });

  it("includes the correct year", () => {
    expect(formatDate("2024-01-15T12:00:00.000Z")).toContain("2024");
  });
});

describe("addOption", () => {
  it("numbers the next option based on existing count", () => {
    const field = createField("dropdown"); // 3 options
    const opt = addOption(field);
    expect(opt.label).toBe("Option 4");
    expect(opt.value).toBe("option_4");
  });

  it("starts at 1 when there are no options", () => {
    const field = createField("short_text"); // no options
    const opt = addOption(field);
    expect(opt.label).toBe("Option 1");
    expect(opt.value).toBe("option_1");
  });

  it("assigns a fresh id", () => {
    const opt = addOption(createField("dropdown"));
    expect(opt.id).toHaveLength(10);
  });
});
