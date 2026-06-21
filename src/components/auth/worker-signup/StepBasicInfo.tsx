"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
} from "lucide-react";
import { WorkerSignupFormData } from "@/interfaces/auth-interfaces";

interface Props {
  formData: WorkerSignupFormData;
  onChange: (field: keyof WorkerSignupFormData, value: string) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepBasicInfo({ formData, onChange, errors, lang }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = {
    en: {
      title: "Create Your Account",
      subtitle: "Enter your basic information to get started",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      phone: "Phone Number",
      phonePlaceholder: "03XX-XXXXXXX",
      password: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
    },
    ur: {
      title: "اپنا اکاؤنٹ بنائیں",
      subtitle: "شروع کرنے کے لیے بنیادی معلومات درج کریں",
      fullName: "پورا نام",
      fullNamePlaceholder: "اپنا پورا نام لکھیں",
      phone: "فون نمبر",
      phonePlaceholder: "03XX-XXXXXXX",
      password: "پاسورڈ",
      passwordPlaceholder: "مضبوط پاسورڈ بنائیں",
      confirmPassword: "پاسورڈ دوبارہ",
      confirmPasswordPlaceholder: "دوبارہ پاسورڈ لکھیں",
    },
  };

  const labels = t[lang];
  const isUrdu = lang === "ur";

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.fullName} *</label>
        <div className="relative">
          <User className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-paragraph w-5 h-5`} />
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder={labels.fullNamePlaceholder}
            className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.phone} *</label>
        <div className="relative">
          <Phone className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-paragraph w-5 h-5`} />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder={labels.phonePlaceholder}
            dir="ltr"
            className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
        </div>
        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.password} *</label>
        <div className="relative">
          <Lock className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-paragraph w-5 h-5`} />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder={labels.passwordPlaceholder}
            className={`w-full ${isUrdu ? "pr-10 pl-12" : "pl-10 pr-12"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${isUrdu ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-paragraph hover:text-heading`}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.confirmPassword} *</label>
        <div className="relative">
          <Lock className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-paragraph w-5 h-5`} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            placeholder={labels.confirmPasswordPlaceholder}
            className={`w-full ${isUrdu ? "pr-10 pl-12" : "pl-10 pr-12"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute ${isUrdu ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-paragraph hover:text-heading`}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
}
