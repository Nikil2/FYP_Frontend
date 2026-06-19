"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import {
  getFinanceSummary,
  getAllCommissions,
  getAllWorkerWallets,
  type FinanceSummary,
  type CommissionRecord,
  type AdminWorkerWallet,
  type PaginatedResponse,
} from "@/api/services/admin";
import {
  getAdminPendingPayments,
  approveCommissionPayment,
  rejectCommissionPayment,
  type AdminPendingPayment,
} from "@/api/services/commission";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

const num = (v: number | string | null | undefined) => Number(v ?? 0);

type Tab = "commissions" | "wallets" | "payments";

export default function AdminFinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [tab, setTab] = useState<Tab>("payments");

  // Commission Ledger
  const [commissions, setCommissions] = useState<PaginatedResponse<CommissionRecord> | null>(null);
  const [commPage, setCommPage] = useState(1);
  const [commLoading, setCommLoading] = useState(false);

  // Worker Wallets
  const [wallets, setWallets] = useState<PaginatedResponse<AdminWorkerWallet> | null>(null);
  const [walletPage, setWalletPage] = useState(1);
  const [walletSearch, setWalletSearch] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  // Commission Payments (proof verification)
  const [pendingPayments, setPendingPayments] = useState<AdminPendingPayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    getFinanceSummary()
      .then((r) => setSummary(r.data))
      .catch(console.error);
  }, []);

  const loadCommissions = useCallback(async (page: number) => {
    setCommLoading(true);
    try {
      const res = await getAllCommissions(page, 20);
      setCommissions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setCommLoading(false);
    }
  }, []);

  const loadWallets = useCallback(async (page: number, search: string) => {
    setWalletLoading(true);
    try {
      const res = await getAllWorkerWallets(page, 20, search || undefined);
      setWallets(res);
    } catch (e) {
      console.error(e);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const loadPendingPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const res = await getAdminPendingPayments(0, 50);
      setPendingPayments(res.data);
    } catch (e) { console.error(e); }
    finally { setPaymentsLoading(false); }
  }, []);

  useEffect(() => {
    if (tab === "commissions") loadCommissions(commPage);
  }, [tab, commPage, loadCommissions]);

  useEffect(() => {
    if (tab === "wallets") loadWallets(walletPage, walletSearch);
  }, [tab, walletPage, walletSearch, loadWallets]);

  useEffect(() => {
    if (tab === "payments") loadPendingPayments();
  }, [tab, loadPendingPayments]);

  const handleApprove = async (paymentId: string) => {
    if (actionLoading) return;
    setActionLoading(paymentId);
    try {
      await approveCommissionPayment(paymentId);
      toast.success("Payment approved. Worker wallet cleared.");
      setPendingPayments((prev) => prev.filter((p) => p.id !== paymentId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve.");
    }
    setActionLoading(null);
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActionLoading(rejectModal.id);
    try {
      await rejectCommissionPayment(rejectModal.id, rejectReason.trim());
      toast.success("Payment rejected. Worker notified.");
      setPendingPayments((prev) => prev.filter((p) => p.id !== rejectModal.id));
      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject.");
    }
    setActionLoading(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Finance & Commissions"
        description="Platform-wide commission ledger, worker wallets, and financial health."
      />

      {/* Summary Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <MetricCard
          label="Commission Received (Verified)"
          value={`Rs. ${num(summary?.totalCommissionReceived).toLocaleString()}`}
          hint={`${num(summary?.approvedPaymentCount)} approved payments`}
          tone="good"
        />
        <MetricCard
          label="Commission Still Owed"
          value={`Rs. ${num(summary?.totalCommissionOwed).toLocaleString()}`}
          hint={`Charged Rs. ${num(summary?.totalCommissionCharged).toLocaleString()} across ${num(summary?.commissionTxnCount)} jobs`}
          tone="warn"
        />
        <MetricCard
          label="Under Review (Pending)"
          value={`Rs. ${num(summary?.totalCommissionPending).toLocaleString()}`}
          hint={`${num(summary?.pendingPaymentCount)} submissions awaiting approval`}
        />
        <MetricCard
          label="Net Platform Revenue"
          value={`Rs. ${num(summary?.netPlatformRevenue).toLocaleString()}`}
          hint={`Received − Rs. ${num(summary?.totalBonusesPaid).toLocaleString()} bonuses`}
          tone="good"
        />
      </section>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["payments", "commissions", "wallets"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5",
              tab === t ? "bg-heading text-white" : "bg-muted text-paragraph hover:bg-muted/70"
            )}
          >
            {t === "payments" && <Clock className="w-3.5 h-3.5" />}
            {t === "payments"
              ? `Payment Proofs${pendingPayments.length > 0 ? ` (${pendingPayments.length})` : ""}`
              : t === "commissions"
              ? "Commission Ledger"
              : "Worker Wallets"}
          </button>
        ))}
      </div>

      {/* ── Commission Payment Proofs ── */}
      {tab === "payments" && (
        <Card className="rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-heading">Pending Payment Proofs</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {pendingPayments.length} pending
            </span>
          </div>

          {paymentsLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : pendingPayments.length === 0 ? (
            <div className="p-10 flex flex-col items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
              <p className="text-sm font-medium">All clear — no pending payments</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingPayments.map((p) => (
                <div key={p.id} className="p-5 flex gap-4 items-start">
                  {/* Worker avatar */}
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.worker.user.profilePicUrl ? (
                      <img src={p.worker.user.profilePicUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-sm font-bold text-tertiary">
                        {p.worker.user.fullName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-heading">{p.worker.user.fullName}</p>
                      <span className="text-xs text-muted-foreground">{p.worker.user.phoneNumber}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted: {new Date(p.submittedAt).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                      {" · "}Due by: {new Date(p.dueDate).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short",
                      })}
                    </p>
                    <p className="text-lg font-extrabold text-heading mt-1">
                      Rs. {Number(p.amount).toLocaleString()}
                    </p>

                    {/* Screenshot */}
                    <a
                      href={p.proofImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-tertiary font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Payment Screenshot
                    </a>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                        disabled={actionLoading === p.id}
                        onClick={() => handleApprove(p.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        disabled={actionLoading === p.id}
                        onClick={() => setRejectModal({ id: p.id })}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-heading">Reject Payment Proof</h3>
            <p className="text-sm text-muted-foreground">
              Tell the worker why their payment was rejected so they can resubmit correctly.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Screenshot is unclear, wrong amount, wrong account number..."
              className="w-full text-sm bg-gray-50 border border-border rounded-lg px-3 py-2.5 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setRejectModal(null); setRejectReason(""); }}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={!rejectReason.trim() || !!actionLoading}
                onClick={handleReject}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Ledger */}
      {tab === "commissions" && (
        <Card className="rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-heading">All Commission Transactions</h2>
            {commissions && (
              <span className="ml-auto text-xs text-muted-foreground">
                {commissions.total} total
              </span>
            )}
          </div>

          {commLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Worker</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Description</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Amount</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Wallet After</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissions?.data.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-heading">
                        {c.worker?.user?.fullName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-paragraph">
                        {c.worker?.user?.phoneNumber ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-paragraph text-xs max-w-[200px] truncate">
                        {c.description}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        − Rs. {Math.abs(num(c.amount)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-paragraph">
                        Rs. {num(c.balanceAfter).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-paragraph whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString("en-PK", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {!commissions?.data.length && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No commission transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {commissions && commissions.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Page {commissions.page} of {commissions.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={commPage === 1}
                  onClick={() => setCommPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={commPage === commissions.totalPages}
                  onClick={() => setCommPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Worker Wallets */}
      {tab === "wallets" && (
        <Card className="rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
            <Wallet className="w-5 h-5 text-tertiary" />
            <h2 className="font-semibold text-heading">Worker Wallets</h2>
            <div className="ml-auto flex items-center gap-2 border border-border rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search worker..."
                value={walletSearch}
                onChange={(e) => { setWalletSearch(e.target.value); setWalletPage(1); }}
                className="text-sm bg-transparent focus:outline-none w-40"
              />
            </div>
          </div>

          {walletLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Worker</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Tier</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Jobs Done</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Rating</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Wallet Balance</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {wallets?.data.map((w) => {
                    const bal = num(w.walletBalance);
                    return (
                      <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-heading">
                          {w.user?.fullName ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-paragraph">{w.user?.phoneNumber ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted capitalize">
                            {w.currentTier.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">{w.totalJobsCompleted}</td>
                        <td className="px-4 py-3 text-right">{num(w.averageRating).toFixed(1)} ★</td>
                        <td className={cn(
                          "px-4 py-3 text-right font-bold",
                          bal < 0 ? "text-red-600" : "text-heading"
                        )}>
                          Rs. {bal.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          {bal < 0 && (
                            <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                              <AlertTriangle className="w-3 h-3" /> Negative
                            </span>
                          )}
                          {w.isBonusSuspended && (
                            <span className="text-xs text-orange-600 font-semibold">Bonus Suspended</span>
                          )}
                          {bal >= 0 && !w.isBonusSuspended && (
                            <span className="text-xs text-green-600 font-semibold">Active</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!wallets?.data.length && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No workers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {wallets && wallets.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Page {wallets.page} of {wallets.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={walletPage === 1}
                  onClick={() => setWalletPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={walletPage === wallets.totalPages}
                  onClick={() => setWalletPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
