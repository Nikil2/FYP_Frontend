"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_WORKERS, setCurrentWorkerId } from "./dummy-workers";
import { setAuthToken } from "@/lib/auth";
import {
  Phone,
  Lock,
  LogIn,
  User,
  MapPin,
  Briefcase,
  Star,
  Shield,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function DummyAccountsPage() {
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  const handleQuickLogin = (workerId: string) => {
    setLoggingIn(workerId);
    const worker = DUMMY_WORKERS.find((w) => w.id === workerId);
    if (!worker) return;

    const fakeToken = `dummy-token-${worker.id}-${Date.now()}`;
    setAuthToken(fakeToken);
    setCurrentWorkerId(worker.id);

    setTimeout(() => {
      router.push("/worker/dashboard");
    }, 500);
  };

  const statusConfig = {
    approved: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Approved",
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending Verification",
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: Shield,
      label: "Rejected",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading mb-2">
            🧪 Dummy Worker Accounts
          </h1>
          <p className="text-paragraph">
            Use these test credentials to login and explore the worker dashboard
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            All passwords are: <span className="font-mono font-bold">123456</span>
          </p>
        </div>

        {/* Worker Cards */}
        <div className="grid gap-6">
          {DUMMY_WORKERS.map((worker) => {
            const status =
              statusConfig[worker.profile.profileStatus] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <Card key={worker.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-tertiary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-heading">
                          {worker.profile.name}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {worker.profile.isOnline ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Wifi className="w-3 h-3" /> Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <WifiOff className="w-3 h-3" /> Offline
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-sm text-paragraph flex-wrap">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {worker.profile.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {worker.profile.city}
                        </span>
                        {worker.profile.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            {worker.profile.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Quick stats */}
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {worker.stats.completedOrders} completed •{" "}
                          {worker.stats.activeOrders} active
                        </span>
                        <span>
                          Rs. {worker.earnings.totalEarnings.toLocaleString()} earned
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Credentials + Login */}
                  <div className="flex flex-col items-end gap-3 lg:min-w-[220px]">
                    {/* Credentials */}
                    <div className="bg-gray-50 rounded-lg p-3 w-full text-sm font-mono">
                      <div className="flex items-center gap-2 text-heading">
                        <Phone className="w-3.5 h-3.5 text-tertiary" />
                        <span>{worker.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-heading mt-1">
                        <Lock className="w-3.5 h-3.5 text-tertiary" />
                        <span>{worker.password}</span>
                      </div>
                    </div>

                    {/* Quick Login Button */}
                    <Button
                      onClick={() => handleQuickLogin(worker.id)}
                      disabled={loggingIn === worker.id}
                      className="w-full"
                    >
                      {loggingIn === worker.id ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span> Logging in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <LogIn className="w-4 h-4" /> Quick Login
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Or go to{" "}
            <a
              href="/auth/login"
              className="text-tertiary font-medium hover:underline"
            >
              /auth/login
            </a>{" "}
            and enter any of these credentials manually.
          </p>
        </div>
      </div>
    </div>
  );
}
