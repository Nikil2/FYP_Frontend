"use client";

import { useEffect, useState } from "react";
import { BanknoteArrowUp, CalendarClock, ReceiptText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card } from "@/components/ui/card";
import { getDashboardStats, getRevenueStats } from "@/api/services/admin";
import type { DashboardResponse, RevenueStats } from "@/api/services/admin";

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRevenue() {
      try {
        const [revenueRes, dashboardRes] = await Promise.all([
          getRevenueStats(),
          getDashboardStats(),
        ]);
        setRevenue(revenueRes.data);
        setDashboard(dashboardRes.data);
      } catch (error) {
        console.error("Failed to load revenue stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRevenue();
  }, []);

  if (loading || !revenue || !dashboard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading revenue...</p>
      </div>
    );
  }

  const grossRevenue = revenue.grossRevenue;
  const platformFee = revenue.platformFee;
  const refunds = revenue.refunds;
  const netRevenue = revenue.netRevenue;
  const totalBookings = revenue.totalTransactions;
  const maxWeekValue = Math.max(...revenue.revenueByWeek.map((item) => item.amount), 1);

  return (
    <div>
      <AdminPageHeader
        title="Revenue Reports"
        description="Live financial performance and fee snapshots from completed bookings."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Gross Revenue"
          value={`Rs. ${grossRevenue.toLocaleString()}`}
          hint={`${totalBookings.toLocaleString()} transactions`}
          tone="good"
        />
        <MetricCard label="Platform Fee" value={`Rs. ${platformFee.toLocaleString()}`} />
        <MetricCard label="Refunds" value={`Rs. ${refunds.toLocaleString()}`} tone="warn" />
        <MetricCard
          label="Net Revenue"
          value={`Rs. ${netRevenue.toLocaleString()}`}
          hint="Current month"
          tone="good"
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <BanknoteArrowUp className="h-5 w-5 text-emerald-700" />
            Week-wise Revenue
          </h2>
          <div className="space-y-3">
            {revenue.revenueByWeek.map((point) => (
              <div key={point.week}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-paragraph">{point.week}</span>
                  <span className="font-semibold text-heading">Rs. {point.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0d1f1a] to-emerald-500"
                    style={{ width: `${(point.amount / maxWeekValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 text-lg font-semibold text-heading">Financial Snapshot</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-paragraph">
                <CalendarClock className="h-4 w-4 text-sky-700" />
                Pending payouts
              </span>
              <span className="font-semibold text-heading">{dashboard.pendingPayouts.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-paragraph">
                <ReceiptText className="h-4 w-4 text-rose-700" />
                Avg booking value
              </span>
              <span className="font-semibold text-heading">
                Rs. {Math.round(grossRevenue / Math.max(1, totalBookings)).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
