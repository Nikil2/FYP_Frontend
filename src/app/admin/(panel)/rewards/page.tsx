"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { toast } from "sonner";
import {
  getBonusAnalytics,
  getBonusConfig,
  updateBonusConfig,
  getAllBonusRecords,
  releaseBonusManually,
  rejectBonus,
  type BonusAnalytics,
  type BonusConfig,
  type BonusRecordAdmin,
  type PaginatedResponse,
} from "@/api/services/admin";
import { cn } from "@/lib/utils";
import {
  Award,
  Settings2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const num = (v: number | string | null | undefined) => Number(v ?? 0);
const pct = (v: number | string | null | undefined) =>
  `${(num(v) * 100).toFixed(0)}%`;

const TIER_COLORS: Record<string, string> = {
  NONE: "bg-gray-100 text-gray-600",
  BRONZE: "bg-orange-100 text-orange-700",
  SILVER: "bg-slate-100 text-slate-700",
  GOLD: "bg-amber-100 text-amber-700",
  PLATINUM: "bg-purple-100 text-purple-700",
};

type Tab = "records" | "config";
type StatusFilter = "" | "PENDING" | "PAID" | "REJECTED";

export default function AdminRewardsPage() {
  const [analytics, setAnalytics] = useState<BonusAnalytics | null>(null);
  const [tab, setTab] = useState<Tab>("records");

  // Bonus Records
  const [records, setRecords] = useState<PaginatedResponse<BonusRecordAdmin> | null>(null);
  const [recPage, setRecPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [recLoading, setRecLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // Config
  const [config, setConfig] = useState<BonusConfig | null>(null);
  const [configDraft, setConfigDraft] = useState<Partial<Record<string, number>>>({});
  const [configSaving, setConfigSaving] = useState(false);

  useEffect(() => {
    getBonusAnalytics()
      .then((r) => setAnalytics(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (tab === "config") {
      getBonusConfig()
        .then((r) => {
          setConfig(r.data);
          setConfigDraft({});
        })
        .catch(console.error);
    }
  }, [tab]);

  const loadRecords = useCallback(async (page: number, status: StatusFilter) => {
    setRecLoading(true);
    try {
      const res = await getAllBonusRecords(page, 20, status || undefined);
      setRecords(res);
    } catch (e) {
      console.error(e);
    } finally {
      setRecLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "records") loadRecords(recPage, statusFilter);
  }, [tab, recPage, statusFilter, loadRecords]);

  const handleRelease = async (bonusId: string) => {
    setActionId(bonusId);
    try {
      await releaseBonusManually(bonusId);
      toast.success("Bonus released to worker wallet");
      loadRecords(recPage, statusFilter);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to release bonus");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (bonusId: string) => {
    setActionId(bonusId);
    try {
      await rejectBonus(bonusId);
      toast.success("Bonus rejected");
      loadRecords(recPage, statusFilter);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reject bonus");
    } finally {
      setActionId(null);
    }
  };

  const handleConfigSave = async () => {
    if (!Object.keys(configDraft).length) return;
    setConfigSaving(true);
    try {
      const res = await updateBonusConfig(configDraft);
      setConfig(res.data);
      setConfigDraft({});
      toast.success("Bonus config updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save config");
    } finally {
      setConfigSaving(false);
    }
  };

  const effectiveConfig = config
    ? Object.fromEntries(
        Object.entries(config).map(([k, v]) => [k, configDraft[k] ?? num(v)])
      )
    : null;

  return (
    <div>
      <AdminPageHeader
        title="Rewards & Bonus Program"
        description="Monitor cashback payouts, manage bonus records, and configure tier thresholds."
      />

      {/* Analytics Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <MetricCard
          label="Total Commission Earned"
          value={`Rs. ${num(analytics?.totalCommissionEarned).toLocaleString()}`}
          tone="good"
        />
        <MetricCard
          label="Total Bonuses Paid"
          value={`Rs. ${num(analytics?.totalBonusesPaid).toLocaleString()}`}
          hint={`${num(analytics?.bonusesPaidCount)} payouts`}
          tone="warn"
        />
        <MetricCard
          label="Net Revenue"
          value={`Rs. ${num(analytics?.netPlatformRevenue).toLocaleString()}`}
          hint="After bonuses"
          tone="good"
        />
        <MetricCard
          label="Rejected Bonuses"
          value={String(num(analytics?.bonusesRejectedCount))}
          tone="warn"
        />
      </section>

      {/* Tier Distribution */}
      {analytics?.workersByTier && analytics.workersByTier.length > 0 && (
        <Card className="rounded-2xl p-4 mb-6">
          <h2 className="font-semibold text-heading mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Worker Tier Distribution
          </h2>
          <div className="flex flex-wrap gap-3">
            {analytics.workersByTier.map(({ tier, count }) => (
              <div
                key={tier}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold",
                  TIER_COLORS[tier] ?? "bg-muted text-paragraph"
                )}
              >
                <span className="capitalize">{tier.toLowerCase()}</span>
                <span className="text-xs opacity-70">({count})</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        {(["records", "config"] as Tab[]).map((t) => (
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
            {t === "records" ? "Bonus Records" : "Program Config"}
          </button>
        ))}
      </div>

      {/* Bonus Records Table */}
      {tab === "records" && (
        <Card className="rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
            <h2 className="font-semibold text-heading">Bonus Records</h2>
            {/* Status filter */}
            <div className="ml-auto flex gap-1">
              {(["", "PENDING", "PAID", "REJECTED"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setRecPage(1); }}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold transition-colors",
                    statusFilter === s
                      ? "bg-heading text-white"
                      : "bg-muted text-paragraph hover:bg-muted/70"
                  )}
                >
                  {s || "All"}
                </button>
              ))}
            </div>
            {records && (
              <span className="text-xs text-muted-foreground">{records.total} total</span>
            )}
          </div>

          {recLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Worker</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Tier</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Window</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Commission</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Rate</th>
                    <th className="text-right px-4 py-3 font-semibold text-paragraph">Bonus</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-paragraph">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {records?.data.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-heading">{r.worker?.user?.fullName ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{r.worker?.user?.phoneNumber ?? ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full capitalize",
                          TIER_COLORS[r.worker?.currentTier ?? "NONE"]
                        )}>
                          {(r.worker?.currentTier ?? "none").toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-paragraph">#{r.windowIndex}</td>
                      <td className="px-4 py-3 text-right">
                        Rs. {num(r.commissionCollected).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">{pct(r.cashbackRate)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">
                        Rs. {num(r.bonusAmount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          r.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : r.status === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        )}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-paragraph whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("en-PK", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {r.status === "PENDING" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="tertiary"
                              className="h-7 px-2 text-xs text-white bg-green-600 hover:bg-green-700"
                              disabled={actionId === r.id}
                              onClick={() => handleRelease(r.id)}
                            >
                              {actionId === r.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              Release
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              disabled={actionId === r.id}
                              onClick={() => handleReject(r.id)}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {r.status === "REJECTED" && (
                          <Button
                            size="sm"
                            variant="tertiary"
                            className="h-7 px-2 text-xs text-white bg-green-600 hover:bg-green-700"
                            disabled={actionId === r.id}
                            onClick={() => handleRelease(r.id)}
                          >
                            {actionId === r.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            )}
                            Release
                          </Button>
                        )}
                        {r.status === "PAID" && (
                          <span className="text-xs text-green-600">Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!records?.data.length && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        No bonus records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {records && records.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Page {records.page} of {records.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={recPage === 1}
                  onClick={() => setRecPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={recPage === records.totalPages}
                  onClick={() => setRecPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Config Editor */}
      {tab === "config" && effectiveConfig && (
        <Card className="rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-tertiary" />
            <h2 className="font-semibold text-heading">Bonus Program Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Commission */}
            <ConfigField
              label="Commission Rate"
              hint="Fraction deducted per job (e.g. 0.10 = 10%)"
              value={effectiveConfig["commissionRate"] as number}
              step={0.01}
              onChange={(v) => setConfigDraft((d) => ({ ...d, commissionRate: v }))}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />

            {/* Tier thresholds */}
            <ConfigField
              label="Bronze Threshold (jobs)"
              value={effectiveConfig["bronzeThreshold"] as number}
              onChange={(v) => setConfigDraft((d) => ({ ...d, bronzeThreshold: v }))}
            />
            <ConfigField
              label="Silver Threshold (jobs)"
              value={effectiveConfig["silverThreshold"] as number}
              onChange={(v) => setConfigDraft((d) => ({ ...d, silverThreshold: v }))}
            />
            <ConfigField
              label="Gold Threshold (jobs)"
              value={effectiveConfig["goldThreshold"] as number}
              onChange={(v) => setConfigDraft((d) => ({ ...d, goldThreshold: v }))}
            />
            <ConfigField
              label="Platinum Threshold (jobs)"
              value={effectiveConfig["platinumThreshold"] as number}
              onChange={(v) => setConfigDraft((d) => ({ ...d, platinumThreshold: v }))}
            />

            {/* Cashback rates */}
            <ConfigField
              label="Bronze Cashback Rate"
              hint="e.g. 0.10 = 10%"
              value={effectiveConfig["bronzeCashbackRate"] as number}
              step={0.01}
              onChange={(v) => setConfigDraft((d) => ({ ...d, bronzeCashbackRate: v }))}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <ConfigField
              label="Silver Cashback Rate"
              value={effectiveConfig["silverCashbackRate"] as number}
              step={0.01}
              onChange={(v) => setConfigDraft((d) => ({ ...d, silverCashbackRate: v }))}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <ConfigField
              label="Gold Cashback Rate"
              value={effectiveConfig["goldCashbackRate"] as number}
              step={0.01}
              onChange={(v) => setConfigDraft((d) => ({ ...d, goldCashbackRate: v }))}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <ConfigField
              label="Platinum Cashback Rate"
              value={effectiveConfig["platinumCashbackRate"] as number}
              step={0.01}
              onChange={(v) => setConfigDraft((d) => ({ ...d, platinumCashbackRate: v }))}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />

            {/* Eligibility */}
            <ConfigField
              label="Bonus Window Size (jobs)"
              hint="How many jobs per cashback cycle"
              value={effectiveConfig["windowSize"] as number}
              onChange={(v) => setConfigDraft((d) => ({ ...d, windowSize: v }))}
            />
            <ConfigField
              label="Min Rating for Bonus"
              value={effectiveConfig["minRatingForBonus"] as number}
              step={0.1}
              onChange={(v) => setConfigDraft((d) => ({ ...d, minRatingForBonus: v }))}
            />
            <ConfigField
              label="Max Cancellation Rate"
              hint="e.g. 0.20 = 20%"
              value={effectiveConfig["maxCancellationRate"] as number}
              step={0.01}
              onChange={(v) => setConfigDraft((d) => ({ ...d, maxCancellationRate: v }))}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="tertiary"
              className="text-white"
              onClick={handleConfigSave}
              disabled={configSaving || !Object.keys(configDraft).length}
            >
              {configSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {configSaving ? "Saving..." : "Save Changes"}
            </Button>
            {Object.keys(configDraft).length > 0 && (
              <span className="text-xs text-amber-600 font-semibold">
                {Object.keys(configDraft).length} unsaved change(s)
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Small config input field ──────────────────────────────────────────────────
function ConfigField({
  label,
  hint,
  value,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  hint?: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-heading mb-1">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-1">{hint}</p>}
      <div className="flex items-center gap-2">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
        />
        {format && (
          <span className="text-sm font-semibold text-tertiary w-12 text-right">
            {format(value)}
          </span>
        )}
      </div>
    </div>
  );
}
