"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileBadge,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  approveWorkerVerification,
  getPendingVerifications,
  rejectWorkerVerification,
} from "@/api/services/admin";
import type { WorkerProfile } from "@/api/services/admin";

interface ProcessedWorker {
  worker: WorkerProfile;
  decision: "APPROVED" | "REJECTED";
  notes: string;
}

interface PreviewImage {
  url: string;
  title: string;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 py-2 text-sm last:border-b-0">
      <span className="text-paragraph">{label}</span>
      <span className="text-right font-medium text-heading">{value}</span>
    </div>
  );
}

export default function AdminVerificationPage() {
  const [queue, setQueue] = useState<WorkerProfile[]>([]);
  const [processed, setProcessed] = useState<ProcessedWorker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      try {
        const response = await getPendingVerifications();
        setQueue(response.data);
      } catch (error) {
        console.error("Failed to load verification queue:", error);
      } finally {
        setLoading(false);
      }
    }

    loadQueue();
  }, []);

  const documents = useMemo(() => {
    if (!selectedWorker) return [];

    return [
      { label: "CNIC Front", url: selectedWorker.cnicFrontUrl },
      { label: "CNIC Back", url: selectedWorker.cnicBackUrl },
      { label: "Selfie", url: selectedWorker.selfieImageUrl },
      { label: "Profile Picture", url: selectedWorker.user.profilePicUrl },
    ].filter((item): item is { label: string; url: string } => Boolean(item.url));
  }, [selectedWorker]);

  const openDetailsModal = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setPreviewImage(null);
  };

  const processWorker = async (worker: WorkerProfile, decision: ProcessedWorker["decision"]) => {
    try {
      if (decision === "APPROVED") {
        await approveWorkerVerification(worker.id);
      } else {
        await rejectWorkerVerification(worker.id, "Verification rejected");
      }

      const updatedQueue = queue.filter((entry) => entry.id !== worker.id);
      setQueue(updatedQueue);

      if (selectedWorker?.id === worker.id) {
        setSelectedWorker(updatedQueue[0] || null);
      }

      setProcessed((prev) => [
        {
          worker,
          decision,
          notes:
            decision === "APPROVED"
              ? "Documents accepted, worker can start receiving bookings."
              : "Verification rejected. Worker can re-submit documents.",
        },
        ...prev,
      ]);

      if (showDetailsModal && selectedWorker?.id === worker.id) {
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Failed to process worker verification:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading verification queue...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Worker Verification Queue"
        description="Open a full popup detail component for each worker before approval."
        action={<Badge className="bg-amber-100 text-amber-700">{queue.length} pending</Badge>}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {queue.length === 0 ? (
            <Card className="rounded-2xl border-border/70 bg-card/95">
              <p className="text-sm text-paragraph">Queue is empty. All pending workers have been reviewed.</p>
            </Card>
          ) : (
            queue.map((worker) => (
              <Card key={worker.id} className="rounded-2xl border border-border/70 bg-card/95">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-heading">{worker.user.fullName}</p>
                    <p className="mt-1 text-xs text-paragraph">{worker.id} • {worker.user.phoneNumber}</p>
                    <p className="mt-2 text-sm text-paragraph">
                      {worker.services.map((service) => service.name).join(", ") || "No services selected"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className="bg-sky-100 text-sky-700">{worker.experienceYears}y exp</Badge>
                      <Badge className="bg-emerald-100 text-emerald-700">Rs. {worker.visitingCharges}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDetailsModal(worker)}>
                      <Eye className="h-4 w-4" />
                      Open Popup
                    </Button>
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
                <div key={`${entry.worker.id}-${entry.decision}`} className="rounded-xl border border-border/70 bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-heading">{entry.worker.user.fullName}</p>
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

      {showDetailsModal && selectedWorker ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 md:p-8">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col rounded-3xl border border-border bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 md:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Full Verification Component</p>
                <h2 className="text-xl font-semibold text-heading">{selectedWorker.user.fullName}</h2>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-paragraph transition hover:bg-muted"
                onClick={closeDetailsModal}
                aria-label="Close details modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="rounded-2xl border-border/70 bg-card/95">
                  <p className="mb-2 text-sm font-semibold text-heading">Identity & Profile</p>
                  <DetailRow label="Name" value={selectedWorker.user.fullName} />
                  <DetailRow label="Phone" value={selectedWorker.user.phoneNumber} />
                  <DetailRow label="Worker ID" value={selectedWorker.id} />
                  <DetailRow label="User ID" value={selectedWorker.userId} />
                  <DetailRow label="CNIC" value={selectedWorker.cnicNumber} />
                  <DetailRow
                    label="Submitted At"
                    value={selectedWorker.submittedAt ? new Date(selectedWorker.submittedAt).toLocaleString() : "-"}
                  />
                </Card>

                <Card className="rounded-2xl border-border/70 bg-card/95">
                  <p className="mb-2 text-sm font-semibold text-heading">Work Details</p>
                  <DetailRow label="Experience" value={`${selectedWorker.experienceYears} years`} />
                  <DetailRow label="Charges" value={`Rs. ${selectedWorker.visitingCharges}`} />
                  <DetailRow label="Address" value={selectedWorker.homeAddress} />
                  <DetailRow
                    label="Coordinates"
                    value={`${selectedWorker.homeLat ?? "-"}, ${selectedWorker.homeLng ?? "-"}`}
                  />
                  <div className="mt-3 rounded-xl border border-border/70 bg-muted/20 p-3 text-sm text-paragraph">
                    <p className="mb-1 font-medium text-heading">Bio</p>
                    {selectedWorker.bio || "No bio provided"}
                  </div>
                </Card>

                <Card className="rounded-2xl border-border/70 bg-card/95 lg:col-span-2">
                  <p className="mb-2 text-sm font-semibold text-heading">Selected Services</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.services.length ? (
                      selectedWorker.services.map((service) => (
                        <Badge key={service.id} className="bg-sky-100 text-sky-700">{service.name}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-paragraph">No services selected</span>
                    )}
                  </div>
                </Card>

                <Card className="rounded-2xl border-border/70 bg-card/95">
                  <p className="mb-2 text-sm font-semibold text-heading">Verification Documents</p>
                  <div className="grid gap-2">
                    {documents.length ? (
                      documents.map((doc) => (
                        <button
                          key={doc.label}
                          type="button"
                          className="rounded-lg border border-border/70 bg-muted/30 p-2 text-left transition hover:border-emerald-400"
                          onClick={() => setPreviewImage({ title: doc.label, url: doc.url })}
                        >
                          <p className="inline-flex items-center gap-2 text-sm font-medium text-heading">
                            <FileBadge className="h-4 w-4 text-emerald-700" />
                            {doc.label}
                          </p>
                          <p className="mt-1 text-xs text-sky-700">Click to preview</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-paragraph">No documents available</p>
                    )}
                  </div>
                </Card>

                <Card className="rounded-2xl border-border/70 bg-card/95">
                  <p className="mb-2 text-sm font-semibold text-heading">Portfolio Photos</p>
                  <div className="grid gap-2">
                    {selectedWorker.portfolio && selectedWorker.portfolio.length > 0 ? (
                      selectedWorker.portfolio.map((photo, index) => (
                        <button
                          key={photo.id}
                          type="button"
                          className="rounded-lg border border-border/70 bg-muted/30 p-2 text-left transition hover:border-emerald-400"
                          onClick={() => setPreviewImage({ title: `Work Photo ${index + 1}`, url: photo.imageUrl })}
                        >
                          <p className="text-sm font-medium text-heading">Work Photo {index + 1}</p>
                          <p className="mt-1 text-xs text-paragraph">{photo.description || "No description"}</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-paragraph">No work photos submitted.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/70 px-5 py-4 md:px-6">
              <div className="flex items-center gap-2 text-xs text-paragraph">
                <ShieldCheck className="h-4 w-4" />
                Moderation Actions
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="text-red-700"
                  onClick={() => processWorker(selectedWorker, "REJECTED")}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Worker
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => processWorker(selectedWorker, "APPROVED")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Worker
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {previewImage ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-heading">{previewImage.title}</p>
              <button
                type="button"
                className="rounded-md p-1 text-paragraph transition hover:bg-muted"
                onClick={() => setPreviewImage(null)}
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/70">
              <img src={previewImage.url} alt={previewImage.title} className="max-h-[70vh] w-full object-contain bg-black/5" />
            </div>
            <div className="mt-2 text-right text-xs">
              <a href={previewImage.url} target="_blank" rel="noreferrer" className="text-sky-700 underline">
                Open Original
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
