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
        className="relative p-2.5 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1.5 shadow-md">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[500px] overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-rose-50 to-orange-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-rose-600 hover:text-rose-700 font-semibold hover:bg-white px-3 py-1 rounded-lg transition-all"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="px-3 py-3 bg-white flex flex-wrap gap-2">
            {([
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "messages", label: "Messages" },
              { key: "jobs", label: "Jobs" },
            ] as { key: NotificationFilter; label: string }[]).map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === filter.key
                    ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="font-medium">No notifications</p>
              </div>
            ) : (
              (["Today", "Yesterday", "Earlier"] as const).map((groupName) => {
                const groupItems = groupedNotifications[groupName];
                if (groupItems.length === 0) return null;

                return (
                  <div key={groupName}>
                    <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-700">
                      {groupName}
                    </div>
                    {groupItems.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-rose-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                          !notification.read ? "bg-rose-50/50" : "bg-white"
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
            <div className="px-4 py-3 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/notifications";
                }}
                className="w-full text-center text-sm text-rose-600 hover:text-white hover:bg-gradient-to-r hover:from-rose-600 hover:to-orange-600 font-bold py-2 rounded-lg transition-all"
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
