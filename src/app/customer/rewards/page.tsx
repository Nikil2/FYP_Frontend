"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  ChevronLeft,
  Copy,
  Check,
  TrendingUp,
  Zap,
  Star,
  Users,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { NotificationBell } from "@/components/customer/notification-bell";
import { getAuthUser } from "@/lib/auth";
import {
  getRewardSummary,
  getPointTransactions,
  type RewardSummary,
  type PointTransaction,
} from "@/api/services/customer-rewards";
import { cn } from "@/lib/utils";

const TXN_LABELS: Record<string, { label: string; color: string }> = {
  EARN_BOOKING:    { label: "Booked a service",      color: "text-blue-600" },
  EARN_COMPLETION: { label: "Job completed",          color: "text-green-600" },
  EARN_REVIEW:     { label: "Left a review",          color: "text-amber-600" },
  EARN_REFERRAL:   { label: "Referral bonus",         color: "text-purple-600" },
  ADMIN_ADJUSTMENT:{ label: "Admin adjustment",       color: "text-gray-500" },
};

function PointsBadge({ points }: { points: number }) {
  return (
    <span className={cn("text-sm font-bold", points > 0 ? "text-green-600" : "text-red-500")}>
      {points > 0 ? `+${points}` : points} pts
    </span>
  );
}

export default function RewardsPage() {
  const router = useRouter();
  const user = getAuthUser();

  const [summary, setSummary] = useState<RewardSummary | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAllTxn, setShowAllTxn] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [s, t] = await Promise.all([
        getRewardSummary(user.id),
        getPointTransactions(user.id, 0, 10),
      ]);
      setSummary(s);
      setTransactions(t.data);
    } catch {
      // silent
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCopyCode = () => {
    if (!summary?.referralCode) return;
    navigator.clipboard.writeText(summary.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryEntries = summary
    ? Object.entries(summary.spendingByCategory).sort((a, b) => b[1] - a[1])
    : [];
  const maxCategorySpend = categoryEntries[0]?.[1] ?? 1;

  return (
    <div className="min-h-screen bg-card pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading flex-1">Rewards</h1>
        <NotificationBell />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
        </div>
      ) : (
        <div className="p-4 space-y-4">

          {/* Points Card */}
          <div className="rounded-xl bg-gradient-to-br from-tertiary to-tertiary-hover p-6 text-white">
            <p className="text-sm opacity-80">Your Points Balance</p>
            <p className="text-5xl font-extrabold mt-1 tracking-tight">
              {(summary?.rewardPoints ?? 0).toLocaleString()}
            </p>
            <p className="text-xs opacity-70 mt-1">
              {(summary?.totalPointsEarned ?? 0).toLocaleString()} total earned
            </p>
            <div className="mt-4 flex gap-4 text-xs opacity-80">
              <span>{summary?.totalBookings ?? 0} bookings</span>
              <span>·</span>
              <span>{summary?.totalReferrals ?? 0} referrals</span>
            </div>
          </div>

          {/* Spending Overview */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-tertiary" />
              Spending Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-lg font-bold text-heading mt-0.5">
                  Rs. {Number(summary?.thisMonthSpent ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">All Time</p>
                <p className="text-lg font-bold text-heading mt-0.5">
                  Rs. {Number(summary?.totalSpent ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            {categoryEntries.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">By Category</p>
                {categoryEntries.slice(0, 4).map(([cat, amount]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-paragraph">{cat}</span>
                      <span className="font-semibold text-heading">
                        Rs. {Number(amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-tertiary transition-all"
                        style={{ width: `${(amount / maxCategorySpend) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to Earn */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              How to Earn Points
            </h3>
            <div className="space-y-3">
              {[
                { icon: Award,  label: "Book a service",   pts: "+10 pts", color: "bg-blue-50 text-blue-600" },
                { icon: Check,  label: "Complete the job",  pts: "+20 pts", color: "bg-green-50 text-green-600" },
                { icon: Star,   label: "Leave a review",    pts: "+5 pts",  color: "bg-amber-50 text-amber-600" },
                { icon: Users,  label: "Refer a friend",    pts: "+50 pts", color: "bg-purple-50 text-purple-600" },
              ].map(({ icon: Icon, label, pts, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-paragraph flex-1">{label}</span>
                  <span className="text-sm font-bold text-tertiary">{pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-heading mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Your Referral Code
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Share with friends — you earn 50 pts when they complete their first booking
            </p>
            {summary?.referralCode ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2.5">
                  <p className="text-base font-mono font-bold text-heading tracking-widest">
                    {summary.referralCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center hover:bg-tertiary/20 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No referral code yet — complete your first booking to get one.
              </p>
            )}
            {(summary?.totalReferrals ?? 0) > 0 && (
              <p className="text-xs text-purple-600 font-medium mt-2">
                {summary!.totalReferrals} friend{summary!.totalReferrals > 1 ? "s" : ""} joined via your code
              </p>
            )}
          </div>

          {/* Points History */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-heading">Points History</h3>
              {transactions.length >= 10 && (
                <button
                  onClick={() => setShowAllTxn((v) => !v)}
                  className="text-xs text-tertiary font-medium flex items-center gap-0.5"
                >
                  {showAllTxn ? "Show less" : "View all"}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Award className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  No points yet. Start booking to earn!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {(showAllTxn ? transactions : transactions.slice(0, 5)).map((txn) => {
                  const meta = TXN_LABELS[txn.type] ?? { label: txn.type, color: "text-gray-500" };
                  return (
                    <div key={txn.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-medium", meta.color)}>{meta.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(txn.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <PointsBadge points={txn.points} />
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Balance: {txn.balanceAfter}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      <FloatingButtons />
    </div>
  );
}
