"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Avatar } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/worker-dashboard/language-toggle";
import { OnlineToggle } from "@/components/worker-dashboard/online-toggle";
import { getProviderProfile, getProviderStats } from "@/lib/mock-provider";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  User,
  Settings,
  LogOut,
  Star,
  CheckCircle,
  X,
} from "lucide-react";

interface WorkerSidebarProps {
  onClose?: () => void;
}

export function WorkerSidebar({ onClose }: WorkerSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const profile = getProviderProfile();
  const stats = getProviderStats();

  const sidebarItems = [
    {
      href: "/worker/dashboard",
      label: t.dashboard,
      icon: LayoutDashboard,
    },
    {
      href: "/worker/dashboard/orders",
      label: t.orders,
      icon: Briefcase,
      badge: stats.activeOrders > 0 ? stats.activeOrders : undefined,
    },
    {
      href: "/worker/dashboard/wallet",
      label: t.wallet,
      icon: Wallet,
    },
    {
      href: "/worker/dashboard/profile",
      label: t.profile,
      icon: User,
    },
    {
      href: "/worker/dashboard/settings",
      label: t.settings,
      icon: Settings,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Close button */}
      {onClose && (
        <div className="flex items-center justify-end p-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-heading" />
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <Avatar
              src={profile.profileImage}
              alt={profile.name}
              size="xl"
            />
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary border-2 border-white rounded-full" />
          </div>

          <div>
            <h3 className="font-bold text-heading text-lg">{profile.name}</h3>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-sm text-paragraph">Rating</span>
              <span className="text-sm font-semibold text-tertiary">
                ({profile.rating.toFixed(1)})
              </span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          {/* Completed Services Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 border border-tertiary rounded-full text-xs font-medium text-tertiary">
            <CheckCircle className="w-3 h-3" />
            Completed Services {profile.completedServices}
          </div>

          {/* Profile Status */}
          <p className="text-sm text-paragraph">
            Profile Status:{" "}
            <span
              className={cn(
                "font-semibold",
                profile.profileStatus === "approved"
                  ? "text-tertiary"
                  : profile.profileStatus === "pending"
                  ? "text-yellow-600"
                  : "text-destructive"
              )}
            >
              {profile.profileStatus.charAt(0).toUpperCase() +
                profile.profileStatus.slice(1)}
            </span>
          </p>
        </div>

        {/* Online Toggle - only show when approved */}
        {profile.profileStatus === "approved" ? (
          <div className="mt-4 flex justify-center">
            <OnlineToggle initialStatus={profile.isOnline} />
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-yellow-700">
                {profile.profileStatus === "pending" ? "Under Review" : "Action Required"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Language Toggle */}
      <div className="px-6 py-3 border-b border-border flex justify-center">
        <LanguageToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-colors animation-standard",
                active
                  ? "bg-tertiary text-tertiary-foreground"
                  : "text-paragraph hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-destructive rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-paragraph hover:bg-muted transition-colors animation-standard"
          onClick={() => {
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
