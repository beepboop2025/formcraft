const BASE = "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Auth
export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  // Forms
  getForms: () => request<{ forms: any[] }>("/api/forms"),

  createForm: () =>
    request<{ form: any }>("/api/forms", { method: "POST" }),

  getForm: (id: string) => request<{ form: any }>(`/api/forms/${id}`),

  updateForm: (id: string, data: any) =>
    request<{ form: any }>(`/api/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteForm: (id: string) =>
    request(`/api/forms/${id}`, { method: "DELETE" }),

  publishForm: (id: string) =>
    request<{ form: any }>(`/api/forms/${id}/publish`, { method: "POST" }),

  duplicateForm: (id: string) =>
    request<{ form: any }>(`/api/forms/${id}/duplicate`, { method: "POST" }),

  // Public form (no auth required)
  getPublicForm: (slug: string) =>
    request<{ form: any }>(`/api/forms/${slug}?public=true`),

  // Responses
  getResponses: (formId: string) =>
    request<{ responses: any[]; total: number }>(`/api/forms/${formId}/responses`),

  submitResponse: (formId: string, data: Record<string, unknown>) =>
    request(`/api/forms/${formId}/responses`, {
      method: "POST",
      body: JSON.stringify({ data }),
    }),

  // Stripe
  createCheckout: (plan: string) =>
    request<{ url: string }>("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),

  // User
  getUser: () => request<{ user: any }>("/api/user"),

  updateUser: (data: { name?: string }) =>
    request<{ user: any }>("/api/user", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
