"use client";

import { useEffect } from "react";
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

  const authenticated = isAuthenticated();
  const userRole = getUserRole();
  const isAllowed = authenticated && !!userRole && allowedRoles.includes(userRole as "CUSTOMER" | "WORKER" | "ADMIN");

  useEffect(() => {
    if (!isAllowed) {
      router.replace(redirectTo);
    }
  }, [isAllowed, redirectTo, router]);

  if (!isAllowed) {
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
