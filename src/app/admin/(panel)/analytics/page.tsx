"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAnalytics } from "@/api/services/admin";
import type { AnalyticsData } from "@/api/services/admin";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await getAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const maxDaily = useMemo(
    () => Math.max(...(analytics?.dailyBookings || []).map((entry) => entry.count), 1),
    [analytics],
  );

  const maxServiceDemand = useMemo(
    () => Math.max(...(analytics?.serviceDemand || []).map((entry) => entry.count), 1),
    [analytics],
  );

  if (loading || !analytics) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Live analytics for bookings, demand trends, and dispute ratios."
        action={<Badge className="bg-sky-100 text-sky-700">Live Insights</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Booking Completion</p>
          <p className="mt-3 text-3xl font-bold text-heading">{analytics.completionRate.toFixed(1)}%</p>
          <p className="mt-2 text-sm text-emerald-700">Based on all bookings</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Dispute Ratio</p>
          <p className="mt-3 text-3xl font-bold text-heading">{analytics.disputeRate.toFixed(2)}%</p>
          <p className="mt-2 text-sm text-amber-700">Monitor for service quality dips</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Avg booking per day (7d)</p>
          <p className="mt-3 text-3xl font-bold text-heading">
            {(analytics.dailyBookings.reduce((sum, item) => sum + item.count, 0) / Math.max(1, analytics.dailyBookings.length)).toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-sky-700">Recent daily activity</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            Daily Booking Trend
          </h2>
          <div className="space-y-3">
            {analytics.dailyBookings.map((point) => (
              <div key={point.day}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-paragraph">{point.day}</span>
                  <span className="font-semibold text-heading">{point.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                    style={{ width: `${(point.count / maxDaily) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <PieChart className="h-5 w-5 text-sky-700" />
            Service Demand Split
          </h2>
          <div className="space-y-3">
            {analytics.serviceDemand.map((service) => (
              <div key={service.serviceId}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-paragraph">{service.serviceName}</span>
                  <span className="font-semibold text-heading">{service.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0d1f1a] to-emerald-500"
                    style={{ width: `${(service.count / maxServiceDemand) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="mt-6 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <BarChart3 className="h-5 w-5 text-rose-700" />
          Insights Notes
        </h2>
        <ul className="space-y-2 text-sm text-paragraph">
          <li>Total bookings: {analytics.totalBookings}</li>
          <li>Completed bookings: {analytics.completedBookings}</li>
          <li>Cancelled bookings: {analytics.cancelledBookings}</li>
          <li>Disputed bookings: {analytics.disputedBookings}</li>
        </ul>
      </Card>
    </div>
  );
}
