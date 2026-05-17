"use client";

import { useState } from "react";
import {
  X,
  Star,
  Phone,
  MapPin,
  Shield,
  Briefcase,
  Image,
  Calendar,
  Ban,
  User,
  CreditCard,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkerProfile } from "@/api/services/admin";

interface WorkerDetailModalProps {
  worker: WorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBlock?: (worker: WorkerProfile) => void;
}

type Tab = "overview" | "documents" | "portfolio";

function getStatusIcon(status: string) {
  switch (status) {
    case "APPROVED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export function WorkerDetailModal({ worker, isOpen, onClose, onBlock }: WorkerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  if (!isOpen || !worker) return null;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "documents", label: "Documents" },
    { key: "portfolio", label: "Portfolio", count: worker.portfolio?.length || 0 },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div
          className="relative w-full max-w-[640px] max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-border/50 overflow-hidden"
          style={{ animation: "fadeScaleIn 0.2s ease-out" }}
        >
          {/* ── Hero Header ── */}
          <div className="relative bg-gradient-to-br from-[#0d1f1a] to-[#1a3d30] px-6 pt-6 pb-5">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-[72px] w-[72px] rounded-2xl bg-white/15 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white/20 backdrop-blur">
                {worker.user.profilePicUrl ? (
                  <img src={worker.user.profilePicUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <User className="h-8 w-8 text-white/70" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">{worker.user.fullName}</h2>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-200/80 text-sm">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{worker.user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", getStatusStyle(worker.verificationStatus))}>
                    {getStatusIcon(worker.verificationStatus)}
                    {worker.verificationStatus}
                  </span>
                  {worker.user.isBlocked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-400/30 px-2 py-0.5 text-[11px] font-semibold text-red-200">
                      <Ban className="h-3 w-3" /> Blocked
                    </span>
                  )}
                  {worker.isOnline && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                      <Globe className="h-3 w-3" /> Online
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { icon: Star, value: Number(worker.averageRating).toFixed(1), label: "Rating", color: "text-amber-400" },
                { icon: Briefcase, value: String(worker.totalJobsCompleted), label: "Jobs", color: "text-emerald-400" },
                { icon: Clock, value: `${worker.experienceYears}yr`, label: "Experience", color: "text-sky-400" },
                { icon: Wallet, value: `Rs.${Number(worker.visitingCharges).toLocaleString()}`, label: "Visit Fee", color: "text-purple-400" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/8 border border-white/10 px-3 py-2.5 text-center">
                  <stat.icon className={cn("h-4 w-4 mx-auto mb-1", stat.color)} />
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tab Bar ── */}
          <div className="flex border-b border-border bg-gray-50/80 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "text-[#0d1f1a]"
                    : "text-paragraph hover:text-heading"
                )}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 px-1">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#0d1f1a]" />
                )}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="p-6 space-y-5">
                {/* Bio */}
                {worker.bio && (
                  <section>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-paragraph mb-2">About</h4>
                    <p className="text-sm text-heading leading-relaxed">{worker.bio}</p>
                  </section>
                )}

                {/* Info Grid */}
                <section>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-paragraph mb-3">Details</h4>
                  <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
                    {[
                      { icon: MapPin, label: "Home Address", value: worker.homeAddress || "—" },
                      { icon: CreditCard, label: "CNIC Number", value: worker.cnicNumber || "—" },
                      { icon: User, label: "Worker ID", value: worker.id.slice(0, 12) + "..." },
                      { icon: Calendar, label: "Submitted", value: worker.submittedAt ? new Date(worker.submittedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white p-3.5">
                        <div className="flex items-center gap-2 mb-1">
                          <item.icon className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-paragraph">{item.label}</span>
                        </div>
                        <p className="text-sm font-medium text-heading pl-5.5 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Services */}
                {worker.services?.length > 0 && (
                  <section>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-paragraph mb-2">
                      Services ({worker.services.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.services.map((service) => (
                        <span
                          key={service.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"
                        >
                          {service.iconUrl && <span className="text-sm">{service.iconUrl}</span>}
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="p-6 space-y-5">
                {/* CNIC Info */}
                <section>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-paragraph mb-1">CNIC Number</h4>
                  <p className="text-lg font-mono font-semibold text-heading tracking-wider">{worker.cnicNumber || "Not provided"}</p>
                </section>

                {/* CNIC Images */}
                <section>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-paragraph mb-3">CNIC Images</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {worker.cnicFrontUrl ? (
                      <button onClick={() => setLightboxImg(worker.cnicFrontUrl)} className="group rounded-xl border border-border overflow-hidden bg-gray-50 hover:border-emerald-300 transition-colors">
                        <div className="px-2.5 py-1.5 bg-gray-100/80 text-[10px] font-semibold text-paragraph uppercase tracking-wider">Front Side</div>
                        <img src={worker.cnicFrontUrl} alt="CNIC Front" className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform" />
                      </button>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border p-6 text-center bg-gray-50">
                        <Shield className="h-6 w-6 text-paragraph/30 mx-auto mb-1" />
                        <p className="text-xs text-paragraph">No front image</p>
                      </div>
                    )}
                    {worker.cnicBackUrl ? (
                      <button onClick={() => setLightboxImg(worker.cnicBackUrl)} className="group rounded-xl border border-border overflow-hidden bg-gray-50 hover:border-emerald-300 transition-colors">
                        <div className="px-2.5 py-1.5 bg-gray-100/80 text-[10px] font-semibold text-paragraph uppercase tracking-wider">Back Side</div>
                        <img src={worker.cnicBackUrl} alt="CNIC Back" className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform" />
                      </button>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border p-6 text-center bg-gray-50">
                        <Shield className="h-6 w-6 text-paragraph/30 mx-auto mb-1" />
                        <p className="text-xs text-paragraph">No back image</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Selfie */}
                <section>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-paragraph mb-3">Selfie Verification</h4>
                  {worker.selfieImageUrl ? (
                    <button onClick={() => setLightboxImg(worker.selfieImageUrl!)} className="group rounded-xl border border-border overflow-hidden bg-gray-50 hover:border-emerald-300 transition-colors">
                      <img src={worker.selfieImageUrl} alt="Selfie" className="w-28 h-28 object-cover rounded-xl group-hover:scale-[1.02] transition-transform" />
                    </button>
                  ) : (
                    <div className="inline-flex rounded-xl border border-dashed border-border px-6 py-4 bg-gray-50">
                      <div className="text-center">
                        <User className="h-6 w-6 text-paragraph/30 mx-auto mb-1" />
                        <p className="text-xs text-paragraph">No selfie uploaded</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === "portfolio" && (
              <div className="p-6">
                {worker.portfolio && worker.portfolio.length > 0 ? (
                  <>
                    <p className="text-xs text-paragraph mb-4">{worker.portfolio.length} work samples uploaded</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {worker.portfolio.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLightboxImg(item.imageUrl)}
                          className="group relative rounded-xl border border-border overflow-hidden bg-gray-50 hover:border-emerald-300 transition-all hover:shadow-md aspect-square"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.description || "Portfolio"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.description && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[11px] text-white leading-tight line-clamp-2">{item.description}</p>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Image className="h-10 w-10 text-paragraph/20 mb-3" />
                    <p className="text-sm font-medium text-heading">No Portfolio Yet</p>
                    <p className="text-xs text-paragraph mt-1">This worker hasn&apos;t uploaded any work samples.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between border-t border-border bg-gray-50/80 px-6 py-3">
            <p className="text-[10px] text-paragraph">ID: {worker.id}</p>
            <div className="flex items-center gap-2">
              {onBlock && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("text-xs", worker.user.isBlocked ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50" : "text-red-600 border-red-200 hover:bg-red-50")}
                  onClick={() => onBlock(worker)}
                >
                  <Ban className="h-3.5 w-3.5" />
                  {worker.user.isBlocked ? "Unblock" : "Block"}
                </Button>
              )}
              <Button variant="outline" size="sm" className="text-xs" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Full view"
            className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
