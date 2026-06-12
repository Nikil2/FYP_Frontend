"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyOtp } from "@/lib/auth";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const phone = sessionStorage.getItem("fp_phone");
    if (!phone) {
      router.replace("/auth/forgot-password");
      return;
    }
    setPhoneNumber(phone);
    inputRefs.current[0]?.focus();
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    setError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtp(updated);
    const nextEmpty = updated.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtp(phoneNumber, otpString);
      if (result.success) {
        sessionStorage.setItem("fp_otp", otpString);
        router.push("/auth/forgot-password/reset");
      } else {
        setError(result.message);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const maskedPhone = phoneNumber
    ? phoneNumber.slice(0, 4) + "****" + phoneNumber.slice(-3)
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/auth/forgot-password")}
            className="inline-flex items-center gap-1 text-sm text-paragraph hover:text-heading"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-tertiary" />
          </div>
          <h1 className="text-2xl font-bold text-heading mb-2">Enter OTP</h1>
          <p className="text-sm text-paragraph">
            Enter the 6-digit OTP sent to <span className="font-medium text-heading">{maskedPhone}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Use <span className="font-mono font-semibold">000000</span> for testing)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-11 h-12 text-center text-lg font-bold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || otp.join("").length < 6}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
