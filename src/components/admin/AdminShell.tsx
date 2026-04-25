"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CircleDot,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminSession,
  clearAdminSession,
  getAdminSession,
} from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/workers", label: "Workers", icon: UserCheck },
  {
    href: "/admin/workers/verification",
    label: "Verification",
    icon: ShieldCheck,
  },
  { href: "/admin/complaints", label: "Complaints", icon: AlertTriangle },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/revenue", label: "Revenue", icon: Wallet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function getAdminLevelStyles(level: AdminSession["adminLevel"]) {
  if (level === "SUPER_ADMIN") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (level === "SENIOR_MODERATOR") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-sky-100 text-sky-700";
}

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const session = getAdminSession();

  useEffect(() => {
    if (!session) {
      router.replace("/admin/login");
    }
  }, [router, session]);

  const pageTitle = useMemo(() => {
    const current = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
    return current?.label || "Admin";
  }, [pathname]);

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/admin/login");
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f6] px-4">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-paragraph">Preparing admin workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7f6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-10 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-border/70 bg-[#0d1f1a] p-5 text-white transition-transform duration-300 md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Mehnati</p>
              <h2 className="mt-1 text-lg font-semibold">Admin Console</h2>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-emerald-100 hover:bg-white/10 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-400/20 text-emerald-100"
                      : "text-emerald-50/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-xs text-emerald-100/90">
            <p className="font-semibold">Live Mode</p>
            <p className="mt-1 leading-relaxed">
              Admin panel actions are connected to backend APIs.
            </p>
          </div>
        </aside>

        <div className="flex-1 md:ml-72">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-[#f4f7f6]/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-border bg-card p-2 text-heading shadow-sm md:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-paragraph">Control Center</p>
                  <h1 className="text-lg font-semibold text-heading md:text-xl">{pageTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={getAdminLevelStyles(session.adminLevel)}>{session.adminLevel}</Badge>
                <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm md:flex">
                  <CircleDot className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-medium text-heading">{session.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 md:px-8 md:py-8">{children}</main>
        </div>
      </div>

      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      ) : null}
    </div>
  );
}
