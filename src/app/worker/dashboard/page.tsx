"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/language-context";
import { VerificationBanner } from "@/components/worker-dashboard/verification-banner";
import {
  getProviderProfile,
  getProviderStats,
  getActiveOrders,
  getProviderEarnings,
} from "@/lib/mock-provider";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";

export default function WorkerDashboardPage() {
  const { t } = useLanguage();
  const profile = useMemo(() => getProviderProfile(), []);
  const stats = useMemo(() => getProviderStats(), []);
  const activeOrders = useMemo(() => getActiveOrders(), []);
  const earnings = useMemo(() => getProviderEarnings(), []);

  // Track verification and online status
  // Change to "pending" to see the under-verification screen
  const [profileStatus, setProfileStatus] = useState<"pending" | "approved" | "rejected">(
    profile.profileStatus
  );
  const [isOnline, setIsOnline] = useState(profile.isOnline);

  const handleGoLive = () => {
    setIsOnline(true);
  };

  const statCards = [
    {
      label: t.activeOrders,
      value: stats.activeOrders,
      icon: Briefcase,
      iconColor: "text-tertiary",
      bgColor: "bg-green-50",
    },
    {
      label: t.completed,
      value: stats.completedOrders,
      icon: CheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-emerald-50",
    },
    {
      label: t.cancelled,
      value: stats.cancelledOrders,
      icon: XCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      label: t.totalEarnings,
      value: `Rs. ${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

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
                Welcome back, {profile.name}!
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
          {/* Welcome Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-1">
              {t.dashboard}
            </h1>
            <p className="text-paragraph text-sm">
              Welcome back, {profile.name}! Here&apos;s your overview.
            </p>
          </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className={`p-4 lg:p-6 ${card.bgColor} border-0`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {card.label}
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-heading">
                    {card.value}
                  </p>
                </div>
                <Icon
                  className={`w-8 h-8 lg:w-10 lg:h-10 ${card.iconColor} opacity-30`}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Orders + Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Active Orders */}
        <div className="lg:col-span-2">
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

        {/* Earnings Summary Card */}
        <div>
          <h2 className="text-lg font-bold text-heading mb-4">{t.earnings}</h2>
          <Card className="p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-tertiary to-tertiary-hover p-6 text-white">
              <p className="text-sm text-white/80">{t.totalEarnings}</p>
              <p className="text-3xl font-bold mt-1">
                Rs. {earnings.totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-paragraph">{t.availableBalance}</span>
                <span className="font-semibold text-heading">
                  Rs. {earnings.availableBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-paragraph">{t.pending}</span>
                <span className="font-semibold text-yellow-600">
                  Rs. {earnings.pendingBalance.toLocaleString()}
                </span>
              </div>
              <Link
                href="/worker/dashboard/wallet"
                className="block w-full text-center py-2.5 bg-tertiary text-white text-sm font-semibold rounded-lg hover:bg-tertiary-hover animation-standard"
              >
                {t.withdraw}
              </Link>
            </div>
          </Card>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
