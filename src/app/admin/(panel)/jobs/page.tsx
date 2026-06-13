"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Calendar,
  Clock3,
  Hash,
  MapPin,
  MessageSquare,
  Phone,
  ShieldAlert,
  Star,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminJobById, getAdminJobs } from "@/api/services/admin";
import type { AdminJob, AdminJobDetail } from "@/api/services/admin";

type JobStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "PENDING"
  | "NEGOTIATION"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

function toDateLabel(value?: string | null) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString();
}

function statusTone(status: string) {
  if (status === "IN_PROGRESS" || status === "ACCEPTED") return "bg-emerald-100 text-emerald-700";
  if (status === "COMPLETED") return "bg-sky-100 text-sky-700";
  if (status === "DISPUTED" || status === "CANCELLED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

function statusTopBorder(status: string) {
  if (status === "IN_PROGRESS" || status === "ACCEPTED") return "border-t-4 border-t-emerald-500";
  if (status === "COMPLETED") return "border-t-4 border-t-sky-500";
  if (status === "DISPUTED" || status === "CANCELLED") return "border-t-4 border-t-red-500";
  return "border-t-4 border-t-amber-400";
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function JobDetailModal({
  job,
  loading,
  onClose,
}: {
  job: AdminJobDetail | null;
  loading: boolean;
  onClose: () => void;
}) {
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ${
          job ? statusTopBorder(job.status) : ""
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border/60 bg-white px-6 py-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-paragraph">
              Booking Detail
            </p>
            {job && (
              <div className="mt-1 flex items-center gap-1.5">
                <Hash className="h-3 w-3 shrink-0 text-paragraph" />
                <p className="truncate font-mono text-xs text-heading/60">{job.id}</p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-paragraph transition hover:bg-muted/80 hover:text-heading"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-emerald-500" />
                <p className="text-sm text-paragraph">Loading booking details…</p>
              </div>
            </div>
          ) : !job ? (
            <div className="flex min-h-[300px] items-center justify-center text-paragraph">
              Failed to load job details.
            </div>
          ) : (
            <div className="space-y-6">

              {/* Status + price row */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${statusTone(job.status)} px-3 py-1 text-xs font-semibold`}>
                  {job.status.replace("_", " ")}
                </Badge>
                <div className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1">
                  <Wrench className="h-3 w-3 text-stone-500" />
                  <span className="text-xs font-medium text-stone-700">{job.service.name}</span>
                </div>
                {job.finalPrice ? (
                  <div className="rounded-full bg-emerald-50 px-3 py-1">
                    <span className="text-xs font-semibold text-emerald-700">
                      Rs. {job.finalPrice.toLocaleString()}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Job location + schedule */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-paragraph">
                  Job Info
                </p>
                <p className="text-sm font-semibold text-heading">{job.description}</p>
                <div className="mt-2 flex items-start gap-2 text-xs text-paragraph">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                  <span>{job.jobAddress}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-paragraph">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                  <span>Scheduled: {toDateLabel(job.scheduledAt)}</span>
                </div>
              </div>

              {/* Worker + Customer side by side */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Worker */}
                <div className="rounded-xl border border-border/60 p-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-paragraph">
                    Worker
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {initials(job.worker.user.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-heading">{job.worker.user.fullName}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-paragraph">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{job.worker.averageRating.toFixed(1)}</span>
                        <span className="text-border">•</span>
                        <span>{job.worker.totalJobsCompleted} jobs</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
                    <div className="flex items-center gap-2 text-xs text-paragraph">
                      <Phone className="h-3 w-3 text-emerald-500" />
                      <span>{job.worker.user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-paragraph">
                      <Hash className="h-3 w-3 text-paragraph/50" />
                      <span className="truncate font-mono">{job.worker.id}</span>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                <div className="rounded-xl border border-border/60 p-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-paragraph">
                    Customer
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                      {initials(job.customer.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-heading">{job.customer.fullName}</p>
                      <p className="text-xs text-paragraph">Customer</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
                    <div className="flex items-center gap-2 text-xs text-paragraph">
                      <Phone className="h-3 w-3 text-sky-500" />
                      <span>{job.customer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-paragraph">
                      <Hash className="h-3 w-3 text-paragraph/50" />
                      <span className="truncate font-mono">{job.customerId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <div className="flex flex-col gap-2 rounded-xl bg-sky-50 p-3">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-sky-600" />
                    <span className="text-[11px] font-medium text-sky-700">Messages</span>
                  </div>
                  <span className="text-2xl font-bold text-sky-700">
                    {job.summary.totalMessages}
                  </span>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-emerald-50 p-3">
                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[11px] font-medium text-emerald-700">Proposals</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">
                    {job.summary.totalProposals}
                  </span>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-amber-50 p-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-[11px] font-medium text-amber-700">Complaints</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-700">
                    {job.summary.totalComplaints}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col gap-2 rounded-xl bg-purple-50 p-3 sm:col-span-1">
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-[11px] font-medium text-purple-700">Latest Msg</span>
                  </div>
                  <span className="text-xs font-semibold leading-snug text-purple-700">
                    {toDateLabel(job.messages[0]?.createdAt)}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col gap-2 rounded-xl bg-rose-50 p-3 sm:col-span-1">
                  <div className="flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5 text-rose-600" />
                    <span className="text-[11px] font-medium text-rose-700">Feedback</span>
                  </div>
                  <span className="text-2xl font-bold text-rose-700">
                    {job.feedback ? `${job.feedback.rating}/5` : "—"}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<AdminJobDetail | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const response = await getAdminJobs(1, 100, statusFilter, search || undefined);
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to load admin jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [search, statusFilter]);

  useEffect(() => {
    if (!selectedJobId) {
      setSelectedJob(null);
      return;
    }

    async function loadDetail(jobId: string) {
      try {
        setDetailLoading(true);
        const response = await getAdminJobById(jobId);
        setSelectedJob(response.data);
      } catch (error) {
        console.error("Failed to load job detail:", error);
        setSelectedJob(null);
      } finally {
        setDetailLoading(false);
      }
    }

    loadDetail(selectedJobId);
  }, [selectedJobId]);

  function openDetail(jobId: string) {
    setSelectedJobId(jobId);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedJobId(null);
    setSelectedJob(null);
  }

  const activeJobs = useMemo(
    () =>
      jobs.filter((job) =>
        ["PENDING", "NEGOTIATION", "ACCEPTED", "IN_PROGRESS"].includes(job.status),
      ).length,
    [jobs],
  );
  const disputedJobs = useMemo(() => jobs.filter((job) => job.status === "DISPUTED").length, [jobs]);
  const inProgressJobs = useMemo(
    () => jobs.filter((job) => job.status === "IN_PROGRESS").length,
    [jobs],
  );

  return (
    <div>
      <AdminPageHeader
        title="Jobs & Bookings"
        description="View live jobs, assigned worker IDs, customer details, and complete booking lifecycle data."
        action={<Badge className="bg-emerald-100 text-emerald-700">{jobs.length} jobs loaded</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active Jobs" value={activeJobs.toString()} hint="Pending to in-progress" tone="good" />
        <MetricCard label="In Progress" value={inProgressJobs.toString()} hint="Workers currently on-site or working" />
        <MetricCard
          label="Disputed Jobs"
          value={disputedJobs.toString()}
          hint={disputedJobs > 0 ? "Needs immediate attention" : "No active disputes"}
          tone={disputedJobs > 0 ? "warn" : "good"}
        />
      </section>

      {/* Filters */}
      <Card className="mt-5 rounded-2xl border-border/70 bg-card/95 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-3">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Search by booking ID, worker, customer, address, or service
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try booking ID, worker name, customer phone..."
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as JobStatusFilter)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            >
              <option value="ACTIVE">Active (Live)</option>
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DISPUTED">Disputed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Full-width jobs table */}
      <Card className="mt-5 overflow-hidden rounded-2xl border-border/70 bg-card/95 p-0">
        {loading ? (
          <div className="p-4 space-y-0">
            <div className="h-10 bg-gray-100 rounded-t-xl animate-pulse mb-0" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-border">
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-[0.12em] text-paragraph">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Worker</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Signals</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-paragraph">
                      No jobs found for this filter.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="border-b border-border/70 text-sm hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-heading">{job.customer.fullName}</p>
                        <p className="text-xs text-paragraph">{job.customer.phoneNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-heading">{job.worker.user.fullName}</p>
                        <p className="text-xs text-paragraph">{job.worker.user.phoneNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-heading">{job.service.name}</p>
                        <p className="max-w-[180px] truncate text-xs text-paragraph">{job.jobAddress}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusTone(job.status)}>{job.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-paragraph">
                        Msg {job.counts.messages} • Proposal {job.counts.proposals} • Complaint{" "}
                        {job.counts.complaints}
                      </td>
                      <td className="px-4 py-3 text-xs text-paragraph">
                        {toDateLabel(job.scheduledAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => openDetail(job.id)}>
                          View detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail modal */}
      {modalOpen && (
        <JobDetailModal job={selectedJob} loading={detailLoading} onClose={closeModal} />
      )}
    </div>
  );
}
