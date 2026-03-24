"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { Bell, Mail, Smartphone, ArrowLeft, Loader2 } from "lucide-react";

interface NotificationPrefs {
  notifyJobEmail: boolean;
  notifyJobInApp: boolean;
  notifyMessageEmail: boolean;
  notifyMessageInApp: boolean;
  notifyMarketingEmail: boolean;
}

export default function ContractorSettingsPage() {
  const { authUser, isSignedIn } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingPrefsRef = useRef<Partial<NotificationPrefs>>({});
  const confirmedPrefsRef = useRef<NotificationPrefs | null>(null);

  useEffect(() => {
    if (isSignedIn && authUser?.id) {
      fetch(`/api/notifications/settings?userId=${authUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setPrefs(data);
            confirmedPrefsRef.current = data;
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isSignedIn, authUser?.id]);

  const updatePref = (key: keyof NotificationPrefs, value: boolean) => {
    if (!authUser?.id) return;

    // Update UI immediately (optimistic)
    setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);

    // Accumulate changes since last confirmed save
    pendingPrefsRef.current = { ...pendingPrefsRef.current, [key]: value };

    // Cancel any pending flush
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // Flush after 300 ms of no further toggles
    debounceTimerRef.current = setTimeout(async () => {
      const changes = pendingPrefsRef.current;
      pendingPrefsRef.current = {};

      // Cancel any still-in-flight request
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setSaving(true);
      try {
        const res = await fetch("/api/notifications/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: authUser.id, ...changes }),
          signal: controller.signal,
        });

        if (!res.ok) {
          // Revert UI to last confirmed state
          if (confirmedPrefsRef.current) setPrefs(confirmedPrefsRef.current);
        } else {
          // Advance confirmed baseline
          if (confirmedPrefsRef.current) {
            confirmedPrefsRef.current = { ...confirmedPrefsRef.current, ...changes };
          }
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch (err: any) {
        if (err.name !== "AbortError" && confirmedPrefsRef.current) {
          setPrefs(confirmedPrefsRef.current);
        }
      } finally {
        setSaving(false);
      }
    }, 300);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
          <p className="text-gray-600 mt-2 mb-6">Please sign in to manage your settings.</p>
          <Link
            href="/sign-in"
            className="inline-block bg-gradient-to-r from-rose-700 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/contractor/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-rose-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-1">Notification Settings</h1>
        <p className="text-gray-600 mb-8">
          Control how and when you receive alerts about new jobs and messages.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
          </div>
        ) : !prefs ? (
          <div className="text-center py-12 text-gray-500">
            Unable to load settings. Please try again.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Job Alerts */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Job Alerts</h2>
                  <p className="text-sm text-gray-500">
                    Get notified when homeowners post matching jobs
                  </p>
                </div>
              </div>

              <div className="space-y-4 pl-1">
                <ToggleRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email notifications"
                  description="Receive an email for every new matching job"
                  helperText="Want first pick on new jobs? Keep this on."
                  checked={prefs.notifyJobEmail}
                  onChange={(v) => updatePref("notifyJobEmail", v)}
                />
                <ToggleRow
                  icon={<Smartphone className="w-4 h-4" />}
                  label="In-app notifications"
                  description="See new jobs in your notification bell"
                  checked={prefs.notifyJobInApp}
                  onChange={(v) => updatePref("notifyJobInApp", v)}
                />
              </div>
            </div>

            {/* Message Alerts */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Message Alerts</h2>
                  <p className="text-sm text-gray-500">
                    Get notified when homeowners message you
                  </p>
                </div>
              </div>

              <div className="space-y-4 pl-1">
                <ToggleRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email notifications"
                  description="Receive an email when you get a new message"
                  checked={prefs.notifyMessageEmail}
                  onChange={(v) => updatePref("notifyMessageEmail", v)}
                />
                <ToggleRow
                  icon={<Smartphone className="w-4 h-4" />}
                  label="In-app notifications"
                  description="See new messages in your notification bell"
                  checked={prefs.notifyMessageInApp}
                  onChange={(v) => updatePref("notifyMessageInApp", v)}
                />
              </div>
            </div>

            {/* Marketing */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Marketing &amp; Tips</h2>
                  <p className="text-sm text-gray-500">
                    Platform tips, feature updates, and promotions
                  </p>
                </div>
              </div>

              <div className="space-y-4 pl-1">
                <ToggleRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Marketing emails"
                  description="Occasional tips to grow your contracting business"
                  checked={prefs.notifyMarketingEmail}
                  onChange={(v) => updatePref("notifyMarketingEmail", v)}
                />
              </div>
            </div>

            {/* Save indicator */}
            {saved && (
              <p className="text-sm text-green-600 font-medium text-center">
                Settings saved
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  helperText,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  helperText?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="mt-0.5 text-gray-400">{icon}</span>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
          {helperText && (
            <p className="text-xs text-rose-600 mt-0.5">{helperText}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? "bg-rose-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
