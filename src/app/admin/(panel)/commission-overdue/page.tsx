"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import {
  getOverdueWorkers,
  type OverdueWorker,
  type OverdueWorkersResponse,
} from "@/api/services/commission";
import { blockUser, unblockUser } from "@/api/services/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  RefreshCw,
  Clock,
  Ban,
  CheckCircle2,
  Phone,
} from "lucide-react";

const rs = (n: number) => `Rs. ${Number(n ?? 0).toLocaleString()}`;

export default function AdminCommissionOverduePage() {
  const [data, setData] = useState<OverdueWorkersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getOverdueWorkers();
      setData(result);
    } catch (error) {
      console.error("Failed to load overdue workers:", error);
      toast.error("Could not load overdue workers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleBlock = async (worker: OverdueWorker) => {
    const blocking = !worker.isBlocked;

    if (
      blocking &&
      !window.confirm(
        `Block ${worker.fullName}? They will not be able to use the platform until unblocked.`,
      )
    ) {
      return;
    }

    setActingOn(worker.userId);
    try {
      if (blocking) {
        await blockUser(worker.userId);
        toast.success(`${worker.fullName} has been blocked`);
      } else {
        await unblockUser(worker.userId);
        toast.success(`${worker.fullName} has been unblocked`);
      }
      await load();
    } catch (error) {
      console.error("Block toggle failed:", error);
      toast.error("Action failed — please try again");
    } finally {
      setActingOn(null);
    }
  };

  const workers = data?.workers ?? [];

  return (
    <div className="p-4 md:p-6">
      <AdminPageHeader
        title="Commission Overdue"
        description="Workers past their 15-day commission deadline. Review and take action."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Overdue Workers"
          value={String(data?.totalOverdue ?? 0)}
          hint={
            data?.newlyFlagged
              ? `${data.newlyFlagged} newly flagged`
              : "No new flags"
          }
          tone={data?.totalOverdue ? "warn" : "good"}
        />
        <MetricCard
          label="Total Owed"
          value={rs(data?.totalAmountOwed ?? 0)}
          hint="Unpaid commission across all overdue workers"
          tone={data?.totalAmountOwed ? "warn" : "neutral"}
        />
        <MetricCard
          label="Awaiting Your Review"
          value={String(data?.awaitingReview ?? 0)}
          hint="Proof submitted — verify before blocking"
          tone={data?.awaitingReview ? "warn" : "neutral"}
        />
        <MetricCard
          label="Blocked"
          value={String(workers.filter((w) => w.isBlocked).length)}
          hint="Currently blocked from the platform"
        />
      </div>

      {/* List */}
      <Card className="rounded-2xl border-border/70 bg-card/90 p-0 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-tertiary" />
          </div>
        ) : workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
            <p className="font-medium text-heading">No overdue workers</p>
            <p className="mt-1 text-sm text-paragraph">
              Everyone is up to date on their commission payments.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {workers.map((worker) => (
              <div
                key={worker.workerId}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                {/* Worker */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-heading">
                      {worker.fullName}
                    </h3>

                    {worker.isBlocked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        <Ban className="h-3 w-3" />
                        Blocked
                      </span>
                    )}

                    {worker.hasPendingSubmission && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        <Clock className="h-3 w-3" />
                        Proof submitted
                      </span>
                    )}

                    {worker.daysOverdue >= 30 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        30+ days
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-paragraph">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {worker.phoneNumber}
                    </span>
                    {worker.city && <span>{worker.city}</span>}
                    <span>{worker.totalJobsCompleted} jobs completed</span>
                  </div>

                  {worker.hasPendingSubmission && (
                    <p className="mt-2 text-xs text-blue-700">
                      This worker has already uploaded payment proof — verify it
                      in Finance before blocking.
                    </p>
                  )}
                </div>

                {/* Amount + overdue */}
                <div className="flex items-center gap-6 md:gap-8">
                  <div className="text-right">
                    <p className="text-xs text-paragraph">Owed</p>
                    <p className="text-lg font-bold text-red-600">
                      {rs(worker.amountDue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-paragraph">Overdue</p>
                    <p
                      className={cn(
                        "text-lg font-bold",
                        worker.daysOverdue >= 30
                          ? "text-red-600"
                          : "text-amber-600",
                      )}
                    >
                      {worker.daysOverdue}d
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actingOn === worker.userId}
                    onClick={() => handleToggleBlock(worker)}
                    className={cn(
                      "min-w-[96px]",
                      !worker.isBlocked &&
                        "border-red-300 text-red-700 hover:bg-red-50",
                    )}
                  >
                    {actingOn === worker.userId
                      ? "…"
                      : worker.isBlocked
                        ? "Unblock"
                        : "Block"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
