"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, MessageSquare, Calendar, Star, Info, Tag, Clock, CheckCheck,
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
  const t = (title || "").toLowerCase();
  if (t.includes("message") || t.includes("chat"))
    return { icon: MessageSquare, bg: "bg-purple-50", color: "text-purple-600" };
  if (t.includes("booking") || t.includes("order"))
    return { icon: Calendar, bg: "bg-blue-50", color: "text-blue-600" };
  if (t.includes("review") || t.includes("rating"))
    return { icon: Star, bg: "bg-amber-50", color: "text-amber-600" };
  if (t.includes("promo") || t.includes("offer"))
    return { icon: Tag, bg: "bg-tertiary/10", color: "text-tertiary" };
  if (t.includes("complaint") || t.includes("dispute"))
    return { icon: Info, bg: "bg-orange-50", color: "text-orange-600" };
  return { icon: Bell, bg: "bg-gray-100", color: "text-gray-600" };
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - new Date(dateStr).getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function NotificationBell() {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getNotifications(0, 20);
        const list = Array.isArray(result) ? result : (result.data || []);
        setNotifications(list);
      } catch { /* skip */ }
    };
    load();

    if (!socketClient.isConnected()) socketClient.connect();
    const unsub = socketClient.onNotification((notification: Notification) => {
      setNotifications((prev) =>
        prev.find((n) => n.id === notification.id) ? prev : [notification, ...prev]
      );
    });
    return unsub;
  }, []);

  // Clear unread when on notifications page
  useEffect(() => {
    if (pathname?.startsWith("/customer/notifications")) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch { /* skip */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* skip */ }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-heading" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50">
            <h3 className="font-bold text-heading text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-tertiary font-medium hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => {
                const { icon: Icon, bg, color } = getNotificationIcon(notif.title);
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      !notif.isRead && "bg-tertiary/5"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", bg)}>
                      <Icon className={cn("w-4 h-4", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", notif.isRead ? "text-paragraph" : "text-heading font-semibold")}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0 mt-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-gray-50">
            <button
              onClick={() => { setShowDropdown(false); router.push("/customer/notifications"); }}
              className="text-xs text-tertiary font-medium hover:underline w-full text-center"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
