"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Calendar,
  Award,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Bell,
  Heart,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthUser, logout } from "@/lib/auth";
import { getUnreadCount } from "@/api/services/notifications";
import type { User as AuthUser } from "@/interfaces/auth-interfaces";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  color?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
    setLoading(false);

    // Fetch real notification count
    const fetchUnread = async () => {
      try {
        const result = await getUnreadCount();
        setUnreadNotifications(result.unreadCount);
      } catch { /* skip */ }
    };
    fetchUnread();
  }, []);

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: "My Activity",
      items: [
        {
          icon: ClipboardList,
          label: "My Orders",
          href: "/customer/orders",
        },
        {
          icon: Award,
          label: "Rewards",
          href: "/customer/rewards",
        },
        {
          icon: Heart,
          label: "Saved Workers",
          href: "/customer/saved",
        },
        {
          icon: Bell,
          label: "Notifications",
          href: "/customer/notifications",
          badge: unreadNotifications > 0 ? `${unreadNotifications} new` : undefined,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Settings,
          label: "Account Settings",
          href: "/customer/settings",
        },
        {
          icon: MapPin,
          label: "Saved Addresses",
          href: "/customer/addresses",
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          href: "/customer/privacy",
        },
        {
          icon: FileText,
          label: "Terms & Conditions",
          href: "/customer/terms",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          href: "/customer/help",
        },
        {
          icon: LogOut,
          label: "Logout",
          onClick: () => logout(),
          color: "text-red-600",
        },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tertiary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors md:hidden"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-tertiary/20 flex items-center justify-center border-2 border-tertiary overflow-hidden">
            {user?.profilePicUrl ? (
              <img
                src={user.profilePicUrl}
                alt={user.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-tertiary">
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "G"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-heading">
              {user?.fullName || "Guest User"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {user?.phoneNumber || "Not logged in"}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {user && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-tertiary" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-PK", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Personal Info */}
      {user && (
        <div className="bg-white mt-3 p-4 border-y border-border">
          <h3 className="text-sm font-semibold text-heading mb-3">
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Full Name</p>
                <p className="text-sm text-heading">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Phone</p>
                <p className="text-sm text-heading">{user.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Member Since</p>
                <p className="text-sm text-heading">
                  {new Date(user.createdAt).toLocaleDateString("en-PK", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="bg-white mt-3 border-y border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">
            {section.title}
          </p>
          {section.items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.href) router.push(item.href);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                  idx < section.items.length - 1 && "border-b border-border"
                )}
              >
                <Icon className={cn("w-5 h-5", item.color || "text-muted-foreground")} />
                <span className={cn("flex-1 text-sm font-medium text-left", item.color || "text-heading")}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-semibold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {!item.onClick && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* App version */}
      <div className="text-center py-6">
        <p className="text-[10px] text-muted-foreground">Mehnati v1.0.0</p>
      </div>
    </div>
  );
}
