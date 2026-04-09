"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  payload: Record<string, any> | null;
  read: boolean;
  relatedId: string | null;
  relatedType: string | null;
  createdAt: string;
}

type NotificationFilter = "all" | "unread" | "messages" | "jobs";

export default function NotificationsPage() {
  const { authUser, isSignedIn } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  // Notification preferences
  const [prefs, setPrefs] = useState<{
    notifyJobEmail: boolean;
    notifyJobInApp: boolean;
    notifyMessageEmail: boolean;
    notifyMessageInApp: boolean;
    notifyMarketingEmail: boolean;
  } | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const prefsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const getCategory = (notification: AppNotification): "messages" | "jobs" | "other" => {
    const type = notification.type.toUpperCase();

    if (type.includes("MESSAGE")) {
      return "messages";
    }

    if (type.includes("JOB") || type.includes("LEAD") || type.includes("QUOTE")) {
      return "jobs";
    }

    return "other";
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.read);
    }

    return notifications.filter((notification) => getCategory(notification) === activeFilter);
  }, [notifications, activeFilter]);

  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    const groups: Record<"Today" | "Yesterday" | "Earlier", AppNotification[]> = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredNotifications.forEach((notification) => {
      const notificationDate = new Date(notification.createdAt);

      if (notificationDate >= todayStart) {
        groups.Today.push(notification);
      } else if (notificationDate >= yesterdayStart) {
        groups.Yesterday.push(notification);
      } else {
        groups.Earlier.push(notification);
      }
    });

    return groups;
  }, [filteredNotifications]);

  useEffect(() => {
    if (isSignedIn && authUser?.id) {
      fetchNotifications();
      fetchPrefs();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, authUser?.id]);

  const fetchPrefs = async () => {
    if (!authUser?.id) return;
    try {
      const res = await fetch(`/api/notifications/settings?userId=${authUser.id}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.error) setPrefs(data);
      }
    } catch {}
  };

  const updatePref = (key: string, value: boolean) => {
    if (!authUser?.id || !prefs) return;
    setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev));
    if (prefsTimerRef.current) clearTimeout(prefsTimerRef.current);
    prefsTimerRef.current = setTimeout(async () => {
      setSavingPrefs(true);
      try {
        await fetch('/api/notifications/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authUser.id, [key]: value }),
        });
        setPrefsSaved(true);
        setTimeout(() => setPrefsSaved(false), 2000);
      } catch {}
      finally { setSavingPrefs(false); }
    }, 400);
  };

  const fetchNotifications = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?userId=${authUser.id}`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markOneAsRead = async (notificationId: string) => {
    if (!authUser?.id) return;

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authUser.id, notificationId }),
      });

      if (!response.ok) return;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!authUser?.id) return;

    try {
      setMarkingAll(true);
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authUser.id, markAllAsRead: true }),
      });

      if (!response.ok) return;

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      // Dispatch event so MobileBottomNav badge clears immediately
      window.dispatchEvent(new CustomEvent('notifications:allRead'));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const getTargetUrl = (notification: AppNotification) => {
    const payload = notification.payload || {};

    if (payload.threadId) {
      return `/messages?threadId=${payload.threadId}`;
    }

    if (payload.conversationId) {
      return `/messages?conversationId=${payload.conversationId}`;
    }

    if (payload.leadId) {
      return `/messages?leadId=${payload.leadId}`;
    }

    if (payload.jobId) {
      return `/contractor/jobs?highlight=${payload.jobId}`;
    }

    if (notification.relatedType === "conversation" && notification.relatedId) {
      return `/messages?conversationId=${notification.relatedId}`;
    }

    if (notification.relatedType === "job" && notification.relatedId) {
      return `/contractor/jobs?highlight=${notification.relatedId}`;
    }

    return "/notifications";
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
          <p className="text-gray-600 mt-2 mb-6">Please sign in to view your notifications.</p>
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
            <p className="text-gray-600 mt-1">Your notifications and alert preferences.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {markingAll ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {([
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "messages", label: "Messages" },
            { key: "jobs", label: "Jobs" },
          ] as { key: NotificationFilter; label: string }[]).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                activeFilter === filter.key
                  ? "bg-rose-700 text-white border-rose-700"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔔</div>
              <p className="font-semibold text-gray-900 mb-1">No notifications yet</p>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                When new matching homeowner jobs are posted, you&apos;ll see them here instantly.
                Keep your email alerts on for first pick.
              </p>
              <button
                onClick={() => document.getElementById('alert-settings')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-block mt-4 text-sm text-rose-700 font-semibold hover:underline"
              >
                Manage alert preferences ↓
              </button>
            </div>
          ) : (
            <div>
              {(["Today", "Yesterday", "Earlier"] as const).map((groupName) => {
                const groupItems = groupedNotifications[groupName];
                if (groupItems.length === 0) {
                  return null;
                }

                return (
                  <div key={groupName}>
                    <div className="px-5 py-3 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-600">
                      {groupName}
                    </div>
                    <ul>
                      {groupItems.map((notification) => (
                        <li
                          key={notification.id}
                          className={`border-b border-gray-100 last:border-b-0 ${!notification.read ? "bg-rose-50" : "bg-white"}`}
                        >
                          <Link
                            href={getTargetUrl(notification)}
                            onClick={() => {
                              if (!notification.read) {
                                markOneAsRead(notification.id);
                              }
                            }}
                            className="block px-5 py-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>

                              {!notification.read && (
                                <span className="inline-flex mt-1 h-2.5 w-2.5 rounded-full bg-rose-600" />
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alert Preferences — inside the same centered container */}
        <div id="alert-settings" className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Alert Preferences</h2>
            <span className={`text-xs font-medium transition-opacity ${savingPrefs ? 'text-gray-400 opacity-100' : prefsSaved ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
              {savingPrefs ? 'Saving…' : 'Saved ✓'}
            </span>
          </div>
          {!prefs ? (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-400">Loading preferences…</div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-3">Job Alerts</p>
                <div className="space-y-3">
                  <PrefRow label="Email me new matching jobs" checked={prefs.notifyJobEmail} onChange={(v) => updatePref('notifyJobEmail', v)} />
                  <PrefRow label="Show in-app job alerts" checked={prefs.notifyJobInApp} onChange={(v) => updatePref('notifyJobInApp', v)} />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-3">Message Alerts</p>
                <div className="space-y-3">
                  <PrefRow label="Email me new messages" checked={prefs.notifyMessageEmail} onChange={(v) => updatePref('notifyMessageEmail', v)} />
                  <PrefRow label="Show in-app message alerts" checked={prefs.notifyMessageInApp} onChange={(v) => updatePref('notifyMessageInApp', v)} />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2">Marketing</p>
                <PrefRow label="Platform tips & updates (email)" checked={prefs.notifyMarketingEmail} onChange={(v) => updatePref('notifyMarketingEmail', v)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrefRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? 'bg-rose-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
