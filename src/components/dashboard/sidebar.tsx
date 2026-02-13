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
  CircleUser,
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

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    // Exact match for /dashboard (Overview)
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other routes, check if pathname starts with the href
    return pathname.startsWith(href) && pathname !== "/dashboard";
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col overflow-y-auto pt-3">
      {/* Logo Section */}
      <div className="hidden p-5 border-b border-border flex-shrink-0 md:flex md:items-center md:gap-3">
        <CircleUser className="text-tertiary w-7 h-7"/>
        <h2 className="text-xl font-bold text-heading">User Dashboard</h2>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors animation-standard",
                active
                  ? "bg-tertiary text-tertiary-foreground"
                  : "text-paragraph hover:bg-muted",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm md:text-base">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-border flex-shrink-0">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-paragraph hover:bg-muted transition-colors animation-standard"
          onClick={() => {
            handleNavigate();
            // Handle logout
            window.location.href = "/";
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm md:text-base">Logout</span>
        </button>
      </div>
    </div>
  );
}
