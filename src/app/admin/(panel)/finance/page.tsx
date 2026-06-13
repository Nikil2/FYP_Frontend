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
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  AlertTriangle,
} from "lucide-react";

const num = (v: number | string | null | undefined) => Number(v ?? 0);

type Tab = "commissions" | "wallets";

export default function AdminFinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [tab, setTab] = useState<Tab>("commissions");

  // Commissions
  const [commissions, setCommissions] = useState<PaginatedResponse<CommissionRecord> | null>(null);
  const [commPage, setCommPage] = useState(1);
  const [commLoading, setCommLoading] = useState(false);

  // Wallets
  const [wallets, setWallets] = useState<PaginatedResponse<AdminWorkerWallet> | null>(null);
  const [walletPage, setWalletPage] = useState(1);
  const [walletSearch, setWalletSearch] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

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

  useEffect(() => {
    if (tab === "commissions") loadCommissions(commPage);
  }, [tab, commPage, loadCommissions]);

  useEffect(() => {
    if (tab === "wallets") loadWallets(walletPage, walletSearch);
  }, [tab, walletPage, walletSearch, loadWallets]);

  return (
    <div>
      <AdminPageHeader
        title="Finance & Commissions"
        description="Platform-wide commission ledger, worker wallets, and financial health."
      />

      {/* Summary Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <MetricCard
          label="Total Commission Collected"
          value={`Rs. ${num(summary?.totalCommissionCollected).toLocaleString()}`}
          hint={`${num(summary?.commissionTxnCount)} transactions`}
          tone="good"
        />
        <MetricCard
          label="Total Bonuses Paid Out"
          value={`Rs. ${num(summary?.totalBonusesPaid).toLocaleString()}`}
          hint={`${num(summary?.bonusTxnCount)} payouts`}
          tone="warn"
        />
        <MetricCard
          label="Net Platform Revenue"
          value={`Rs. ${num(summary?.netPlatformRevenue).toLocaleString()}`}
          hint="Commission − bonuses"
          tone="good"
        />
        <MetricCard
          label="Total Worker Wallet Balance"
          value={`Rs. ${num(summary?.totalWorkerWalletBalance).toLocaleString()}`}
          hint={`Across ${num(summary?.totalWorkers)} workers`}
        />
      </section>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        {(["commissions", "wallets"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors",
              tab === t
                ? "bg-heading text-white"
                : "bg-muted text-paragraph hover:bg-muted/70"
            )}
          >
            {t === "commissions" ? "Commission Ledger" : "Worker Wallets"}
          </button>
        ))}
      </div>

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
