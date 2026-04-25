import { Activity, AlertTriangle, Banknote, ClipboardList, ShieldCheck, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  adminActivitySeed,
  bookingTrendSeed,
  complaintsSeed,
  dashboardStats,
} from "@/lib/admin-mock-data";

export default function AdminDashboardPage() {
  const maxTrend = Math.max(...bookingTrendSeed.map((point) => point.total));

  return (
    <div>
      <AdminPageHeader
        title="Platform Overview"
        description="Track user growth, verification queue, live issues, and booking momentum from one place."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Users"
          value={dashboardStats.totalUsers.toLocaleString()}
          hint={`+${dashboardStats.newUsersToday} today`}
          tone="good"
        />
        <MetricCard
          label="Verified Workers"
          value={`${dashboardStats.verifiedWorkers}/${dashboardStats.totalWorkers}`}
          hint={`${dashboardStats.pendingVerifications} waiting for review`}
        />
        <MetricCard
          label="Bookings Today"
          value={dashboardStats.bookingsToday.toString()}
          hint={`${dashboardStats.activeBookings} active right now`}
        />
        <MetricCard
          label="Revenue (Month)"
          value={`Rs. ${dashboardStats.revenueMonth.toLocaleString()}`}
          hint={`Rs. ${dashboardStats.revenueToday.toLocaleString()} today`}
          tone="good"
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border-border/70 bg-card/95">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">Weekly Booking Flow</h2>
            <Badge className="bg-sky-100 text-sky-700">Live Mock</Badge>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {bookingTrendSeed.map((point) => {
              const percentage = (point.total / maxTrend) * 100;

              return (
                <div key={point.day} className="flex flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end rounded-xl bg-muted p-2">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-[#0d1f1a] to-emerald-500"
                      style={{ height: `${Math.max(8, percentage)}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-heading">{point.day}</p>
                  <p className="text-[11px] text-paragraph">{point.total}</p>
                </div>
              );
            })}
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
              <span className="font-semibold text-heading">{dashboardStats.openComplaints}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Pending verification
              </span>
              <span className="font-semibold text-heading">{dashboardStats.pendingVerifications}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Users className="h-4 w-4 text-emerald-600" />
                Online workers
              </span>
              <span className="font-semibold text-heading">{dashboardStats.onlineWorkers}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Banknote className="h-4 w-4 text-purple-600" />
                Pending payouts
              </span>
              <span className="font-semibold text-heading">Rs. {dashboardStats.pendingPayouts.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <span className="flex items-center gap-2 text-paragraph">
                <Activity className="h-4 w-4 text-rose-600" />
                Avg resolution time
              </span>
              <span className="font-semibold text-heading">{dashboardStats.avgResolutionTime}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <ClipboardList className="h-5 w-5 text-emerald-700" />
            Recent Admin Activity
          </h2>
          <div className="space-y-3">
            {adminActivitySeed.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-heading">{activity.actor}</p>
                  <Badge className="bg-emerald-100 text-emerald-700">{activity.adminLevel}</Badge>
                </div>
                <p className="mt-1 text-sm text-paragraph">{activity.action}</p>
                <p className="text-xs text-paragraph">{activity.target} • {activity.timeAgo}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 text-lg font-semibold text-heading">Open Complaints Snapshot</h2>
          <div className="space-y-3">
            {complaintsSeed
              .filter((complaint) => !complaint.isResolved)
              .map((complaint) => (
                <div key={complaint.id} className="rounded-xl border border-border/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-heading">{complaint.id}</p>
                    <Badge
                      className={
                        complaint.severity === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : complaint.severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-sky-700"
                      }
                    >
                      {complaint.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-paragraph">{complaint.description}</p>
                  <p className="mt-1 text-xs text-paragraph">
                    {complaint.customerName} vs {complaint.workerName} • {complaint.createdAt}
                  </p>
                </div>
              ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
