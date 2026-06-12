"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { forgotPassword, validatePhoneNumber } from "@/lib/auth";
import { Phone, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid Pakistani phone number (e.g. 03XX-XXXXXXX)");
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(phoneNumber);
      if (result.success) {
        sessionStorage.setItem("fp_phone", phoneNumber);
        router.push("/auth/forgot-password/otp");
      } else {
        setError(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-sm text-paragraph hover:text-heading"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-tertiary" />
          </div>
          <h1 className="text-2xl font-bold text-heading mb-2">Forgot Password</h1>
          <p className="text-sm text-paragraph">
            Enter your registered phone number and we&apos;ll send you an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-heading">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph w-5 h-5" />
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); setError(""); }}
                placeholder="03XX-XXXXXXX"
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                required
              />
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
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
