"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/language-context";
import { getProviderProfile, getProviderVerification } from "@/lib/mock-provider";
import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  Lock,
  Image,
  Phone,
  CreditCard,
  Award,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";
import type { VerificationStatus } from "@/types/provider";

export default function ProfilePage() {
  const { t } = useLanguage();
  const profile = useMemo(() => getProviderProfile(), []);
  const verification = useMemo(() => getProviderVerification(), []);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSettingClick = (action: string) => {
    switch (action) {
      case "personal-info":
        setActiveModal("personal-info");
        break;
      case "business-info":
        setActiveModal("business-info");
        break;
      case "change-password":
        setActiveModal("change-password");
        break;
      case "work-photos":
        setActiveModal("work-photos");
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  const settingsItems = [
    {
      label: t.personalInfo,
      icon: User,
      action: "personal-info",
    },
    {
      label: t.businessInfo,
      icon: Briefcase,
      action: "business-info",
    },
    {
      label: t.changePassword,
      icon: Lock,
      action: "change-password",
    },
    {
      label: t.previousWorkPhotos,
      icon: Image,
      action: "work-photos",
    },
  ];

  const verificationItems: {
    label: string;
    icon: React.ElementType;
    status: VerificationStatus;
  }[] = [
    {
      label: t.phoneNumber,
      icon: Phone,
      status: verification.phoneNumber,
    },
    {
      label: t.identityVerification,
      icon: CreditCard,
      status: verification.identityVerification,
    },
    {
      label: t.professionalInfo,
      icon: Award,
      status: verification.professionalInfo,
    },
  ];

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return (
          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
            {t.verified}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        );
      case "not-verified":
        return (
          <span className="text-sm font-medium text-red-500 flex items-center gap-1">
            {t.notVerified}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        );
      case "pending":
        return (
          <span className="text-sm font-medium text-yellow-600 flex items-center gap-1">
            {t.pending}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">
        {t.profile}
      </h1>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar src={profile.profileImage} alt={profile.name} size="xl" />

          <div>
            <h2 className="text-xl font-bold text-heading">{profile.name}</h2>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-paragraph text-sm">Rating</span>
              <span className="text-sm font-semibold text-tertiary">
                ({profile.rating.toFixed(1)})
              </span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          {/* Completed Services */}
          <div className="inline-flex items-center gap-1 px-4 py-1.5 border border-tertiary rounded-full text-sm font-medium text-tertiary">
            <CheckCircle className="w-4 h-4" />
            Completed Services {profile.completedServices}
          </div>

          {/* Profile Status */}
          <p className="text-sm text-paragraph">
            Profile Status:{" "}
            <span
              className={cn(
                "font-semibold",
                profile.profileStatus === "approved"
                  ? "text-green-600"
                  : profile.profileStatus === "pending"
                  ? "text-yellow-600"
                  : "text-red-500"
              )}
            >
              {profile.profileStatus.charAt(0).toUpperCase() +
                profile.profileStatus.slice(1)}
            </span>
          </p>
        </div>
      </Card>

      {/* General Settings */}
      <div>
        <h3 className="text-base font-bold text-heading mb-3 px-1">
          {t.generalSettings}
        </h3>
        <div className="space-y-1">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleSettingClick(item.action)}
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
        <h3 className="text-base font-bold text-heading mb-3 px-1">
          {t.accountVerification}
        </h3>
        <div className="space-y-1">
          {verificationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted animation-standard"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-tertiary" />
                  <span className="font-medium text-heading">{item.label}</span>
                </div>
                {getVerificationBadge(item.status)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {activeModal === "personal-info" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={profile.name} className="w-full border rounded-md px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" value={profile.phone} className="w-full border rounded-md px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input type="text" value={profile.city} className="w-full border rounded-md px-3 py-2" readOnly />
              </div>
              <p className="text-sm text-gray-500">Contact support to update personal information</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === "business-info" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Business Information</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input type="text" value={profile.category} className="w-full border rounded-md px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <input type="text" value={`${profile.experienceYears} years`} className="w-full border rounded-md px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea value={profile.bio} className="w-full border rounded-md px-3 py-2 h-20" readOnly />
              </div>
              <p className="text-sm text-gray-500">Contact support to update business information</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === "change-password" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="Confirm new password" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {alert('Password change not implemented yet'); setActiveModal(null);}}
                  className="flex-1 px-4 py-2 bg-tertiary text-white rounded-md hover:bg-tertiary-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "work-photos" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Previous Work Photos</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No work photos uploaded yet</p>
                  <p className="text-xs text-gray-400 mt-1">Photo gallery feature coming soon</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Photo upload not implemented yet')}
                className="w-full px-4 py-2 bg-tertiary text-white rounded-md hover:bg-tertiary-600"
              >
                Upload New Photos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
