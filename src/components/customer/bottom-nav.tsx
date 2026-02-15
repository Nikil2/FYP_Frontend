"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ClipboardList, Award, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/customer",
    label: "Home",
    icon: Home,
  },
  {
    href: "/customer/orders",
    label: "My Orders",
    icon: ClipboardList,
  },
  {
    href: "/customer/rewards",
    label: "Rewards",
    icon: Award,
  },
  {
    href: "/customer/profile",
    label: "Profile",
    icon: UserCircle,
  },
];

export function CustomerBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/customer") {
      return pathname === "/customer";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors",
                active
                  ? "text-tertiary"
                  : "text-muted-foreground hover:text-heading"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.5px]")} />
              <span className={cn("text-xs font-medium", active && "font-bold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
