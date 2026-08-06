"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Plus, Zap, Search, LayoutGrid, LogOut, User, Loader2, Settings } from "lucide-react";
import { useFormStore } from "@/lib/store";
import FormCard from "@/components/dashboard/FormCard";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { forms, loading, fetchForms, createForm, deleteForm, duplicateForm } = useFormStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  async function handleCreateForm() {
    setCreating(true);
    const id = await createForm();
    if (id) {
      router.push(`/builder/${id}`);
    } else {
      toast.error("Failed to create form. You may have reached your plan limit.");
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteForm(id);
    toast.success("Form deleted");
  }

  async function handleDuplicate(id: string) {
    const newId = await duplicateForm(id);
    if (newId) {
      toast.success("Form duplicated");
    }
  }

  const filteredForms = forms.filter((f) =>
    (f.title || f.settings?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">Formary</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateForm}
                disabled={creating}
                className="btn-primary !py-2 !px-4 !text-sm"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                New Form
              </button>

              {/* User menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors">
                  <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() || <User className="h-3.5 w-3.5" />}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-3 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/account"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    Account Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 text-gray-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
            <p className="text-sm text-gray-500 mt-1">
              {forms.length} form{forms.length !== 1 ? "s" : ""} created
            </p>
          </div>

          {forms.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field !pl-10"
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-2xl bg-brand-50 p-6">
              <LayoutGrid className="h-10 w-10 text-brand-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create your first form</h2>
            <p className="text-sm text-gray-500 max-w-sm mb-8">
              Add fields with the drag-and-drop editor, configure the form, and publish when ready.
            </p>
            <button onClick={handleCreateForm} disabled={creating} className="btn-primary">
              <Plus className="h-4 w-4" />
              Create New Form
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={handleCreateForm}
              disabled={creating}
              className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all hover:border-brand-300 hover:bg-brand-50/30 group"
            >
              <div className="rounded-xl bg-gray-100 p-3 group-hover:bg-brand-100 transition-colors">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-brand-600" />
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-brand-700">New Form</span>
            </button>

            {filteredForms
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((form) => (
                <FormCard key={form.id} form={form} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
