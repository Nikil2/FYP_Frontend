import { BanknoteArrowUp, CalendarClock, ReceiptText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card } from "@/components/ui/card";
import { dashboardStats, revenueBreakdownSeed } from "@/lib/admin-mock-data";

export default function AdminRevenuePage() {
  const grossRevenue = revenueBreakdownSeed.reduce(
    (sum, point) => sum + point.revenue,
    0,
  );
  const totalBookings = revenueBreakdownSeed.reduce(
    (sum, point) => sum + point.bookings,
    0,
  );
  const platformFee = Math.round(grossRevenue * 0.11);
  const refunds = Math.round(grossRevenue * 0.018);
  const netRevenue = grossRevenue - platformFee - refunds;

  return (
    <div>
      <AdminPageHeader
        title="Revenue Reports"
        description="Financial dashboard preview with month-wise performance and fee snapshots."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Gross Revenue"
          value={`Rs. ${grossRevenue.toLocaleString()}`}
          hint={`${totalBookings.toLocaleString()} bookings`}
          tone="good"
        />
        <MetricCard label="Platform Fee (11%)" value={`Rs. ${platformFee.toLocaleString()}`} />
        <MetricCard label="Refunds" value={`Rs. ${refunds.toLocaleString()}`} tone="warn" />
        <MetricCard
          label="Net Revenue"
          value={`Rs. ${netRevenue.toLocaleString()}`}
          hint={`Today Rs. ${dashboardStats.revenueToday.toLocaleString()}`}
          tone="good"
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
            <BanknoteArrowUp className="h-5 w-5 text-emerald-700" />
            Month-wise Revenue
          </h2>
          <div className="space-y-3">
            {revenueBreakdownSeed.map((point) => (
              <div key={point.period}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-paragraph">{point.period}</span>
                  <span className="font-semibold text-heading">Rs. {point.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0d1f1a] to-emerald-500"
                    style={{ width: `${(point.revenue / 4000000) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-paragraph">{point.bookings} bookings</p>
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
              <span className="font-semibold text-heading">Rs. {dashboardStats.pendingPayouts.toLocaleString()}</span>
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
