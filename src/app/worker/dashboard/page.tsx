"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/language-context";
import { VerificationBanner } from "@/components/worker-dashboard/verification-banner";
import { OrderDetailModal } from "@/components/worker-dashboard/order-detail-modal";
import {
  getWorkerDashboardProfileByUserId,
  getWorkerDashboardOrders,
  resolveWorkerUserId,
} from "@/api/services/worker-dashboard";
import {
  Briefcase,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import type { ProviderOrder } from "@/types/provider";

export default function WorkerDashboardPage() {
  const { t } = useLanguage();
  const [workerName, setWorkerName] = useState("Worker");
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track verification and online status
  const [profileStatus, setProfileStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [isOnline, setIsOnline] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = resolveWorkerUserId();
        if (!userId) {
          setError("Worker user ID missing. Set NEXT_PUBLIC_WORKER_USER_ID or login first.");
          return;
        }

        const profile = await getWorkerDashboardProfileByUserId(userId);
        setWorkerName(profile.fullName);
        setWorkerId(profile.workerId);
        setIsOnline(profile.isOnline);
        setProfileStatus(
          profile.verificationStatus === "APPROVED"
            ? "approved"
            : profile.verificationStatus === "REJECTED"
            ? "rejected"
            : "pending"
        );

        const orders = await getWorkerDashboardOrders(profile.workerId, "active");
        setActiveOrders(orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleGoLive = async () => {
    if (!workerId) {
      setIsOnline(true);
      return;
    }

    // Keep optimistic local update for now
    setIsOnline(true);
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Verification Banner - shows for all states */}
      <VerificationBanner
        profileStatus={profileStatus}
        isOnline={isOnline}
        onGoLive={handleGoLive}
      />

      {/* Only show dashboard content if approved */}
      {profileStatus !== "approved" ? (
        /* Locked state - show dimmed preview */
        <div className="relative">
          <div className="opacity-30 pointer-events-none select-none blur-[2px]">
            {/* Welcome Header */}
            <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-1">
              {t.dashboard}
            </h1>
            <p className="text-paragraph text-sm">
              Welcome back, {workerName}!
            </p>
          </div>

            {/* Placeholder Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4 lg:p-6 bg-gray-50 border-0">
                  <div className="h-12" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {loading && (
            <Card className="p-4">
              <p className="text-sm text-paragraph">Loading dashboard...</p>
            </Card>
          )}
          {error && (
            <Card className="p-4 border-red-200 bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </Card>
          )}
          {/* Welcome Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-1">
              {t.dashboard}
            </h1>
            <p className="text-paragraph text-sm">
              Welcome back, {workerName}! Here&apos;s your overview.
            </p>
          </div>

          {/* Active Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-heading">{t.activeOrders}</h2>
              <Link
                href="/worker/dashboard/orders"
                className="flex items-center gap-1 text-sm text-tertiary font-medium hover:underline"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {activeOrders.length > 0 ? (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-heading text-tertiary">
                            {order.serviceName}
                          </h3>
                          <Badge variant="tertiary" className="text-xs capitalize">
                            {order.status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-paragraph">
                          <p>
                            {t.serviceId}: {order.id}
                          </p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{order.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-tertiary font-medium">
                              {order.scheduledTime} {order.scheduledDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-sm text-paragraph">{t.agreedPrice}</p>
                        <p className="text-lg font-bold text-tertiary">
                          Rs. {order.agreedPrice.toLocaleString()}
                        </p>
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="mt-2 rounded-full text-xs"
                          onClick={() => setSelectedOrder(order)}
                        >
                          {t.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-paragraph">No active orders right now</p>
                <p className="text-sm text-muted-foreground mt-1">
                  New service requests will appear here
                </p>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
