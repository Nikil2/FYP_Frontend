"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Banknote, ClipboardList, ShieldCheck, Star, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDashboardStats, getComplaints, getReviews } from "@/api/services/admin";
import type { DashboardResponse, Complaint, Review } from "@/api/services/admin";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardRes, complaintsRes, reviewsRes] = await Promise.all([
          getDashboardStats(),
          getComplaints(1, 5, "pending"),
          getReviews(1, 5, "flagged", 2),
        ]);

        setDashboard(dashboardRes.data);
        setComplaints(complaintsRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading || !dashboard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading dashboard...</p>
      </div>
    );
  }

  const { stats, recentActivity, workerQuality } = dashboard;
  const flaggedReviewCount = reviews.filter((r) => r.rating <= 2).length;

  return (
    <div>
      <AdminPageHeader
        title="Platform Overview"
        description="Track user growth, verification queue, live issues, and booking momentum from one place."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          hint="Active users"
          tone="good"
        />
        <MetricCard
          label="Verified Workers"
          value={`${stats.verifiedWorkers}/${stats.totalWorkers}`}
          hint={`${stats.pendingVerifications} pending`}
        />
        <MetricCard
          label="Bookings Today"
          value={stats.bookingsToday.toString()}
          hint={`${stats.totalBookings.toLocaleString()} total`}
        />
        <MetricCard
          label="Revenue (Month)"
          value={`Rs. ${stats.monthlyRevenue.toLocaleString()}`}
          hint="Current month"
          tone="good"
        />
        <MetricCard
          label="Average Worker Rating"
          value={stats.averageWorkerRating.toFixed(1)}
          hint={`${flaggedReviewCount} flagged reviews`}
          tone={flaggedReviewCount > 0 ? "warn" : "good"}
        />
        <MetricCard
          label="Online Workers"
          value={stats.onlineWorkers.toString()}
          hint={`${stats.blockedWorkers} blocked`}
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border-border/70 bg-card/95">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">Recent Admin Activity</h2>
            <Badge className="bg-sky-100 text-sky-700">Live</Badge>
          </div>

          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-border/70 bg-muted/40 p-3">
                  <p className="text-sm font-semibold text-heading">{activity.description}</p>
                  <p className="text-xs text-paragraph">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-paragraph">No recent activity</p>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 text-lg font-semibold text-heading">Operational Pulse</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Open complaints
              </span>
              <span className="font-semibold text-heading">{dashboard.openComplaints}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Pending verification
              </span>
              <span className="font-semibold text-heading">{stats.pendingVerifications}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Users className="h-4 w-4 text-emerald-600" />
                Online workers
              </span>
              <span className="font-semibold text-heading">{stats.onlineWorkers}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Banknote className="h-4 w-4 text-purple-600" />
                Pending payouts
              </span>
              <span className="font-semibold text-heading">{dashboard.pendingPayouts}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Activity className="h-4 w-4 text-rose-600" />
                Avg resolution time
              </span>
              <span className="font-semibold text-heading">{dashboard.averageResolutionTime}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Star className="h-4 w-4 text-amber-500" />
                Flagged reviews
              </span>
              <span className="font-semibold text-heading">{flaggedReviewCount}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <ClipboardList className="h-5 w-5 text-emerald-700" />
            Open Complaints
          </h2>
          <div className="space-y-3">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div key={complaint.id} className="rounded-xl border border-border/70 p-3">
                  <p className="font-semibold text-heading">{complaint.id}</p>
                  <p className="text-sm text-paragraph">{complaint.description}</p>
                  <p className="text-xs text-paragraph">
                    {complaint.booking.customer.fullName} vs{" "}
                    {complaint.booking.worker.user.fullName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-paragraph">No open complaints</p>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 text-lg font-semibold text-heading">Top Worker Quality</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {workerQuality.length > 0 ? (
              workerQuality.map((worker) => (
                <div key={worker.workerId} className="rounded-xl border border-border/70 p-3">
                  <p className="font-semibold text-heading">{worker.workerName}</p>
                  <p className="text-xs text-paragraph">{worker.completedJobs} jobs</p>
                  <p className="mt-2 text-sm text-heading">
                    Rating: <span className="font-semibold">{worker.rating.toFixed(1)}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-paragraph">No worker data available</p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
