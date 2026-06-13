"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  CreditCard,
} from "lucide-react";

export default function WalletPage() {
  const { t } = useLanguage();
  const [earnings, setEarnings] = useState<WorkerWalletSummary>({
    balance: 0,
    availableBalance: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    totalCommissionPaid: 0,
    totalBonusEarned: 0,
  });
  const [transactions, setTransactions] = useState<WorkerWalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = resolveWorkerUserId();
        if (!userId) {
          setError("Worker user ID missing. Set NEXT_PUBLIC_WORKER_USER_ID or login first.");
          return;
        }

        const profile = getCachedWorkerDashboardProfile() || await getWorkerDashboardProfileByUserId(userId);
        const [summary, txns] = await Promise.all([
          getWorkerWalletSummary(profile.workerId),
          getWorkerWalletTransactions(profile.workerId),
        ]);
        setEarnings(summary);
        setTransactions(txns);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load wallet");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const num = (v: number | string) => Number(v ?? 0);
  const isCredit = (type: string) =>
    type === "BONUS_CREDIT" || type === "TOPUP_CREDIT";

  const getTransactionIcon = (type: string) => {
    if (isCredit(type))
      return <ArrowDownCircle className="w-5 h-5 text-green-500" />;
    if (type === "COMMISSION_DEBIT" || type === "WITHDRAWAL_DEBIT")
      return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
    return <DollarSign className="w-5 h-5 text-paragraph" />;
  };

  const formatTxnType = (type: string) =>
    type
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">
        {t.wallet}
      </h1>

      {/* Earnings Overview Cards */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
            <div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
            <div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
          </div>
          <div className="bg-gray-200 rounded-2xl h-20 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings (gross cash from jobs) */}
        <Card className="p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-tertiary to-tertiary-hover p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/80">{t.totalEarnings}</p>
              <TrendingUp className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-3xl font-bold">
              Rs. {num(earnings.totalEarnings).toLocaleString()}
            </p>
            <p className="text-xs text-white/70 mt-2">
              Cash received directly from customers
            </p>
          </div>
        </Card>

        {/* Wallet Balance (platform credit) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
            <Wallet className="w-6 h-6 text-tertiary opacity-30" />
          </div>
          <p
            className={cn(
              "text-3xl font-bold",
              num(earnings.balance) < 0 ? "text-red-600" : "text-heading"
            )}
          >
            Rs. {num(earnings.balance).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            {num(earnings.balance) < 0
              ? "Negative — top up from the Rewards tab to keep getting bookings"
              : "Used to pay platform commission"}
          </p>
        </Card>

        {/* Cashback Earned */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Cashback Earned</p>
            <DollarSign className="w-6 h-6 text-green-500 opacity-30" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            Rs. {num(earnings.totalBonusEarned).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Commission paid: Rs.{" "}
            {num(earnings.totalCommissionPaid).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* This Month */}
      <Card className="p-6 bg-blue-50 border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Month&apos;s Earnings</p>
            <p className="text-2xl font-bold text-heading mt-1">
              Rs. {num(earnings.thisMonthEarnings).toLocaleString()}
            </p>
          </div>
          <CreditCard className="w-10 h-10 text-blue-500 opacity-30" />
        </div>
      </Card>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-bold text-heading mb-4">
          Transaction History
        </h2>

        <div className="space-y-2">
          {!loading && transactions.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No transactions yet. Top up your wallet from the Rewards tab to
                get started.
              </p>
            </Card>
          )}
          {transactions.map((transaction) => {
            const credit = isCredit(transaction.type);
            return (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "en-PK",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )}{" "}
                        • {formatTxnType(transaction.type)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right ml-4 flex-shrink-0">
                    <p
                      className={cn(
                        "font-bold",
                        credit ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {credit ? "+" : "−"}Rs.{" "}
                      {Math.abs(num(transaction.amount)).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bal: Rs. {num(transaction.balanceAfter).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
