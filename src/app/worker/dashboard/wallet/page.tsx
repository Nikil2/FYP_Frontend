"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { getProviderEarnings, getProviderTransactions } from "@/lib/mock-provider";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Wallet,
  CreditCard,
} from "lucide-react";

export default function WalletPage() {
  const { t } = useLanguage();
  const earnings = useMemo(() => getProviderEarnings(), []);
  const transactions = useMemo(() => getProviderTransactions(), []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <ArrowDownCircle className="w-5 h-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-paragraph" />;
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">
        {t.wallet}
      </h1>

      {/* Earnings Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <Card className="p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-tertiary to-tertiary-hover p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/80">{t.totalEarnings}</p>
              <TrendingUp className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-3xl font-bold">
              Rs. {earnings.totalEarnings.toLocaleString()}
            </p>
          </div>
        </Card>

        {/* Available Balance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{t.availableBalance}</p>
            <Wallet className="w-6 h-6 text-tertiary opacity-30" />
          </div>
          <p className="text-3xl font-bold text-heading">
            Rs. {earnings.availableBalance.toLocaleString()}
          </p>
          <Button
            variant="tertiary"
            size="sm"
            className="w-full mt-4 rounded-lg"
          >
            {t.withdraw}
          </Button>
        </Card>

        {/* Pending */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{t.pending}</p>
            <Clock className="w-6 h-6 text-yellow-500 opacity-30" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            Rs. {earnings.pendingBalance.toLocaleString()}
          </p>
          {earnings.lastWithdrawal && (
            <p className="text-xs text-muted-foreground mt-3">
              Last withdrawal: Rs. {earnings.lastWithdrawal.amount.toLocaleString()}{" "}
              via {earnings.lastWithdrawal.method}
            </p>
          )}
        </Card>
      </div>

      {/* This Month */}
      <Card className="p-6 bg-blue-50 border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Month&apos;s Earnings</p>
            <p className="text-2xl font-bold text-heading mt-1">
              Rs. {earnings.thisMonthEarnings.toLocaleString()}
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
          {transactions.map((transaction) => (
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
                      {transaction.date}
                      {transaction.orderId && ` • Order #${transaction.orderId}`}
                    </p>
                  </div>
                </div>

                <div className="text-right ml-4 flex-shrink-0">
                  <p
                    className={cn(
                      "font-bold",
                      transaction.type === "withdrawal"
                        ? "text-red-500"
                        : "text-green-600"
                    )}
                  >
                    {transaction.type === "withdrawal" ? "−" : "+"}Rs.{" "}
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      transaction.status === "completed"
                        ? "text-green-600"
                        : transaction.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-500"
                    )}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
