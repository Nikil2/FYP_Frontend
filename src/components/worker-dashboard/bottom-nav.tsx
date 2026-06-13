"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Home, Briefcase, Wallet, User, Settings } from "lucide-react";
import { getCachedWorkerDashboardProfile } from "@/api/services/worker-dashboard";

const VERIFICATION_REQUIRED_HREFS = [
  "/worker/dashboard/orders",
  "/worker/dashboard/wallet",
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const cached = getCachedWorkerDashboardProfile();
    setIsApproved(cached?.verificationStatus === "APPROVED");
  }, []);

  const navItems = [
    {
      href: "/worker/dashboard",
      label: t.dashboard,
      icon: Home,
      exact: true,
    },
    {
      href: "/worker/dashboard/orders",
      label: t.orders,
      icon: Briefcase,
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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around py-1.5 px-1 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          const locked =
            !isApproved && VERIFICATION_REQUIRED_HREFS.includes(item.href);

          if (locked) {
            return (
              <div
                key={item.href}
                className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg min-w-0 opacity-30 cursor-not-allowed"
                title="Complete verification to unlock"
              >
                <Icon className="w-5 h-5 text-paragraph" />
                <span className="text-[10px] font-medium truncate">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg animation-standard min-w-0",
                active ? "text-tertiary" : "text-paragraph"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  active ? "text-tertiary" : "text-paragraph"
                )}
              />
              <span className="text-[10px] font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
