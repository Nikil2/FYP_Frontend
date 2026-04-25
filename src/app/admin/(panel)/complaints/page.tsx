"use client";

import { useMemo, useState } from "react";
import { Check, Clock3 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { complaintsSeed, ComplaintItem } from "@/lib/admin-mock-data";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(complaintsSeed);

  const unresolvedCount = useMemo(
    () => complaints.filter((complaint) => !complaint.isResolved).length,
    [complaints],
  );

  const resolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, isResolved: true } : complaint,
      ),
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Complaints & Disputes"
        description="Monitor disputes, apply decisions, and keep customer trust high with timely resolutions."
        action={<Badge className="bg-amber-100 text-amber-700">{unresolvedCount} unresolved</Badge>}
      />

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="rounded-2xl border-border/70 bg-card/95">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-heading">{complaint.id}</p>
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
                  <Badge className={complaint.isResolved ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                    {complaint.isResolved ? "Resolved" : "Open"}
                  </Badge>
                </div>

                <p className="mt-2 text-sm text-paragraph">{complaint.description}</p>
                <p className="mt-2 text-xs text-paragraph">
                  Booking {complaint.bookingId} • {complaint.customerName} vs {complaint.workerName}
                </p>
                <p className="text-xs text-paragraph">Created at {complaint.createdAt}</p>
              </div>

              <div className="flex items-center gap-2">
                {complaint.isResolved ? (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    <Check className="h-4 w-4" />
                    Closed
                  </span>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="text-paragraph">
                      <Clock3 className="h-4 w-4" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => resolveComplaint(complaint.id)}
                    >
                      Resolve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
