import { Star, UserCheck, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { adminUsersSeed, pendingVerificationsSeed, workerQualitySeed } from "@/lib/admin-mock-data";

export default function AdminWorkersPage() {
  const workers = adminUsersSeed.filter((user) => user.role === "WORKER");
  const verifiedWorkers = workers.filter((worker) => worker.isVerified).length;
  const blockedWorkers = workers.filter((worker) => worker.isBlocked).length;
  const averageRating =
    workerQualitySeed.reduce((sum, worker) => sum + worker.averageRating, 0) /
    Math.max(workerQualitySeed.length, 1);

  return (
    <div>
      <AdminPageHeader
        title="Workers"
        description="Quick worker overview with verification pressure and account health."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Workers in List" value={workers.length.toString()} />
        <MetricCard
          label="Verified Workers"
          value={verifiedWorkers.toString()}
          hint={`${pendingVerificationsSeed.length} waiting in verification queue`}
          tone="good"
        />
        <MetricCard
          label="Blocked Workers"
          value={blockedWorkers.toString()}
          hint={blockedWorkers > 0 ? "Review policy compliance" : "No blocks right now"}
          tone={blockedWorkers > 0 ? "warn" : "good"}
        />
        <MetricCard
          label="Average Worker Rating"
          value={averageRating.toFixed(1)}
          hint="Based on latest moderated reviews"
          tone="good"
        />
      </section>

      <Card className="mt-6 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
          <UserCheck className="h-5 w-5 text-emerald-700" />
          Worker Accounts
        </h2>

        <div className="space-y-3">
          {workers.map((worker) => (
            <div key={worker.id} className="flex flex-col gap-2 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-heading">{worker.fullName}</p>
                <p className="text-xs text-paragraph">{worker.phoneNumber} • ID {worker.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={worker.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                  {worker.isVerified ? "Verified" : "Pending"}
                </Badge>
                <Badge className={worker.isBlocked ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"}>
                  {worker.isBlocked ? "Blocked" : "Active"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-paragraph">
          Detailed service and portfolio controls are available in the verification page, and this will map to backend worker management APIs later.
        </div>
      </Card>

      <Card className="mt-4 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <Users className="h-5 w-5 text-sky-700" />
          Pending Verification Snapshot
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {pendingVerificationsSeed.map((worker) => (
            <div key={worker.workerId} className="rounded-xl border border-border/70 p-3">
              <p className="font-semibold text-heading">{worker.fullName}</p>
              <p className="text-xs text-paragraph">{worker.services.join(" • ")}</p>
              <p className="mt-1 text-xs text-paragraph">Submitted {worker.submittedAt}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <Star className="h-5 w-5 text-amber-500" />
          Worker Ratings Health
        </h2>
        <div className="space-y-3">
          {workerQualitySeed.map((worker) => (
            <div key={worker.workerId} className="rounded-xl border border-border/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-heading">{worker.workerName}</p>
                  <p className="text-xs text-paragraph">{worker.service}</p>
                </div>
                <Badge className={worker.averageRating >= 4.5 ? "bg-emerald-100 text-emerald-700" : worker.averageRating >= 4 ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"}>
                  {worker.averageRating.toFixed(1)}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-paragraph">
                {worker.totalReviews} reviews • {worker.flaggedReviews} flagged • completion {worker.completionRate}%
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
