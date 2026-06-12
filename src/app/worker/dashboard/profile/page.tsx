"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import {
  getCachedWorkerDashboardProfile,
  getWorkerDashboardProfileByUserId,
  resolveWorkerUserId,
} from "@/api/services/worker-dashboard";
import { getWorkerDetails } from "@/api/services/workers";
import { uploadPortfolio } from "@/api/services/uploads";
import { apiClient } from "@/api/client";
import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  Lock,
  Image as ImageIcon,
  Phone,
  CreditCard,
  Award,
  ChevronRight,
  Star,
  CheckCircle,
  Wrench,
  Pencil,
  Loader2,
  X,
  Trash2,
  Plus,
  CheckCircle2,
} from "lucide-react";
import type { VerificationStatus } from "@/types/provider";
import { ManageServicesModal } from "@/components/worker-dashboard/manage-services-modal";
import { changePassword, validatePassword } from "@/lib/auth";
import { toast } from "sonner";

interface PortfolioPhoto {
  id: string;
  imageUrl: string;
  description?: string;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    name: "Worker",
    phone: "",
    profileImage: null as string | null,
    rating: 0,
    completedServices: 0,
    profileStatus: "pending" as "approved" | "pending" | "rejected",
    city: "Pakistan",
    category: "Service Worker",
    experienceYears: 0,
    bio: "",
  });
  const [verification, setVerification] = useState({
    phoneNumber: "pending" as VerificationStatus,
    identityVerification: "pending" as VerificationStatus,
    professionalInfo: "pending" as VerificationStatus,
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [workerServices, setWorkerServices] = useState<{ serviceId: number; name: string; price: number }[]>([]);
  const [showServicesModal, setShowServicesModal] = useState(false);

  // Personal info edit
  const [piName, setPiName] = useState("");
  const [piSaving, setPiSaving] = useState(false);

  // Business info edit
  const [biBio, setBiBio] = useState("");
  const [biExp, setBiExp] = useState(0);
  const [biSaving, setBiSaving] = useState(false);

  // Change password
  const [cpCurrentPassword, setCpCurrentPassword] = useState("");
  const [cpNewPassword, setCpNewPassword] = useState("");
  const [cpConfirmPassword, setCpConfirmPassword] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState("");
  const [cpLoading, setCpLoading] = useState(false);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioPhoto[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hydrate = async () => {
      const cached = getCachedWorkerDashboardProfile();
      const mapStatus = (vs: string) =>
        vs === "APPROVED" ? "approved" : vs === "REJECTED" ? "rejected" : "pending";
      const mapVStatus = (s: string): VerificationStatus =>
        s === "approved" ? "verified" : s === "rejected" ? "not-verified" : "pending";

      let wid: string | null = null;

      if (cached) {
        const mappedStatus = mapStatus(cached.verificationStatus);
        wid = cached.workerId;
        setWorkerId(wid);
        setProfile((prev) => ({
          ...prev,
          name: cached.fullName,
          phone: cached.phoneNumber,
          profileImage: cached.profilePicUrl || null,
          rating: cached.averageRating || 0,
          completedServices: cached.totalJobsCompleted || 0,
          profileStatus: mappedStatus,
        }));
        setVerification({
          phoneNumber: "verified",
          identityVerification: mapVStatus(mappedStatus),
          professionalInfo: mapVStatus(mappedStatus),
        });
      } else {
        const userId = resolveWorkerUserId();
        if (!userId) return;
        const live = await getWorkerDashboardProfileByUserId(userId);
        const mappedStatus = mapStatus(live.verificationStatus);
        wid = live.workerId;
        setWorkerId(wid);
        setProfile((prev) => ({
          ...prev,
          name: live.fullName,
          phone: live.phoneNumber,
          profileImage: live.profilePicUrl || null,
          rating: live.averageRating || 0,
          completedServices: live.totalJobsCompleted || 0,
          profileStatus: mappedStatus,
        }));
        setVerification({
          phoneNumber: "verified",
          identityVerification: mapVStatus(mappedStatus),
          professionalInfo: mapVStatus(mappedStatus),
        });
      }

      if (wid) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const details = await getWorkerDetails(wid) as any;
          if (details?.services) {
            setWorkerServices(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              details.services.map((s: any) => ({
                serviceId: s.id,
                name: s.name,
                price: s.price || 0,
              }))
            );
          }
          setProfile((prev) => ({
            ...prev,
            bio: details?.bio || "",
            experienceYears: details?.experienceYears || 0,
            city: details?.city || prev.city,
          }));
        } catch {
          // non-critical
        }
      }
    };

    hydrate();
  }, []);

  const openModal = (action: string) => {
    if (action === "change-password") {
      setCpCurrentPassword("");
      setCpNewPassword("");
      setCpConfirmPassword("");
      setCpError("");
      setCpSuccess("");
    }
    if (action === "personal-info") {
      setPiName(profile.name);
    }
    if (action === "business-info") {
      setBiBio(profile.bio);
      setBiExp(profile.experienceYears);
    }
    if (action === "work-photos" && workerId) {
      setPortfolioLoading(true);
      apiClient
        .get<PortfolioPhoto[]>(`/workers/${workerId}/portfolio`)
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const arr = Array.isArray(res) ? res : (res as any)?.data ?? [];
          setPortfolio(arr);
        })
        .catch(() => {})
        .finally(() => setPortfolioLoading(false));
    }
    setActiveModal(action);
  };

  // ── Save Personal Info ──────────────────────────────────────────────────────
  const handleSavePersonalInfo = async () => {
    if (!piName.trim() || piName.trim() === profile.name) {
      setActiveModal(null);
      return;
    }
    setPiSaving(true);
    try {
      await apiClient.put("/users/me", { fullName: piName.trim() });
      setProfile((prev) => ({ ...prev, name: piName.trim() }));
      // Update cache
      const cached = getCachedWorkerDashboardProfile();
      if (cached) {
        localStorage.setItem(
          "worker-dashboard-profile:v1",
          JSON.stringify({ ...cached, fullName: piName.trim() })
        );
      }
      toast.success("Name updated successfully.");
      setActiveModal(null);
    } catch {
      toast.error("Failed to update name. Please try again.");
    } finally {
      setPiSaving(false);
    }
  };

  // ── Save Business Info ──────────────────────────────────────────────────────
  const handleSaveBusinessInfo = async () => {
    if (!workerId) return;
    setBiSaving(true);
    try {
      await apiClient.put(`/workers/${workerId}`, {
        bio: biBio.trim(),
        experienceYears: Number(biExp),
      });
      setProfile((prev) => ({ ...prev, bio: biBio.trim(), experienceYears: Number(biExp) }));
      toast.success("Business information updated.");
      setActiveModal(null);
    } catch {
      toast.error("Failed to update business information.");
    } finally {
      setBiSaving(false);
    }
  };

  // ── Change Password ─────────────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpError("");
    setCpSuccess("");
    const validation = validatePassword(cpNewPassword);
    if (!validation.valid) { setCpError(validation.message || "Invalid password"); return; }
    if (cpNewPassword !== cpConfirmPassword) { setCpError("Passwords do not match"); return; }
    if (cpCurrentPassword === cpNewPassword) { setCpError("New password must be different"); return; }
    setCpLoading(true);
    try {
      const result = await changePassword(cpCurrentPassword, cpNewPassword);
      if (result.success) {
        setCpSuccess("Password changed successfully!");
        setTimeout(() => setActiveModal(null), 1800);
      } else {
        setCpError(result.message);
      }
    } finally {
      setCpLoading(false);
    }
  };

  // ── Portfolio Upload ────────────────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    if (!workerId) return;
    setUploadingPhoto(true);
    try {
      const result = await uploadPortfolio(file, workerId);
      // After upload, re-fetch portfolio from backend
      const refreshed = await apiClient.get<PortfolioPhoto[]>(`/workers/${workerId}/portfolio`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arr = Array.isArray(refreshed) ? refreshed : (refreshed as any)?.data ?? [];
      setPortfolio(arr);
      toast.success("Photo uploaded successfully.");
    } catch {
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!workerId) return;
    setDeletingPhoto(photoId);
    try {
      await apiClient.delete(`/workers/${workerId}/portfolio/${photoId}`);
      setPortfolio((prev) => prev.filter((p) => p.id !== photoId));
      toast.success("Photo removed.");
    } catch {
      toast.error("Failed to remove photo.");
    } finally {
      setDeletingPhoto(null);
    }
  };

  const settingsItems = [
    { label: t.personalInfo, icon: User, action: "personal-info" },
    { label: t.businessInfo, icon: Briefcase, action: "business-info" },
    { label: t.changePassword, icon: Lock, action: "change-password" },
    { label: t.previousWorkPhotos, icon: ImageIcon, action: "work-photos" },
  ];

  const verificationItems: { label: string; icon: React.ElementType; status: VerificationStatus }[] = [
    { label: t.phoneNumber, icon: Phone, status: verification.phoneNumber },
    { label: t.identityVerification, icon: CreditCard, status: verification.identityVerification },
    { label: t.professionalInfo, icon: Award, status: verification.professionalInfo },
  ];

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return (
          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
            {t.verified}<ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        );
      case "not-verified":
        return (
          <span className="text-sm font-medium text-red-500 flex items-center gap-1">
            {t.notVerified}<ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        );
      case "pending":
        return (
          <span className="text-sm font-medium text-yellow-600 flex items-center gap-1">
            {t.pending}<ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">{t.profile}</h1>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar src={profile.profileImage} alt={profile.name} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-heading">{profile.name}</h2>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-paragraph text-sm">Rating</span>
              <span className="text-sm font-semibold text-tertiary">({profile.rating.toFixed(1)})</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            {profile.bio && (
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{profile.bio}</p>
            )}
          </div>
          <div className="inline-flex items-center gap-1 px-4 py-1.5 border border-tertiary rounded-full text-sm font-medium text-tertiary">
            <CheckCircle className="w-4 h-4" />
            Completed Services {profile.completedServices}
          </div>
          <p className="text-sm text-paragraph">
            Profile Status:{" "}
            <span className={cn("font-semibold",
              profile.profileStatus === "approved" ? "text-green-600"
              : profile.profileStatus === "pending" ? "text-yellow-600"
              : "text-red-500"
            )}>
              {profile.profileStatus.charAt(0).toUpperCase() + profile.profileStatus.slice(1)}
            </span>
          </p>
        </div>
      </Card>

      {/* My Services */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-heading">My Services</h3>
          <button onClick={() => setShowServicesModal(true)} className="flex items-center gap-1.5 text-sm font-medium text-tertiary hover:text-tertiary/80 transition-colors">
            <Pencil className="w-3.5 h-3.5" />Manage
          </button>
        </div>
        <Card className="p-4">
          {workerServices.length === 0 ? (
            <div className="text-center py-4 space-y-2">
              <Wrench className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-paragraph">No services added yet</p>
              <button onClick={() => setShowServicesModal(true)} className="text-sm font-medium text-tertiary hover:underline">Add your first service</button>
            </div>
          ) : (
            <div className="space-y-2">
              {workerServices.map((s) => (
                <div key={s.serviceId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm font-medium text-heading">{s.name}</span>
                  <span className="text-sm font-semibold text-tertiary">Rs. {s.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* General Settings */}
      <div>
        <h3 className="text-base font-bold text-heading mb-3 px-1">{t.generalSettings}</h3>
        <div className="space-y-1">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => openModal(item.action)}
                className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted animation-standard"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-tertiary" />
                  <span className="font-medium text-heading">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Verification */}
      <div>
        <h3 className="text-base font-bold text-heading mb-3 px-1">{t.accountVerification}</h3>
        <div className="space-y-1">
          {verificationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-tertiary" />
                  <span className="font-medium text-heading">{item.label}</span>
                </div>
                {getVerificationBadge(item.status)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manage Services Modal */}
      {showServicesModal && workerId && (
        <ManageServicesModal
          workerId={workerId}
          initialServices={workerServices.map((s) => ({ serviceId: s.serviceId, price: s.price }))}
          onClose={() => setShowServicesModal(false)}
          onSaved={async () => {
            if (!workerId) return;
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const details = await getWorkerDetails(workerId) as any;
              if (details?.services) {
                setWorkerServices(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  details.services.map((s: any) => ({ serviceId: s.id, name: s.name, price: s.price || 0 }))
                );
              }
            } catch { /* ignore */ }
          }}
        />
      )}

      {/* ── PERSONAL INFO MODAL ──────────────────────────────────────────── */}
      {activeModal === "personal-info" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-bold text-heading">Personal Information</h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  value={piName}
                  onChange={(e) => setPiName(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30 text-heading"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  readOnly
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-gray-50 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Phone number cannot be changed</p>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setActiveModal(null)} disabled={piSaving}>Cancel</Button>
                <Button variant="tertiary" size="sm" className="flex-1" onClick={handleSavePersonalInfo} disabled={piSaving || !piName.trim()}>
                  {piSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BUSINESS INFO MODAL ──────────────────────────────────────────── */}
      {activeModal === "business-info" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-bold text-heading">Business Information</h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Years of Experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={biExp}
                  onChange={(e) => setBiExp(Number(e.target.value))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30 text-heading"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5">Bio / About Me</label>
                <textarea
                  value={biBio}
                  onChange={(e) => setBiBio(e.target.value)}
                  rows={4}
                  placeholder="Tell customers about yourself, your skills, and what makes you great at your work..."
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30 text-heading resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1">{biBio.length}/300 characters</p>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setActiveModal(null)} disabled={biSaving}>Cancel</Button>
                <Button variant="tertiary" size="sm" className="flex-1" onClick={handleSaveBusinessInfo} disabled={biSaving}>
                  {biSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ─────────────────────────────────────────── */}
      {activeModal === "change-password" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-bold text-heading">Change Password</h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5">
              {cpSuccess ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-green-700">{cpSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { label: "Current Password", value: cpCurrentPassword, set: setCpCurrentPassword },
                    { label: "New Password", value: cpNewPassword, set: setCpNewPassword },
                    { label: "Confirm New Password", value: cpConfirmPassword, set: setCpConfirmPassword },
                  ].map(({ label, value, set }) => (
                    <div key={label}>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</label>
                      <input
                        type="password"
                        value={value}
                        onChange={(e) => { set(e.target.value); setCpError(""); }}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                        placeholder={label === "New Password" ? "At least 6 characters" : ""}
                        required
                      />
                    </div>
                  ))}
                  {cpError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">{cpError}</div>
                  )}
                  <div className="flex gap-3 pt-1">
                    <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="tertiary" size="sm" className="flex-1" disabled={cpLoading}>
                      {cpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── WORK PHOTOS / PORTFOLIO MODAL ─────────────────────────────────── */}
      {activeModal === "work-photos" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-heading">Portfolio Photos</h3>
                <p className="text-xs text-muted-foreground">{portfolio.length} photo{portfolio.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {portfolioLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-tertiary animate-spin" />
                </div>
              ) : (
                <>
                  {portfolio.length === 0 && (
                    <div className="text-center py-10">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-medium text-heading mb-1">No portfolio photos yet</p>
                      <p className="text-xs text-muted-foreground">Upload photos of your work to attract more customers</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {portfolio.map((photo) => (
                      <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                        <img
                          src={photo.imageUrl}
                          alt={photo.description || "Work photo"}
                          className="w-full h-full object-cover"
                        />
                        {photo.description && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                            <p className="text-[10px] text-white truncate">{photo.description}</p>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={deletingPhoto === photo.id}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          {deletingPhoto === photo.id
                            ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5 text-white" />
                          }
                        </button>
                      </div>
                    ))}

                    {/* Upload tile */}
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-tertiary hover:bg-tertiary/5 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {uploadingPhoto
                        ? <Loader2 className="w-6 h-6 text-tertiary animate-spin" />
                        : <>
                            <Plus className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-medium">Add Photo</span>
                          </>
                      }
                    </button>
                  </div>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                      e.target.value = "";
                    }}
                  />
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t border-border flex-shrink-0">
              <Button
                variant="tertiary"
                size="sm"
                className="w-full gap-2"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Upload New Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
