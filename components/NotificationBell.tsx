"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface Notification {
  id: string;
  type: string;
  payload: any;
  relatedId?: string | null;
  relatedType?: string | null;
  read: boolean;
  createdAt: string;
}

type NotificationFilter = "all" | "unread" | "messages" | "jobs";

export default function NotificationBell() {
  const { authUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  useEffect(() => {
    if (!authUser?.id) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [authUser?.id]);

  const fetchNotifications = async () => {
    if (!authUser?.id) return;

    try {
      const response = await fetch(`/api/notifications?userId=${authUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!authUser?.id) return;

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, userId: authUser.id }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!authUser?.id) return;

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true, userId: authUser.id }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "JOB_CLAIMED":
        return "🎉";
      case "NEW_MESSAGE":
        return "💬";
      case "PAYMENT_RECEIVED":
        return "💰";
      case "PAYMENT_FAILED":
        return "❌";
      case "LEAD_MATCHED":
        return "🔧";
      case "WELCOME":
        return "👋";
      default:
        return "📢";
    }
  };

  const getNotificationTitle = (notification: Notification) => {
    const { type, payload } = notification;
    switch (type) {
      case "JOB_CLAIMED":
        return `Job Claimed: ${payload?.title || "Your Project"}`;
      case "NEW_MESSAGE":
        return `New Message from ${payload?.senderName || "User"}`;
      case "PAYMENT_RECEIVED":
        return `Payment Received: $${payload?.amount}`;
      case "PAYMENT_FAILED":
        return "Payment Failed";
      case "LEAD_MATCHED":
        return `New Lead: ${payload?.title || "Home Project"}`;
      case "WELCOME":
        return "Welcome to QuoteXbert!";
      default:
        return "Notification";
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const { type, payload } = notification;
    switch (type) {
      case "JOB_CLAIMED":
        return `${payload?.contractorName || "A contractor"} has claimed your job.`;
      case "NEW_MESSAGE":
        return payload?.message || "You have a new message.";
      case "PAYMENT_RECEIVED":
        return "Your payment has been processed successfully.";
      case "PAYMENT_FAILED":
        return "There was an issue processing your payment.";
      case "LEAD_MATCHED":
        return `New lead in ${payload?.location || "your area"}.`;
      case "WELCOME":
        return "Thanks for joining! Complete your profile to get started.";
      default:
        return "You have a new notification.";
    }
  };

  const getNotificationActionUrl = (notification: Notification) => {
    const payload = notification.payload || {};

    if (payload.threadId) return `/messages?threadId=${payload.threadId}`;
    if (payload.conversationId) return `/messages?conversationId=${payload.conversationId}`;
    if (payload.leadId) return `/messages?leadId=${payload.leadId}`;
    if (payload.jobId) return "/contractor/jobs";

    if (notification.relatedType === "conversation" && notification.relatedId) {
      return `/messages?conversationId=${notification.relatedId}`;
    }

    if (notification.relatedType === "job" && notification.relatedId) {
      return "/contractor/jobs";
    }

    return "/notifications";
  };

  const getCategory = (notification: Notification): "messages" | "jobs" | "other" => {
    const type = notification.type.toUpperCase();
    if (type.includes("MESSAGE")) return "messages";
    if (type.includes("JOB") || type.includes("LEAD") || type.includes("QUOTE")) return "jobs";
    return "other";
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") return notifications.filter((notification) => !notification.read);
    return notifications.filter((notification) => getCategory(notification) === activeFilter);
  }, [notifications, activeFilter]);

  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    const groups: Record<"Today" | "Yesterday" | "Earlier", Notification[]> = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredNotifications.forEach((notification) => {
      const notificationDate = new Date(notification.createdAt);

      if (notificationDate >= todayStart) groups.Today.push(notification);
      else if (notificationDate >= yesterdayStart) groups.Yesterday.push(notification);
      else groups.Earlier.push(notification);
    });

    return groups;
  }, [filteredNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    const targetUrl = getNotificationActionUrl(notification);
    setIsOpen(false);
    window.location.href = targetUrl;
  };

  if (!authUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM8 18v-1a6 6 0 1112 0v1"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="px-3 py-2 border-b border-gray-100 flex flex-wrap gap-1.5">
            {([
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "messages", label: "Messages" },
              { key: "jobs", label: "Jobs" },
            ] as { key: NotificationFilter; label: string }[]).map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
                  activeFilter === filter.key
                    ? "bg-rose-700 text-white border-rose-700"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              (["Today", "Yesterday", "Earlier"] as const).map((groupName) => {
                const groupItems = groupedNotifications[groupName];
                if (groupItems.length === 0) return null;

                return (
                  <div key={groupName}>
                    <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                      {groupName}
                    </div>
                    {groupItems.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-red-50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                                {getNotificationTitle(notification)}
                              </p>
                              {!notification.read && <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 ml-2"></div>}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{getNotificationMessage(notification)}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/notifications";
                }}
                className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
