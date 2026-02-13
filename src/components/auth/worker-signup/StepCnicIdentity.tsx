"use client";

import { useRef, useState } from "react";
import { CreditCard, Upload, ShieldCheck, X } from "lucide-react";

interface Props {
  cnicNumber: string;
  cnicFrontImage: File | null;
  cnicBackImage: File | null;
  onCnicNumberChange: (value: string) => void;
  onCnicFrontChange: (file: File | null) => void;
  onCnicBackChange: (file: File | null) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepCnicIdentity({
  cnicNumber,
  cnicFrontImage,
  cnicBackImage,
  onCnicNumberChange,
  onCnicFrontChange,
  onCnicBackChange,
  errors,
  lang,
}: Props) {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "CNIC Verification",
      subtitle: "Your identity is verified for safety and trust",
      cnicNumber: "CNIC Number",
      cnicPlaceholder: "XXXXX-XXXXXXX-X",
      cnicFormat: "Format: 12345-1234567-1",
      frontPhoto: "CNIC Front Photo",
      backPhoto: "CNIC Back Photo",
      upload: "Tap to upload",
      change: "Change",
      securityNote: "Your CNIC data is encrypted and only used for verification",
    },
    ur: {
      title: "شناختی کارڈ تصدیق",
      subtitle: "آپ کی شناخت حفاظت اور اعتماد کے لیے تصدیق ہوتی ہے",
      cnicNumber: "شناختی کارڈ نمبر",
      cnicPlaceholder: "XXXXX-XXXXXXX-X",
      cnicFormat: "فارمیٹ: 12345-1234567-1",
      frontPhoto: "شناختی کارڈ سامنے کی تصویر",
      backPhoto: "شناختی کارڈ پیچھے کی تصویر",
      upload: "اپ لوڈ کریں",
      change: "تبدیل کریں",
      securityNote: "آپ کا ڈیٹا محفوظ ہے اور صرف تصدیق کے لیے استعمال ہوتا ہے",
    },
  };

  const labels = t[lang];

  // Format CNIC as user types: XXXXX-XXXXXXX-X
  const handleCnicInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + "-" + digits.slice(5);
    }
    if (digits.length > 12) {
      formatted = digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12);
    }
    onCnicNumberChange(formatted);
  };

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCnicFrontChange(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCnicBackChange(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {/* CNIC Number */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.cnicNumber} *</label>
        <div className="relative">
          <CreditCard className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-paragraph w-5 h-5`} />
          <input
            type="text"
            value={cnicNumber}
            onChange={(e) => handleCnicInput(e.target.value)}
            placeholder={labels.cnicPlaceholder}
            dir="ltr"
            className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white text-lg tracking-wider`}
          />
        </div>
        <p className="text-xs text-paragraph">{labels.cnicFormat}</p>
        {errors.cnicNumber && <p className="text-red-500 text-xs">{errors.cnicNumber}</p>}
      </div>

      {/* CNIC Photos */}
      <div className="grid grid-cols-1 gap-4">
        {/* Front */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-heading">{labels.frontPhoto} *</label>
          {frontPreview ? (
            <div className="relative">
              <img
                src={frontPreview}
                alt="CNIC Front"
                className="w-full h-40 object-cover rounded-lg border-2 border-tertiary"
              />
              <button
                type="button"
                onClick={() => { onCnicFrontChange(null); setFrontPreview(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-tertiary hover:bg-tertiary/5 transition-all"
            >
              <Upload className="w-8 h-8 text-paragraph" />
              <span className="text-sm text-paragraph">{labels.upload}</span>
              <span className="text-xs text-tertiary font-medium">{labels.frontPhoto}</span>
            </button>
          )}
          <input ref={frontInputRef} type="file" accept="image/*" onChange={handleFrontUpload} className="hidden" />
          {errors.cnicFrontImage && <p className="text-red-500 text-xs">{errors.cnicFrontImage}</p>}
        </div>

        {/* Back */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-heading">{labels.backPhoto} *</label>
          {backPreview ? (
            <div className="relative">
              <img
                src={backPreview}
                alt="CNIC Back"
                className="w-full h-40 object-cover rounded-lg border-2 border-tertiary"
              />
              <button
                type="button"
                onClick={() => { onCnicBackChange(null); setBackPreview(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => backInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-tertiary hover:bg-tertiary/5 transition-all"
            >
              <Upload className="w-8 h-8 text-paragraph" />
              <span className="text-sm text-paragraph">{labels.upload}</span>
              <span className="text-xs text-tertiary font-medium">{labels.backPhoto}</span>
            </button>
          )}
          <input ref={backInputRef} type="file" accept="image/*" onChange={handleBackUpload} className="hidden" />
          {errors.cnicBackImage && <p className="text-red-500 text-xs">{errors.cnicBackImage}</p>}
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
        <p className="text-xs text-green-700">{labels.securityNote}</p>
      </div>
    </div>
  );
}
