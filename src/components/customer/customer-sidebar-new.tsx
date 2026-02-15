"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ClipboardList,
  Award,
  UserCircle,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/customer", label: "Home", icon: Home },
  { href: "/customer/orders", label: "My Orders", icon: ClipboardList },
  { href: "/customer/notifications", label: "Notifications", icon: Bell },
  { href: "/customer/rewards", label: "Rewards", icon: Award },
  { href: "/customer/profile", label: "Profile", icon: UserCircle },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/customer") return pathname === "/customer";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/customer" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-tertiary flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold text-heading">Mehnati</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-tertiary/10 text-tertiary"
                  : "text-muted-foreground hover:bg-muted hover:text-heading"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.5px]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-1">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}