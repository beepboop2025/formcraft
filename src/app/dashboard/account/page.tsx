"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft, Zap, Crown, Loader2, LogOut } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  formCount: number;
  createdAt: string;
}

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "bg-gray-100 text-gray-700" },
  pro: { label: "Pro", color: "bg-blue-50 text-blue-700" },
  business: { label: "Business", color: "bg-purple-50 text-purple-700" },
  ltd: { label: "Lifetime Deal", color: "bg-amber-50 text-amber-700" },
};

export default function AccountPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const { user } = await api.getUser();
        setUser(user);
        setName(user.name || "");
      } catch {
        toast.error("Failed to load account");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function handleUpdateName() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.updateUser({ name: name.trim() });
      toast.success("Name updated");
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpgrade(plan: string) {
    try {
      const { url } = await api.createCheckout(plan);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const planInfo = PLAN_LABELS[user?.plan || "free"] || PLAN_LABELS.free;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">Account</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  onClick={handleUpdateName}
                  disabled={saving || name === user?.name}
                  className="btn-primary !py-2 !px-4 !text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Member since</label>
              <p className="text-sm text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Plan</h2>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${planInfo.color}`}>
              <Crown className="h-3 w-3" />
              {planInfo.label}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            {user?.plan === "free" ? (
              <p>You&apos;re on the free plan. Upgrade to unlock unlimited forms, responses, and premium features.</p>
            ) : user?.plan === "ltd" ? (
              <p>You have lifetime access to all features. No monthly fees, ever.</p>
            ) : (
              <p>You have access to all premium features.</p>
            )}
          </div>

          <div className="text-xs text-gray-500 mb-4">
            {user?.formCount || 0} form{(user?.formCount || 0) !== 1 ? "s" : ""} created
            {user?.plan === "free" && " (3 max)"}
          </div>

          {user?.plan === "free" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpgrade("ltd")}
                className="btn-primary !text-sm flex-1"
              >
                <Crown className="h-4 w-4" />
                Get Lifetime Deal — $49
              </button>
              <button
                onClick={() => handleUpgrade("pro")}
                className="btn-ghost !text-sm"
              >
                Pro — $9/mo
              </button>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="card !border-red-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Sign Out</h2>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out of your account
          </button>
        </div>
      </main>
    </div>
  );
}
