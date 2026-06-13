"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, Phone, Calendar, Loader2, CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/customer/notification-bell";
import { getAuthUser } from "@/lib/auth";
import { apiClient } from "@/api/client";
import { toast } from "sonner";
import type { User as AuthUser } from "@/interfaces/auth-interfaces";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
    setFullName(authUser?.fullName || "");
  }, []);

  const handleSave = async () => {
    if (!fullName.trim() || fullName.trim() === user?.fullName) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await apiClient.put("/users/me", { fullName: fullName.trim() });

      // Update localStorage
      if (user) {
        const updated = { ...user, fullName: fullName.trim() };
        localStorage.setItem("authUser", JSON.stringify(updated));
        setUser(updated);
      }
      setEditing(false);
      setSaved(true);
      toast.success("Profile updated successfully.");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/profile")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading flex-1">Account Settings</h1>
        <NotificationBell />
      </div>

      <div className="p-4 space-y-4">
        {/* Avatar */}
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-tertiary/20 flex items-center justify-center border-2 border-tertiary">
            <span className="text-2xl font-bold text-tertiary">
              {user?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Profile photo editing coming soon</p>
        </div>

        {/* Edit Name */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-heading">Personal Information</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-xs text-tertiary font-medium hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30 text-heading"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-medium text-heading">{user?.fullName || "—"}</p>
              )}
            </div>

            {/* Phone (read-only) */}
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              <p className="text-sm font-medium text-heading">{user?.phoneNumber || "—"}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Phone number cannot be changed</p>
            </div>

            {/* Member Since */}
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </label>
              <p className="text-sm font-medium text-heading">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-PK", { month: "long", year: "numeric" })
                  : "—"}
              </p>
            </div>

            {editing && (
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setEditing(false); setFullName(user?.fullName || ""); }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving || !fullName.trim()}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4" /> Changes saved successfully
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-heading">Security</h3>
          </div>
          <button
            onClick={() => router.push("/customer/change-password")}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-heading hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">Change Password</span>
            <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl border border-red-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-red-100">
            <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-3">
              Deleting your account will permanently remove all your data, orders, and history. This action cannot be undone.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 w-full"
              onClick={() => toast.error("Account deletion requires contacting support: support@mehnati.pk")}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
