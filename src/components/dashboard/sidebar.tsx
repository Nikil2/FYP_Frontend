"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bookmark,
  Clock,
  MessageSquare,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/active-bookings",
    label: "Active Bookings",
    icon: Bookmark,
  },
  {
    href: "/dashboard/booking-history",
    label: "Booking History",
    icon: Clock,
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/saved-locations",
    label: "Saved Locations",
    icon: MapPin,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-heading">Dashboard</h2>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors animation-standard",
                isActive
                  ? "bg-tertiary text-tertiary-foreground"
                  : "text-paragraph hover:bg-muted",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-border">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-paragraph hover:bg-muted transition-colors animation-standard"
          onClick={() => {
            // Handle logout
            window.location.href = "/";
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
