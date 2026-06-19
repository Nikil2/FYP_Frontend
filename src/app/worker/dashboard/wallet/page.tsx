"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import {
  getCachedWorkerDashboardProfile,
  getWorkerDashboardProfileByUserId,
  getWorkerWalletSummary,
  getWorkerWalletTransactions,
  resolveWorkerUserId,
  type WorkerWalletSummary,
  type WorkerWalletTransaction,
} from "@/api/services/worker-dashboard";
import {
  getCommissionDue,
  submitCommissionProof,
  getWorkerCommissionPayments,
  type CommissionDueStatus,
  type CommissionPayment,
} from "@/api/services/commission";
import { apiClient } from "@/api/client";
import API_CONFIG from "@/api/config";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  X,
  Loader2,
  Gift,
  CreditCard,
  XCircle,
} from "lucide-react";

export default function WalletPage() {
  const { t } = useLanguage();

  const [workerId, setWorkerId] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<WorkerWalletSummary>({
    balance: 0,
    availableBalance: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    totalCommissionPaid: 0,
    totalBonusEarned: 0,
  });
  const [transactions, setTransactions] = useState<WorkerWalletTransaction[]>([]);
  const [dueStatus, setDueStatus] = useState<CommissionDueStatus | null>(null);
  const [payments, setPayments] = useState<CommissionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pay modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = resolveWorkerUserId();
        if (!userId) { setError("Please login again."); return; }

        const profile =
          getCachedWorkerDashboardProfile() ||
          (await getWorkerDashboardProfileByUserId(userId));

        const wId = profile.workerId;
        setWorkerId(wId);

        const [summary, txns, due, hist] = await Promise.all([
          getWorkerWalletSummary(wId),
          getWorkerWalletTransactions(wId),
          getCommissionDue(wId),
          getWorkerCommissionPayments(wId),
        ]);

        setEarnings(summary);
        setTransactions(txns);
        setDueStatus(due);
        setPayments(hist.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load wallet");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const num = (v: number | string | null | undefined) => Number(v ?? 0);
  const isCredit = (type: string) => type === "BONUS_CREDIT" || type === "TOPUP_CREDIT";

  // Upload screenshot
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient.upload<{ url: string }>(
        API_CONFIG.ENDPOINTS.UPLOADS_EVIDENCE,
        form,
      );
      setProofUrl(res.url);
    } catch {
      toast.error("Failed to upload screenshot. Try again.");
    }
    setUploading(false);
  };

  const handleSubmitPayment = async () => {
    if (!proofUrl || !workerId || submitting) return;
    setSubmitting(true);
    try {
      await submitCommissionProof(workerId, proofUrl);
      toast.success("Payment proof submitted! Admin will verify within 24 hours.");
      setShowPayModal(false);
      setProofUrl(null);
      // Refresh due status
      const updated = await getCommissionDue(workerId);
      setDueStatus(updated);
      const hist = await getWorkerCommissionPayments(workerId);
      setPayments(hist.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    }
    setSubmitting(false);
  };

  const statusColor = (s: string) => {
    if (s === "APPROVED") return "text-green-600 bg-green-50";
    if (s === "REJECTED") return "text-red-600 bg-red-50";
    return "text-amber-600 bg-amber-50";
  };
  const statusLabel = (s: string) => {
    if (s === "APPROVED") return "Verified";
    if (s === "REJECTED") return "Rejected";
    return "Under Review";
  };

  const amountDue = dueStatus?.amountDue ?? 0;
  const daysLeft = dueStatus?.daysLeft ?? null;
  const overdue = dueStatus?.isPaymentOverdue ?? false;
  const hasPending = dueStatus?.hasPendingSubmission ?? false;

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">{t.wallet}</h1>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
        </div>
      )}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {!loading && !error && (
        <>
          {/* ── Commission Due Banner ── */}
          {amountDue > 0 && (
            <div
              className={cn(
                "rounded-2xl p-5 border-2",
                overdue
                  ? "bg-red-50 border-red-300"
                  : daysLeft !== null && daysLeft <= 3
                  ? "bg-orange-50 border-orange-300"
                  : "bg-amber-50 border-amber-200",
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle
                  className={cn(
                    "w-6 h-6 flex-shrink-0 mt-0.5",
                    overdue ? "text-red-600" : "text-amber-600",
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-heading">
                    {overdue ? "Commission Overdue!" : "Commission Due"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {overdue
                      ? "You missed the payment deadline. Pay now to continue receiving bookings."
                      : daysLeft !== null
                      ? `Pay within ${daysLeft} day${daysLeft !== 1 ? "s" : ""} to avoid suspension`
                      : "Please pay your platform commission"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-extrabold text-heading">
                    Rs. {amountDue.toLocaleString()}
                  </p>
                  {dueStatus?.commissionDueAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due by:{" "}
                      {new Date(dueStatus.commissionDueAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {hasPending ? (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-100 rounded-lg px-3 py-2.5">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Your payment proof is under review. Admin will verify within 24 hours.
                  </span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full bg-tertiary hover:bg-tertiary/90 text-white font-semibold"
                  onClick={() => setShowPayModal(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Pay Commission — Upload Proof
                </Button>
              )}

              {/* Company account info */}
              <div className="mt-3 text-xs text-muted-foreground border-t border-amber-200 pt-3 space-y-0.5">
                <p className="font-semibold text-heading">Transfer to Mehnati Account:</p>
                <p>EasyPaisa / JazzCash: <span className="font-mono font-semibold">0300-0000000</span></p>
                <p>Account Name: <span className="font-semibold">Mehnati Marketplace</span></p>
              </div>
            </div>
          )}

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cash Earned */}
            <Card className="p-0 overflow-hidden">
              <div className="bg-gradient-to-br from-tertiary to-tertiary-hover p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-white/80">Cash Earned</p>
                  <TrendingUp className="w-5 h-5 text-white/50" />
                </div>
                <p className="text-3xl font-bold">
                  Rs. {num(earnings.totalEarnings).toLocaleString()}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  This month: Rs. {num(earnings.thisMonthEarnings).toLocaleString()}
                </p>
              </div>
            </Card>

            {/* Commission Owed */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Commission Owed</p>
                <Wallet className="w-5 h-5 text-muted-foreground/30" />
              </div>
              <p
                className={cn(
                  "text-3xl font-bold",
                  amountDue > 0 ? "text-red-600" : "text-green-600",
                )}
              >
                Rs. {amountDue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {amountDue > 0 ? "10% of completed jobs — pay to the company" : "All clear!"}
              </p>
            </Card>

            {/* Bonus Earned */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Bonus Earned</p>
                <Gift className="w-5 h-5 text-green-400/50" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                Rs. {num(earnings.totalBonusEarned).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Cashback from your tier rewards
              </p>
            </Card>
          </div>

          {/* ── Commission Payment History ── */}
          {payments.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-heading mb-3">Commission Payments</h2>
              <div className="space-y-2">
                {payments.map((p) => (
                  <Card key={p.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          p.status === "APPROVED"
                            ? "bg-green-50"
                            : p.status === "REJECTED"
                            ? "bg-red-50"
                            : "bg-amber-50",
                        )}
                      >
                        {p.status === "APPROVED" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : p.status === "REJECTED" ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-heading">
                          Rs. {Number(p.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.submittedAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        {p.status === "REJECTED" && p.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5">
                            Reason: {p.rejectionReason}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-full",
                          statusColor(p.status),
                        )}
                      >
                        {statusLabel(p.status)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Wallet Ledger ── */}
          <div>
            <h2 className="text-lg font-bold text-heading mb-3">Transaction History</h2>
            <div className="space-y-2">
              {transactions.length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No transactions yet.</p>
                </Card>
              )}
              {transactions.map((txn) => {
                const credit = isCredit(txn.type);
                return (
                  <Card key={txn.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {credit ? (
                            <ArrowDownCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowUpCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-heading truncate">
                            {txn.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(txn.createdAt).toLocaleDateString("en-PK", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className={cn("font-bold", credit ? "text-green-600" : "text-red-500")}>
                          {credit ? "+" : "−"}Rs. {Math.abs(num(txn.amount)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Pay Commission Modal ── */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-heading">Pay Commission</h3>
              <button
                onClick={() => { setShowPayModal(false); setProofUrl(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-1.5 text-sm">
              <p className="font-semibold text-heading">How to pay:</p>
              <p className="text-muted-foreground">
                1. Send <span className="font-bold text-heading">Rs. {amountDue.toLocaleString()}</span> to:
              </p>
              <div className="bg-white rounded-lg border border-border px-3 py-2 space-y-0.5">
                <p className="text-xs text-muted-foreground">EasyPaisa / JazzCash</p>
                <p className="font-mono font-bold text-heading">0300-0000000</p>
                <p className="text-xs text-muted-foreground">Mehnati Marketplace</p>
              </div>
              <p className="text-muted-foreground">2. Take a screenshot of your payment</p>
              <p className="text-muted-foreground">3. Upload it below</p>
            </div>

            {/* Upload area */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {proofUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={proofUrl} alt="Payment proof" className="w-full max-h-48 object-cover" />
                <button
                  onClick={() => setProofUrl(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Uploaded
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 hover:border-tertiary/50 hover:bg-tertiary/5 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Tap to upload screenshot</p>
                    <p className="text-xs text-muted-foreground/60">JPG, PNG, WEBP</p>
                  </>
                )}
              </button>
            )}

            <Button
              variant="primary"
              className="w-full bg-tertiary hover:bg-tertiary/90 text-white font-semibold"
              disabled={!proofUrl || submitting}
              onClick={handleSubmitPayment}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Submit for Verification
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
