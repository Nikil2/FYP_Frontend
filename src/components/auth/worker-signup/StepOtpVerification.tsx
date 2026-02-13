"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

interface Props {
  phoneNumber: string;
  otpCode: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepOtpVerification({ phoneNumber, otpCode, onChange, errors, lang }: Props) {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "Verify Your Phone",
      subtitle: "Enter the 6-digit code sent to",
      resend: "Resend Code",
      resendIn: "Resend code in",
      seconds: "s",
      didntReceive: "Didn't receive the code?",
    },
    ur: {
      title: "اپنا فون تصدیق کریں",
      subtitle: "6 ہندسوں کا کوڈ درج کریں جو بھیجا گیا",
      resend: "کوڈ دوبارہ بھیجیں",
      resendIn: "دوبارہ بھیجیں",
      seconds: "سیکنڈ",
      didntReceive: "کوڈ نہیں ملا؟",
    },
  };

  const labels = t[lang];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    onChange(newDigits.join(""));

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    onChange(newDigits.join(""));
    if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setDigits(["", "", "", "", "", ""]);
    onChange("");
    // TODO: API call to resend OTP
  };

  return (
    <div className="space-y-6" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">
          {labels.subtitle}
        </p>
        <p className="text-heading font-semibold mt-1" dir="ltr">{phoneNumber}</p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3" dir="ltr" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary transition-all ${
              digit ? "border-tertiary bg-tertiary/5" : "border-border bg-white"
            }`}
          />
        ))}
      </div>

      {errors.otpCode && (
        <p className="text-red-500 text-xs text-center">{errors.otpCode}</p>
      )}

      {/* Timer / Resend */}
      <div className="text-center">
        <p className="text-paragraph text-sm">{labels.didntReceive}</p>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-tertiary font-semibold text-sm mt-1 hover:underline"
          >
            {labels.resend}
          </button>
        ) : (
          <p className="text-paragraph text-sm mt-1">
            {labels.resendIn} {timer}{labels.seconds}
          </p>
        )}
      </div>
    </div>
  );
}
