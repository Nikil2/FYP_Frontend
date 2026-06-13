"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Bell,
  BellOff,
  Calendar,
  Tag,
  Star,
  Info,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/api/services/notifications";
import { socketClient } from "@/lib/socket";

function getNotificationIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("booking") || t.includes("order"))
    return { icon: Calendar, bg: "bg-blue-50", color: "text-blue-600" };
  if (t.includes("promo") || t.includes("offer"))
    return { icon: Tag, bg: "bg-tertiary/10", color: "text-tertiary" };
  if (t.includes("review") || t.includes("rating"))
    return { icon: Star, bg: "bg-amber-50", color: "text-amber-600" };
  if (t.includes("complaint") || t.includes("dispute"))
    return { icon: Info, bg: "bg-orange-50", color: "text-orange-600" };
  return { icon: Bell, bg: "bg-gray-100", color: "text-gray-600" };
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNotifications(0, 50);
      const notifList = Array.isArray(result) ? result : (result.data || []);
      setNotifications(notifList);
    } catch {
      setNotifications([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
    const unsub = socketClient.onNotification((notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return unsub;
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* skip */ }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch { /* skip */ }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/customer")}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors md:hidden"
          >
            <ChevronLeft className="w-5 h-5 text-heading" />
          </button>
          <h1 className="text-lg font-semibold text-heading">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-white bg-tertiary px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs text-tertiary font-medium"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4 bg-white">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const { icon: Icon, bg, color } = getNotificationIcon(notification.title);

            return (
              <button
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkRead(notification.id);
                  }
                }}
                className={cn(
                  "w-full text-left flex items-start gap-3 px-4 py-4 transition-colors",
                  !notification.isRead
                    ? "bg-tertiary/5"
                    : "bg-white hover:bg-gray-50"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    bg
                  )}
                >
                  <Icon className={cn("w-5 h-5", color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        "text-sm leading-tight",
                        !notification.isRead
                          ? "font-bold text-heading"
                          : "font-medium text-heading"
                      )}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BellOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-base font-semibold text-heading mb-1">
            No Notifications
          </h2>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            You&apos;re all caught up! New notifications will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
