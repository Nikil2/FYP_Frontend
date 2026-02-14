"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { getProviderProfile } from "@/lib/mock-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getNotifications, type ProviderNotification } from "@/lib/mock-notifications";
import { logout } from "@/lib/auth";
import {
  Menu,
  Bell,
  X,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Star,
  Clock,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkerTopBarProps {
  onToggleSidebar: () => void;
}

export function WorkerTopBar({ onToggleSidebar }: WorkerTopBarProps) {
  const { language } = useLanguage();
  const profile = getProviderProfile();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle profile click - only toggle sidebar on desktop
  const handleProfileClick = () => {
    if (window.innerWidth >= 1024) { // lg: breakpoint
      onToggleSidebar();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const notifIconMap: Record<ProviderNotification["type"], React.ReactNode> = {
    "new-job": <Briefcase className="w-4 h-4 text-tertiary" />,
    "job-accepted": <CheckCircle className="w-4 h-4 text-green-500" />,
    "job-cancelled": <AlertTriangle className="w-4 h-4 text-red-500" />,
    "payment": <CheckCircle className="w-4 h-4 text-blue-500" />,
    "review": <Star className="w-4 h-4 text-yellow-500" />,
    "message": <MessageSquare className="w-4 h-4 text-purple-500" />,
    "system": <AlertTriangle className="w-4 h-4 text-gray-500" />,
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return language === "ur" ? "ابھی" : "Just now";
    if (diffMins < 60) return language === "ur" ? `${diffMins} منٹ پہلے` : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return language === "ur" ? `${diffHours} گھنٹے پہلے` : `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return language === "ur" ? `${diffDays} دن پہلے` : `${diffDays}d ago`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border h-16 flex items-center px-4 lg:px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <a href="/worker/dashboard" className="flex items-center">
          <Image
            src="/icons/mehnati-logo.png"
            alt="Mehnati"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </a>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-heading" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50">
                <h3 className="font-bold text-heading text-sm">
                  {language === "ur" ? "اطلاعات" : "Notifications"}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-tertiary font-medium hover:underline"
                  >
                    {language === "ur" ? "سب پڑھی ہوئی" : "Mark all read"}
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    {language === "ur" ? "کوئی اطلاع نہیں" : "No notifications yet"}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                        !notif.isRead && "bg-tertiary/5"
                      )}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                        {notifIconMap[notif.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm",
                            notif.isRead ? "text-paragraph" : "text-heading font-medium"
                          )}
                        >
                          {language === "ur" ? notif.titleUrdu : notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {language === "ur" ? notif.bodyUrdu : notif.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0 mt-2" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar — click to toggle sidebar on desktop only */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-2 pl-2 border-l border-border ml-1 hover:bg-muted rounded-lg py-1.5 pr-2 transition-colors lg:cursor-pointer cursor-default"
        >
          <Avatar
            src={profile.profileImage}
            alt={profile.name}
            size="sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-heading leading-tight">
              {profile.name}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {profile.category}
            </p>
          </div>
          <Menu className="w-5 h-5 text-paragraph ml-1 hidden lg:block" />
        </button>
      </div>
    </header>
  );
}
