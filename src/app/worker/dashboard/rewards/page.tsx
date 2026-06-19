"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/worker-dashboard/tier-badge";
import {
  getCachedWorkerDashboardProfile,
  getWorkerDashboardProfileByUserId,
  resolveWorkerUserId,
} from "@/api/services/worker-dashboard";
import {
  getBonusProgress,
  getBonusHistory,
  getWalletSummary,
  TIER_META,
  type BonusProgress,
  type BonusRecord,
  type WalletSummary,
} from "@/api/services/bonus";
import {
  Award,
  Gift,
  TrendingUp,
  Wallet,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const PKR = (v: number | string) =>
  `Rs. ${Number(v ?? 0).toLocaleString("en-PK")}`;

export default function RewardsPage() {
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [progress, setProgress] = useState<BonusProgress | null>(null);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [history, setHistory] = useState<BonusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = resolveWorkerUserId();
      if (!userId) {
        setError("Worker not found. Please log in again.");
        return;
      }
      const profile =
        getCachedWorkerDashboardProfile() ||
        (await getWorkerDashboardProfileByUserId(userId));
      setWorkerId(profile.workerId);

      const [prog, wal, hist] = await Promise.all([
        getBonusProgress(profile.workerId),
        getWalletSummary(profile.workerId),
        getBonusHistory(profile.workerId),
      ]);
      setProgress(prog);
      setWallet(wal);
      setHistory(hist.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-paragraph">Loading rewards…</div>
    );
  }
  if (error) {
    return <div className="p-6 text-center text-destructive">{error}</div>;
  }
  if (!progress) return null;

  const pct = progress.bonusWindow.progressPercent;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-tertiary" />
          <h1 className="text-2xl font-bold text-heading">Rewards</h1>
        </div>
        <TierBadge tier={progress.currentTier} size="lg" />
      </div>

      {/* Wallet + progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-paragraph mb-1">
            <Wallet className="w-4 h-4" /> Commission Owed
          </div>
          <p className={cnBalance(Number(wallet?.balance ?? 0))}>
            Rs. {Math.max(0, -Number(wallet?.balance ?? 0)).toLocaleString()}
          </p>
          {Number(wallet?.balance ?? 0) < 0 ? (
            <p className="text-xs text-destructive mt-1">
              Go to <strong>Wallet</strong> tab to pay and upload proof.
            </p>
          ) : (
            <p className="text-xs text-green-600 mt-1">
              All clear — no commission owed.
            </p>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-paragraph mb-1">
            <Gift className="w-4 h-4" /> Total Cashback Earned
          </div>
          <p className="text-2xl font-bold text-tertiary">
            {PKR(wallet?.totalBonusEarned ?? 0)}
          </p>
          <div className="flex items-center gap-2 text-paragraph mt-3 text-sm">
            <TrendingUp className="w-4 h-4" /> Commission paid:{" "}
            {PKR(wallet?.totalCommissionPaid ?? 0)}
          </div>
        </Card>
      </div>

      {/* Progress to next bonus */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-heading">Next Cashback</h2>
          <span className="text-sm text-paragraph">
            {progress.bonusWindow.jobsInWindow} / {progress.bonusWindow.size} jobs
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm text-paragraph mt-2">
          {progress.bonusWindow.jobsToNextBonus === 0
            ? "Bonus window complete — keep going for the next one!"
            : `${progress.bonusWindow.jobsToNextBonus} more job(s) to your next cashback.`}
        </p>

        {progress.nextTier && (
          <p className="text-sm text-paragraph mt-1">
            {progress.nextTier.jobsRemaining} more job(s) to reach{" "}
            <span className="font-semibold">
              {TIER_META[progress.nextTier.tier].label}
            </span>{" "}
            tier.
          </p>
        )}
      </Card>

      {/* Eligibility */}
      <Card className="p-5">
        <h2 className="font-semibold text-heading mb-3">Bonus Eligibility</h2>
        <ul className="space-y-2 text-sm">
          <EligibilityRow
            ok={progress.eligibility.ratingOk}
            label={`Rating ≥ ${progress.eligibility.minRating} (you: ${progress.eligibility.rating.toFixed(1)})`}
          />
          <EligibilityRow
            ok={!progress.eligibility.hasActiveFraud}
            label="No active fraud reports"
          />
          <EligibilityRow
            ok={!progress.eligibility.isBonusSuspended}
            label="Bonus eligibility active"
          />
        </ul>
      </Card>

      {/* History */}
      <Card className="p-5">
        <h2 className="font-semibold text-heading mb-3">Bonus History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-paragraph">
            No bonuses yet. Complete 20 jobs to earn your first cashback!
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border-b border-border pb-2 last:border-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <TierBadge tier={b.tier} size="sm" />
                    <span className="text-sm font-medium text-heading">
                      Jobs {b.windowIndex * 20 - 19}–{b.windowIndex * 20}
                    </span>
                  </div>
                  {b.status === "REJECTED" && b.reason && (
                    <p className="text-xs text-destructive mt-1">{b.reason}</p>
                  )}
                </div>
                <div className="text-right">
                  {b.status === "PAID" ? (
                    <span className="text-tertiary font-bold">
                      +{PKR(b.bonusAmount)}
                    </span>
                  ) : (
                    <span className="text-xs text-destructive font-medium">
                      Not eligible
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function EligibilityRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-tertiary" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive" />
      )}
      <span className={ok ? "text-paragraph" : "text-destructive"}>{label}</span>
    </li>
  );
}

function cnBalance(balance: number): string {
  return balance < 0
    ? "text-2xl font-bold text-destructive"
    : "text-2xl font-bold text-heading";
}
