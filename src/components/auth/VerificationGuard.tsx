"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getCachedWorkerDashboardProfile,
  getWorkerDashboardProfileByUserId,
  resolveWorkerUserId,
} from "@/api/services/worker-dashboard";

// Routes that require APPROVED verification status
const VERIFICATION_REQUIRED_PATHS = [
  "/worker/dashboard/orders",
  "/worker/dashboard/wallet",
];

export function VerificationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isRestricted = VERIFICATION_REQUIRED_PATHS.some((p) =>
      pathname.startsWith(p)
    );

    if (!isRestricted) {
      setReady(true);
      return;
    }

    const check = async () => {
      let status: string | undefined;

      const cached = getCachedWorkerDashboardProfile();
      if (cached) {
        status = cached.verificationStatus;
      } else {
        const userId = resolveWorkerUserId();
        if (userId) {
          try {
            const profile = await getWorkerDashboardProfileByUserId(userId);
            status = profile.verificationStatus;
          } catch {
            // On fetch failure allow through — backend will enforce
            setReady(true);
            return;
          }
        }
      }

      if (status !== "APPROVED") {
        router.replace("/worker/dashboard");
        return;
      }

      setReady(true);
    };

    check();
  }, [pathname, router]);

  // Keep layout shell visible while redirecting (avoids flash)
  if (!ready) return null;

  return <>{children}</>;
}
