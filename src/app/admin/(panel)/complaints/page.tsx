"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock3 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { assignComplaint, getComplaints, resolveComplaint } from "@/api/services/admin";
import type { Complaint } from "@/api/services/admin";
import { getAdminSession } from "@/lib/admin-auth";

function getSeverity(complaint: Complaint): "HIGH" | "MEDIUM" | "LOW" {
  if (complaint.evidenceUrls.length > 0) return "HIGH";
  if ((complaint.description || "").length > 80) return "MEDIUM";
  return "LOW";
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComplaints() {
      try {
        const response = await getComplaints(1, 100);
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to load complaints:", error);
      } finally {
        setLoading(false);
      }
    }

    loadComplaints();
  }, []);

  const unresolvedCount = useMemo(
    () => complaints.filter((complaint) => !complaint.isResolved).length,
    [complaints],
  );

  const onResolveComplaint = async (id: string) => {
    try {
      await resolveComplaint(id);
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === id ? { ...complaint, isResolved: true } : complaint,
        ),
      );
    } catch (error) {
      console.error("Failed to resolve complaint:", error);
    }
  };

  const onAssignComplaint = async (id: string) => {
    const session = getAdminSession();
    if (!session?.adminId) {
      return;
    }

    try {
      const response = await assignComplaint(id, session.adminId);
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === id ? { ...complaint, admin: response.data.admin } : complaint,
        ),
      );
    } catch (error) {
      console.error("Failed to assign complaint:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/95 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Complaints & Disputes"
        description="Monitor disputes, apply decisions, and keep customer trust high with timely resolutions."
        action={<Badge className="bg-amber-100 text-amber-700">{unresolvedCount} unresolved</Badge>}
      />

      <div className="grid gap-4">
        {complaints.map((complaint) => {
          const severity = getSeverity(complaint);

          return (
            <Card key={complaint.id} className="rounded-2xl border-border/70 bg-card/95">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-heading">{complaint.id}</p>
                    <Badge
                      className={
                        severity === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-sky-700"
                      }
                    >
                      {severity}
                    </Badge>
                    <Badge className={complaint.isResolved ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                      {complaint.isResolved ? "Resolved" : "Open"}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-paragraph">{complaint.description}</p>
                  <p className="mt-2 text-xs text-paragraph">
                    Booking {complaint.bookingId} • {complaint.booking.customer.fullName} vs {complaint.booking.worker.user.fullName}
                  </p>
                  <p className="text-xs text-paragraph">Created at {new Date(complaint.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  {complaint.isResolved ? (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      <Check className="h-4 w-4" />
                      Closed
                    </span>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-paragraph"
                        onClick={() => onAssignComplaint(complaint.id)}
                      >
                        <Clock3 className="h-4 w-4" />
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => onResolveComplaint(complaint.id)}
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
