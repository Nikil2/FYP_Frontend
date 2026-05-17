"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  UserCheck,
  Users,
  Search,
  Eye,
  Loader2,
  Ban,
  Shield,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { WorkerDetailModal } from "@/components/admin/WorkerDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAllWorkers,
  getPendingVerifications,
  blockUser,
  unblockUser,
} from "@/api/services/admin";
import type { WorkerProfile } from "@/api/services/admin";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "verified" | "pending" | "rejected" | "blocked";

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [pendingQueue, setPendingQueue] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  useEffect(() => {
    async function loadWorkers() {
      try {
        const [workersRes, pendingRes] = await Promise.all([
          getAllWorkers(1, 100),
          getPendingVerifications(),
        ]);
        setWorkers(workersRes.data || []);
        setPendingQueue(Array.isArray(pendingRes) ? pendingRes : pendingRes.data || []);
      } catch (error) {
        console.error("Failed to load workers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadWorkers();
  }, []);

  // Filter workers
  const filteredWorkers = useMemo(() => {
    let result = workers;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.user.fullName.toLowerCase().includes(q) ||
          w.user.phoneNumber.includes(q) ||
          w.id.toLowerCase().includes(q) ||
          w.services.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    switch (statusFilter) {
      case "verified":
        result = result.filter((w) => w.verificationStatus === "APPROVED" && !w.user.isBlocked);
        break;
      case "pending":
        result = result.filter((w) => w.verificationStatus === "PENDING");
        break;
      case "rejected":
        result = result.filter((w) => w.verificationStatus === "REJECTED");
        break;
      case "blocked":
        result = result.filter((w) => w.user.isBlocked);
        break;
    }

    return result;
  }, [workers, search, statusFilter]);

  // Stats
  const verifiedWorkers = workers.filter((w) => w.verificationStatus === "APPROVED").length;
  const blockedWorkers = workers.filter((w) => w.user.isBlocked).length;
  const averageRating =
    workers.reduce((sum, w) => sum + Number(w.averageRating || 0), 0) /
    Math.max(1, workers.length);

  const handleBlock = async (worker: WorkerProfile) => {
    try {
      if (worker.user.isBlocked) {
        await unblockUser(worker.userId);
      } else {
        await blockUser(worker.userId);
      }
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === worker.id
            ? { ...w, user: { ...w.user, isBlocked: !w.user.isBlocked } }
            : w
        )
      );
      if (selectedWorker?.id === worker.id) {
        setSelectedWorker({
          ...selectedWorker,
          user: { ...selectedWorker.user, isBlocked: !selectedWorker.user.isBlocked },
        });
      }
    } catch (error) {
      console.error("Failed to toggle block:", error);
    }
  };

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: workers.length },
    { key: "verified", label: "Verified", count: verifiedWorkers },
    { key: "pending", label: "Pending", count: pendingQueue.length },
    { key: "rejected", label: "Rejected", count: workers.filter((w) => w.verificationStatus === "REJECTED").length },
    { key: "blocked", label: "Blocked", count: blockedWorkers },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
        <p className="text-heading">Loading workers...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Workers"
        description="Live worker overview with verification queue, account health, and full profile details."
      />

      {/* Metric Cards */}
      <section className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Workers" value={workers.length.toString()} />
        <MetricCard
          label="Verified Workers"
          value={verifiedWorkers.toString()}
          hint={`${pendingQueue.length} waiting in queue`}
          tone="good"
        />
        <MetricCard
          label="Blocked Workers"
          value={blockedWorkers.toString()}
          hint={blockedWorkers > 0 ? "Review policy compliance" : "No blocks"}
          tone={blockedWorkers > 0 ? "warn" : "good"}
        />
        <MetricCard
          label="Avg. Rating"
          value={averageRating.toFixed(1)}
          hint="Based on live profiles"
          tone="good"
        />
      </section>

      {/* Search & Filters */}
      <Card className="rounded-2xl border-border/70 bg-card/95 mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-paragraph" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or service..."
              className="w-full rounded-xl border border-border bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === f.key
                    ? "bg-[#0d1f1a] text-white"
                    : "bg-muted text-paragraph hover:bg-muted/70"
                )}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Workers Table */}
      <Card className="rounded-2xl border-border/70 bg-card/95 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-paragraph">
                <th className="px-4 py-3">Worker</th>
                <th className="px-4 py-3">Services</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Jobs</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-paragraph">
                    No workers match the current filters.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr
                    key={worker.id}
                    className="border-b border-border/70 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedWorker(worker)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {worker.user.profilePicUrl ? (
                            <img
                              src={worker.user.profilePicUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-heading text-sm">{worker.user.fullName}</p>
                          <p className="text-[10px] text-paragraph">{worker.user.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {worker.services.slice(0, 2).map((s) => (
                          <span key={s.id} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                            {s.name}
                          </span>
                        ))}
                        {worker.services.length > 2 && (
                          <span className="text-[10px] text-paragraph">+{worker.services.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-heading">
                          {Number(worker.averageRating).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-heading">{worker.totalJobsCompleted}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className={cn(
                            "text-[10px]",
                            worker.verificationStatus === "APPROVED"
                              ? "bg-emerald-100 text-emerald-700"
                              : worker.verificationStatus === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {worker.verificationStatus}
                        </Badge>
                        {worker.user.isBlocked && (
                          <Badge className="bg-red-100 text-red-700 text-[10px]">Blocked</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => setSelectedWorker(worker)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "text-xs",
                            worker.user.isBlocked ? "text-emerald-600" : "text-red-600"
                          )}
                          onClick={() => handleBlock(worker)}
                        >
                          <Ban className="h-3.5 w-3.5" />
                          {worker.user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Verification Snapshot */}
      {pendingQueue.length > 0 && (
        <Card className="mt-4 rounded-2xl border-amber-200 bg-amber-50/50">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-heading">
            <Shield className="h-5 w-5 text-amber-600" />
            Pending Verification ({pendingQueue.length})
          </h2>
          <div className="grid gap-2 md:grid-cols-2">
            {pendingQueue.map((worker) => (
              <button
                key={worker.id}
                onClick={() => setSelectedWorker(worker)}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-white p-3 text-left hover:bg-amber-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-heading text-sm">{worker.user.fullName}</p>
                  <p className="text-[10px] text-paragraph">
                    {worker.services.map((s) => s.name).join(" • ")}
                  </p>
                </div>
                <Eye className="h-4 w-4 text-paragraph" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Worker Detail Modal */}
      <WorkerDetailModal
        worker={selectedWorker}
        isOpen={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onBlock={handleBlock}
      />
    </div>
  );
}
