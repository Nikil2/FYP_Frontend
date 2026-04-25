"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAdminDemoAccounts,
  getAdminSession,
  setAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const demoAccounts = useMemo(() => getAdminDemoAccounts(), []);

  const [email, setEmail] = useState("admin@mehnati.pk");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getAdminSession()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const matchedAdmin = validateAdminCredentials(email, password);

    if (!matchedAdmin) {
      setError("Invalid admin credentials. Use one of the demo accounts.");
      setIsLoading(false);
      return;
    }

    setAdminSession(matchedAdmin);
    router.replace("/admin/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0e1f19] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 py-8 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100/20 bg-emerald-100/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            Admin Access
          </p>

          <h1 className="max-w-lg text-4xl font-bold leading-tight md:text-5xl">
            Mehnati Admin Console
            <span className="block text-emerald-200">Secure and frontend-ready</span>
          </h1>

          <p className="max-w-lg text-base text-emerald-50/90 md:text-lg">
            Dedicated admin login and dashboard flow is now isolated from customer and worker journeys. Use demo credentials to enter.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {demoAccounts.map((account) => (
              <div
                key={account.email}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-emerald-200">{account.adminLevel}</p>
                <p className="mt-2 text-sm font-semibold">{account.name}</p>
                <p className="mt-1 text-xs text-emerald-100/90">{account.email}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full rounded-3xl border-white/20 bg-white/95 p-6 text-heading shadow-2xl md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-heading">Sign in as Admin</h2>
            <p className="mt-1 text-sm text-paragraph">This login is frontend-only for now. Backend auth will connect later.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-heading">
                Admin Email
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paragraph" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@mehnati.pk"
                  className="w-full rounded-xl border border-border bg-white px-10 py-3 text-sm outline-none ring-0 transition focus:border-emerald-400"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-heading">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paragraph" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-border bg-white px-10 py-3 pr-12 text-sm outline-none ring-0 transition focus:border-emerald-400"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            ) : null}

            <Button type="submit" className="w-full bg-[#0d1f1a] text-white hover:bg-[#13342b]" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Enter Admin Console"}
            </Button>

            <p className="text-xs text-paragraph">
              Demo passwords: admin@mehnati.pk uses admin123, moderator@mehnati.pk uses mod123.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
