"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [autoAssignComplaints, setAutoAssignComplaints] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  return (
    <div>
      <AdminPageHeader
        title="Admin Settings"
        description="Configure moderation defaults, security controls, and operational behavior for admin users."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="text-lg font-semibold text-heading">Security</h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-3">
              <div>
                <p className="font-medium text-heading">Require 2FA for admins</p>
                <p className="text-xs text-paragraph">Adds second factor verification at login</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(event) => setTwoFactor(event.target.checked)}
                className="h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-3">
              <div>
                <p className="font-medium text-heading">Strict moderation mode</p>
                <p className="text-xs text-paragraph">Auto-hide high-risk accounts after repeated flags</p>
              </div>
              <input
                type="checkbox"
                checked={strictMode}
                onChange={(event) => setStrictMode(event.target.checked)}
                className="h-4 w-4"
              />
            </label>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
                Session timeout (minutes)
              </label>
              <select
                value={sessionTimeout}
                onChange={(event) => setSessionTimeout(event.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
              >
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="text-lg font-semibold text-heading">Operations</h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-3">
              <div>
                <p className="font-medium text-heading">Auto-assign complaints</p>
                <p className="text-xs text-paragraph">Distribute new disputes evenly among moderators</p>
              </div>
              <input
                type="checkbox"
                checked={autoAssignComplaints}
                onChange={(event) => setAutoAssignComplaints(event.target.checked)}
                className="h-4 w-4"
              />
            </label>

            <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
              <p className="text-sm text-paragraph">
                This page is frontend-only for now. In backend integration phase, settings will map to protected admin config endpoints.
              </p>
            </div>

            <Button className="w-full bg-[#0d1f1a] text-white hover:bg-[#15392f]">Save Settings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
