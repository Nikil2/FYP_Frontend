"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, UserCheck, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAllWorkers, getPendingVerifications } from "@/api/services/admin";
import type { WorkerProfile } from "@/api/services/admin";

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [pendingQueue, setPendingQueue] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkers() {
      try {
        const [workersRes, pendingRes] = await Promise.all([
          getAllWorkers(1, 100),
          getPendingVerifications(),
        ]);
        setWorkers(workersRes.data);
        setPendingQueue(pendingRes.data);
      } catch (error) {
        console.error("Failed to load workers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkers();
  }, []);

  const verifiedWorkers = workers.filter((worker) => worker.verificationStatus === "APPROVED").length;
  const blockedWorkers = workers.filter((worker) => worker.user.isBlocked).length;
  const averageRating = workers.reduce((sum, worker) => sum + Number(worker.averageRating || 0), 0) / Math.max(1, workers.length);
  const topWorkers = useMemo(
    () => [...workers].sort((a, b) => Number(b.averageRating) - Number(a.averageRating)).slice(0, 8),
    [workers],
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading workers...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Workers"
        description="Live worker overview with verification queue and account health."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Workers in List" value={workers.length.toString()} />
        <MetricCard
          label="Verified Workers"
          value={verifiedWorkers.toString()}
          hint={`${pendingQueue.length} waiting in verification queue`}
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
          hint="Based on live worker profiles"
          tone="good"
        />
      </section>

      <Card className="mt-6 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-heading">
          <UserCheck className="h-5 w-5 text-emerald-700" />
          Worker Accounts
        </h2>

        <div className="space-y-3">
          {workers.length === 0 ? (
            <p className="text-sm text-paragraph">No workers found.</p>
          ) : (
            workers.map((worker) => (
              <div key={worker.id} className="flex flex-col gap-2 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-heading">{worker.user.fullName}</p>
                  <p className="text-xs text-paragraph">{worker.user.phoneNumber} • ID {worker.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={worker.verificationStatus === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                    {worker.verificationStatus}
                  </Badge>
                  <Badge className={worker.user.isBlocked ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"}>
                    {worker.user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="mt-4 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <Users className="h-5 w-5 text-sky-700" />
          Pending Verification Snapshot
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {pendingQueue.length === 0 ? (
            <p className="text-sm text-paragraph">No pending verifications.</p>
          ) : (
            pendingQueue.map((worker) => (
              <div key={worker.id} className="rounded-xl border border-border/70 p-3">
                <p className="font-semibold text-heading">{worker.user.fullName}</p>
                <p className="text-xs text-paragraph">{worker.services.map((service) => service.name).join(" • ")}</p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="mt-4 rounded-2xl border-border/70 bg-card/95">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <Star className="h-5 w-5 text-amber-500" />
          Worker Ratings Health
        </h2>
        <div className="space-y-3">
          {topWorkers.length === 0 ? (
            <p className="text-sm text-paragraph">No worker ratings available.</p>
          ) : (
            topWorkers.map((worker) => (
              <div key={worker.id} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-heading">{worker.user.fullName}</p>
                    <p className="text-xs text-paragraph">{worker.services.map((service) => service.name).join(" • ")}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {Number(worker.averageRating).toFixed(1)}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-paragraph">
                  {worker.totalJobsCompleted} completed jobs
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
