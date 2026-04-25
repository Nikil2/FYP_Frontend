import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  bookingTrendSeed,
  dashboardStats,
  serviceCategoriesSeed,
} from "@/lib/admin-mock-data";

export default function AdminAnalyticsPage() {
  const totalServicesWorkers = serviceCategoriesSeed.reduce(
    (sum, service) => sum + service.workersCount,
    0,
  );

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Frontend analytics preview for bookings, service demand, and worker distribution."
        action={<Badge className="bg-sky-100 text-sky-700">Demo Insights</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Booking Completion</p>
          <p className="mt-3 text-3xl font-bold text-heading">89.2%</p>
          <p className="mt-2 text-sm text-emerald-700">+2.4% vs last week</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Dispute Ratio</p>
          <p className="mt-3 text-3xl font-bold text-heading">
            {((dashboardStats.disputedBookings / dashboardStats.totalBookings) * 100).toFixed(2)}%
          </p>
          <p className="mt-2 text-sm text-amber-700">Monitor for service quality dips</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Avg booking per active worker</p>
          <p className="mt-3 text-3xl font-bold text-heading">
            {(dashboardStats.activeBookings / Math.max(1, dashboardStats.onlineWorkers)).toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-sky-700">Load balancing opportunity</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            Daily Booking Trend
          </h2>
          <div className="space-y-3">
            {bookingTrendSeed.map((point) => (
              <div key={point.day}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-paragraph">{point.day}</span>
                  <span className="font-semibold text-heading">{point.total}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                    style={{ width: `${(point.total / 130) * 100}%` }}
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
            {serviceCategoriesSeed.map((service) => {
              const ratio = (service.workersCount / Math.max(1, totalServicesWorkers)) * 100;

              return (
                <div key={service.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-paragraph">{service.name}</span>
                    <span className="font-semibold text-heading">{ratio.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0d1f1a] to-emerald-500"
                      style={{ width: `${Math.max(5, ratio)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <Card className="mt-6 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <BarChart3 className="h-5 w-5 text-rose-700" />
          Insights Notes
        </h2>
        <ul className="space-y-2 text-sm text-paragraph">
          <li>Weekend bookings are 20-30% higher than weekdays.</li>
          <li>Electrician and plumber categories lead worker demand.</li>
          <li>Dispute ratio is stable but should be watched near surge periods.</li>
        </ul>
      </Card>
    </div>
  );
}
