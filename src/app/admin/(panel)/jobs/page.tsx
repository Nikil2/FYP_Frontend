"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Clock3, MessageSquare, ShieldAlert, UserRound } from "lucide-react";
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
  if (!value) {
    return "Not scheduled";
  }

  return new Date(value).toLocaleString();
}

function statusTone(status: string) {
  if (status === "IN_PROGRESS" || status === "ACCEPTED") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "COMPLETED") {
    return "bg-sky-100 text-sky-700";
  }
  if (status === "DISPUTED" || status === "CANCELLED") {
    return "bg-red-100 text-red-700";
  }
  return "bg-amber-100 text-amber-700";
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<AdminJobDetail | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
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

        setSelectedJobId((currentId) => {
          if (currentId && response.data.some((job) => job.id === currentId)) {
            return currentId;
          }
          return response.data[0]?.id || null;
        });
      } catch (error) {
        console.error("Failed to load admin jobs:", error);
        setJobs([]);
        setSelectedJobId(null);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [search, statusFilter]);

  useEffect(() => {
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

    if (!selectedJobId) {
      setSelectedJob(null);
      return;
    }

    loadDetail(selectedJobId);
  }, [selectedJobId]);

  const activeJobs = useMemo(
    () => jobs.filter((job) => ["PENDING", "NEGOTIATION", "ACCEPTED", "IN_PROGRESS"].includes(job.status)).length,
    [jobs],
  );
  const disputedJobs = useMemo(() => jobs.filter((job) => job.status === "DISPUTED").length, [jobs]);
  const inProgressJobs = useMemo(() => jobs.filter((job) => job.status === "IN_PROGRESS").length, [jobs]);

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

      <Card className="mt-5 rounded-2xl border-border/70 bg-card/95 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-3">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Search by booking ID, worker, customer, address, or service
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
              onChange={(event) => setStatusFilter(event.target.value as JobStatusFilter)}
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

      <section className="mt-5 grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3 overflow-hidden rounded-2xl border-border/70 bg-card/95 p-0">
          {loading ? (
            <div className="px-4 py-8 text-center text-paragraph">Loading jobs...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-[0.12em] text-paragraph">
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Worker</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Signals</th>
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
                      <tr key={job.id} className="border-b border-border/70 text-sm">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-heading">{job.id}</p>
                          <p className="text-xs text-paragraph">{toDateLabel(job.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-heading">{job.worker.user.fullName}</p>
                          <p className="text-xs text-paragraph">Worker ID: {job.worker.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-heading">{job.customer.fullName}</p>
                          <p className="text-xs text-paragraph">{job.customer.phoneNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-heading">{job.service.name}</p>
                          <p className="text-xs text-paragraph">{job.jobAddress}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={statusTone(job.status)}>{job.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-paragraph">
                          Msg {job.counts.messages} • Proposal {job.counts.proposals} • Complaint {job.counts.complaints}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant={selectedJobId === job.id ? "default" : "outline"}
                            onClick={() => setSelectedJobId(job.id)}
                          >
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

        <Card className="xl:col-span-2 rounded-2xl border-border/70 bg-card/95">
          {detailLoading ? (
            <div className="flex min-h-[420px] items-center justify-center text-paragraph">Loading job details...</div>
          ) : !selectedJob ? (
            <div className="flex min-h-[420px] items-center justify-center text-center text-paragraph">
              Select a job to view end-to-end details.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Booking ID</p>
                <p className="font-semibold text-heading">{selectedJob.id}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusTone(selectedJob.status)}>{selectedJob.status}</Badge>
                <Badge className="bg-stone-100 text-stone-700">{selectedJob.service.name}</Badge>
                {selectedJob.finalPrice ? (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Rs. {selectedJob.finalPrice.toLocaleString()}
                  </Badge>
                ) : null}
              </div>

              <div className="rounded-xl border border-border/70 p-3 text-sm">
                <p className="font-semibold text-heading">{selectedJob.description}</p>
                <p className="mt-1 text-paragraph">{selectedJob.jobAddress}</p>
                <p className="mt-1 text-xs text-paragraph">
                  Scheduled: {toDateLabel(selectedJob.scheduledAt)}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border/70 p-3">
                  <p className="mb-1 text-xs uppercase tracking-[0.12em] text-paragraph">Worker</p>
                  <p className="font-semibold text-heading">{selectedJob.worker.user.fullName}</p>
                  <p className="text-xs text-paragraph">Worker ID: {selectedJob.worker.id}</p>
                  <p className="text-xs text-paragraph">Phone: {selectedJob.worker.user.phoneNumber}</p>
                  <p className="text-xs text-paragraph">
                    Rating {selectedJob.worker.averageRating.toFixed(1)} • {selectedJob.worker.totalJobsCompleted} jobs
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 p-3">
                  <p className="mb-1 text-xs uppercase tracking-[0.12em] text-paragraph">Customer</p>
                  <p className="font-semibold text-heading">{selectedJob.customer.fullName}</p>
                  <p className="text-xs text-paragraph">Customer ID: {selectedJob.customerId}</p>
                  <p className="text-xs text-paragraph">Phone: {selectedJob.customer.phoneNumber}</p>
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <span className="flex items-center gap-2 text-paragraph">
                    <MessageSquare className="h-4 w-4 text-sky-600" />
                    Messages
                  </span>
                  <span className="font-semibold text-heading">{selectedJob.summary.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <span className="flex items-center gap-2 text-paragraph">
                    <BriefcaseBusiness className="h-4 w-4 text-emerald-600" />
                    Price proposals
                  </span>
                  <span className="font-semibold text-heading">{selectedJob.summary.totalProposals}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <span className="flex items-center gap-2 text-paragraph">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    Complaints
                  </span>
                  <span className="font-semibold text-heading">{selectedJob.summary.totalComplaints}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <span className="flex items-center gap-2 text-paragraph">
                    <Clock3 className="h-4 w-4 text-purple-600" />
                    Latest message
                  </span>
                  <span className="font-semibold text-heading">
                    {toDateLabel(selectedJob.messages[0]?.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <span className="flex items-center gap-2 text-paragraph">
                    <UserRound className="h-4 w-4 text-rose-600" />
                    Feedback
                  </span>
                  <span className="font-semibold text-heading">
                    {selectedJob.feedback ? `${selectedJob.feedback.rating}/5` : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
