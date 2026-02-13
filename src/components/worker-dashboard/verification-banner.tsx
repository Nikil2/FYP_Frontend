"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle,
  WifiOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBannerProps {
  profileStatus: "pending" | "approved" | "rejected";
  isOnline: boolean;
  onGoLive: () => void;
}

export function VerificationBanner({
  profileStatus,
  isOnline,
  onGoLive,
}: VerificationBannerProps) {
  const { language } = useLanguage();
  const [goingLive, setGoingLive] = useState(false);
  const isUrdu = language === "ur";

  const t = {
    en: {
      pendingTitle: "Profile Under Verification",
      pendingSubtitle:
        "Your profile is being reviewed by our team. This usually takes 24-48 hours. We'll notify you once approved.",
      pendingSteps: [
        "Personal information submitted ✓",
        "Identity documents uploaded ✓",
        "Work photos uploaded ✓",
        "Admin review in progress...",
      ],
      rejectedTitle: "Profile Verification Failed",
      rejectedSubtitle:
        "Your profile could not be verified. Please update your information and re-submit.",
      rejectedAction: "Update Profile",
      approvedTitle: "Profile Verified!",
      approvedSubtitle:
        "Your profile has been approved. You can now go live and start receiving service requests!",
      goLive: "Go Live & Start Working",
      alreadyLive: "You're Live!",
      alreadyLiveSubtitle: "You're receiving service requests from customers nearby.",
    },
    ur: {
      pendingTitle: "پروفائل تصدیق جاری ہے",
      pendingSubtitle:
        "آپ کا پروفائل ہماری ٹیم کے زیر جائزہ ہے۔ اس میں عام طور پر 24-48 گھنٹے لگتے ہیں۔ منظوری ملنے پر آپ کو مطلع کیا جائے گا۔",
      pendingSteps: [
        "ذاتی معلومات جمع ✓",
        "شناختی دستاویزات اپ لوڈ ✓",
        "کام کی تصاویر اپ لوڈ ✓",
        "ایڈمن جائزہ جاری ہے...",
      ],
      rejectedTitle: "پروفائل تصدیق ناکام",
      rejectedSubtitle:
        "آپ کا پروفائل تصدیق نہیں ہو سکا۔ براہ کرم اپنی معلومات اپ ڈیٹ کریں۔",
      rejectedAction: "پروفائل اپ ڈیٹ کریں",
      approvedTitle: "پروفائل تصدیق شدہ!",
      approvedSubtitle:
        "آپ کا پروفائل منظور ہو گیا ہے۔ اب لائیو ہو کر سروس کی درخواستیں حاصل کریں!",
      goLive: "لائیو ہوں اور کام شروع کریں",
      alreadyLive: "آپ لائیو ہیں!",
      alreadyLiveSubtitle: "آپ قریبی کسٹمرز سے سروس کی درخواستیں وصول کر رہے ہیں۔",
    },
  };

  const labels = t[isUrdu ? "ur" : "en"];

  const handleGoLive = async () => {
    setGoingLive(true);
    // Simulate going live
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onGoLive();
    setGoingLive(false);
  };

  // ─── PENDING ───
  if (profileStatus === "pending") {
    return (
      <div
        className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 lg:p-8"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Animated clock icon */}
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-amber-800">{labels.pendingTitle}</h2>
            <p className="text-sm text-amber-700 mt-2 max-w-md mx-auto">
              {labels.pendingSubtitle}
            </p>
          </div>

          {/* Progress steps */}
          <div className="w-full max-w-sm space-y-2 text-left" dir="ltr">
            {labels.pendingSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm",
                  i < 3
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-100 text-amber-700"
                )}
              >
                {i < 3 ? (
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                )}
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>

          {/* Estimated time */}
          <div className="bg-white border border-amber-200 rounded-lg px-4 py-2">
            <p className="text-xs text-amber-600 font-medium">
              ⏱️ {isUrdu ? "تخمینی وقت: 24-48 گھنٹے" : "Estimated time: 24-48 hours"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── REJECTED ───
  if (profileStatus === "rejected") {
    return (
      <div
        className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 lg:p-8"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-800">{labels.rejectedTitle}</h2>
            <p className="text-sm text-red-600 mt-2 max-w-md mx-auto">
              {labels.rejectedSubtitle}
            </p>
          </div>

          <a
            href="/worker/dashboard/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            {labels.rejectedAction}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // ─── APPROVED but not online yet ───
  if (profileStatus === "approved" && !isOnline) {
    return (
      <div
        className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 lg:p-8"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-green-800">{labels.approvedTitle}</h2>
            <p className="text-sm text-green-700 mt-2 max-w-md mx-auto">
              {labels.approvedSubtitle}
            </p>
          </div>

          <button
            onClick={handleGoLive}
            disabled={goingLive}
            className="inline-flex items-center gap-2 px-8 py-4 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary-hover transition-all shadow-lg shadow-tertiary/30 text-lg disabled:opacity-70"
          >
            {goingLive ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isUrdu ? "لائیو ہو رہے ہیں..." : "Going Live..."}
              </>
            ) : (
              <>
                🚀 {labels.goLive}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── APPROVED and online ───
  if (profileStatus === "approved" && isOnline) {
    return (
      <div
        className="bg-tertiary/5 border border-tertiary/30 rounded-xl p-4 flex items-center gap-3"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-heading">{labels.alreadyLive}</p>
          <p className="text-xs text-paragraph">{labels.alreadyLiveSubtitle}</p>
        </div>
      </div>
    );
  }

  return null;
}
