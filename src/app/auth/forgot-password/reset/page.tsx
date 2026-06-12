"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetPassword, validatePassword } from "@/lib/auth";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const phone = sessionStorage.getItem("fp_phone");
    const savedOtp = sessionStorage.getItem("fp_otp");
    if (!phone || !savedOtp) {
      router.replace("/auth/forgot-password");
      return;
    }
    setPhoneNumber(phone);
    setOtp(savedOtp);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setError(validation.message || "Invalid password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(phoneNumber, otp, newPassword);
      if (result.success) {
        sessionStorage.removeItem("fp_phone");
        sessionStorage.removeItem("fp_otp");
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        setError(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-heading mb-2">Password Reset!</h2>
          <p className="text-sm text-paragraph">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/auth/forgot-password/otp")}
            className="inline-flex items-center gap-1 text-sm text-paragraph hover:text-heading"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-tertiary" />
          </div>
          <h1 className="text-2xl font-bold text-heading mb-2">New Password</h1>
          <p className="text-sm text-paragraph">
            Set a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-heading">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph w-5 h-5" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph hover:text-heading"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-heading">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph w-5 h-5" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Repeat new password"
                className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph hover:text-heading"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
