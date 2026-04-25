"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  pendingVerificationsSeed,
  WorkerVerificationItem,
} from "@/lib/admin-mock-data";

interface ProcessedWorker {
  worker: WorkerVerificationItem;
  decision: "APPROVED" | "REJECTED";
  notes: string;
}

export default function AdminVerificationPage() {
  const [queue, setQueue] = useState<WorkerVerificationItem[]>(pendingVerificationsSeed);
  const [processed, setProcessed] = useState<ProcessedWorker[]>([]);

  const processWorker = (
    worker: WorkerVerificationItem,
    decision: ProcessedWorker["decision"],
  ) => {
    setQueue((prev) => prev.filter((entry) => entry.workerId !== worker.workerId));
    setProcessed((prev) => [
      {
        worker,
        decision,
        notes:
          decision === "APPROVED"
            ? "Documents accepted, worker can start receiving bookings."
            : "Submission rejected in demo mode for re-upload.",
      },
      ...prev,
    ]);
  };

  return (
    <div>
      <AdminPageHeader
        title="Worker Verification Queue"
        description="Approve or reject onboarding requests with one-click frontend simulation."
        action={<Badge className="bg-amber-100 text-amber-700">{queue.length} pending</Badge>}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {queue.length === 0 ? (
            <Card className="rounded-2xl border-border/70 bg-card/95">
              <p className="text-sm text-paragraph">Queue is empty. All pending workers have been reviewed in this demo session.</p>
            </Card>
          ) : (
            queue.map((worker) => (
              <Card key={worker.workerId} className="rounded-2xl border-border/70 bg-card/95">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-heading">{worker.fullName}</p>
                    <p className="text-xs text-paragraph">{worker.workerId} • {worker.phoneNumber}</p>
                    <p className="mt-2 text-sm text-paragraph">
                      Services: {worker.services.join(", ")} • Experience: {worker.experienceYears} years
                    </p>
                    <p className="text-sm text-paragraph">Visiting charges: Rs. {worker.visitingCharges}</p>
                    <p className="text-xs text-paragraph">Submitted: {worker.submittedAt}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => processWorker(worker, "APPROVED")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-700"
                      onClick={() => processWorker(worker, "REJECTED")}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-3 text-lg font-semibold text-heading">Recent Decisions</h2>
          <div className="space-y-3">
            {processed.length === 0 ? (
              <p className="text-sm text-paragraph">No decisions yet. Take action from the queue.</p>
            ) : (
              processed.map((entry) => (
                <div key={`${entry.worker.workerId}-${entry.decision}`} className="rounded-xl border border-border/70 bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-heading">{entry.worker.fullName}</p>
                    <Badge className={entry.decision === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                      {entry.decision}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-paragraph">{entry.notes}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
