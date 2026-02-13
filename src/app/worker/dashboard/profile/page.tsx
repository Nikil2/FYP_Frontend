"use client";

import { useMemo } from "react";
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

  const settingsItems = [
    {
      label: t.personalInfo,
      icon: User,
      href: "#",
    },
    {
      label: t.businessInfo,
      icon: Briefcase,
      href: "#",
    },
    {
      label: t.changePassword,
      icon: Lock,
      href: "#",
    },
    {
      label: t.previousWorkPhotos,
      icon: Image,
      href: "#",
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
    </div>
  );
}
