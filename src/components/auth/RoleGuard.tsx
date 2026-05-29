"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, isAuthenticated } from "@/lib/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<"CUSTOMER" | "WORKER" | "ADMIN">;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: RoleGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const authenticated = mounted ? isAuthenticated() : false;
  const userRole = mounted ? getUserRole() : null;
  const isAllowed = authenticated && !!userRole && allowedRoles.includes(userRole as "CUSTOMER" | "WORKER" | "ADMIN");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!isAllowed) {
      router.replace(redirectTo);
    }
  }, [isAllowed, mounted, redirectTo, router]);

  if (!mounted || !isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-background px-4">
        <div className="rounded-xl border border-border bg-card px-5 py-4 text-sm text-paragraph shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
