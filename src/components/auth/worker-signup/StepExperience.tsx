"use client";

import { Briefcase, DollarSign, FileText } from "lucide-react";
import { WorkerSignupFormData } from "@/interfaces/auth-interfaces";

interface Props {
  formData: WorkerSignupFormData;
  onChange: (field: keyof WorkerSignupFormData, value: string | number) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepExperience({ formData, onChange, errors, lang }: Props) {
  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "Your Experience",
      subtitle: "Tell us about your work background",
      experience: "Years of Experience",
      charges: "Visiting Charges (PKR)",
      chargesHint: "How much do you charge per visit",
      bio: "About You",
      bioPlaceholder: "Describe your skills, experience, and what makes you stand out...",
      bioHint: "This will be shown on your profile to customers",
      experienceOptions: [
        "Less than 1 year",
        "1-2 years",
        "3-5 years",
        "5-10 years",
        "10+ years",
      ],
    },
    ur: {
      title: "آپ کا تجربہ",
      subtitle: "اپنے کام کے تجربے کے بارے میں بتائیں",
      experience: "تجربے کے سال",
      charges: "وزٹ چارجز (روپے)",
      chargesHint: "فی وزٹ کتنا چارج کرتے ہیں",
      bio: "اپنے بارے میں",
      bioPlaceholder: "اپنی مہارت، تجربہ اور خوبیاں بیان کریں...",
      bioHint: "یہ کسٹمرز کو آپ کی پروفائل پر دکھایا جائے گا",
      experienceOptions: [
        "1 سال سے کم",
        "1-2 سال",
        "3-5 سال",
        "5-10 سال",
        "10+ سال",
      ],
    },
  };

  const labels = t[lang];
  const experienceValues = [0, 1, 3, 5, 10];

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {/* Experience Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-heading">{labels.experience} *</label>
        <div className="grid grid-cols-1 gap-2">
          {labels.experienceOptions.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange("experienceYears", experienceValues[index])}
              className={`p-3 border-2 rounded-lg text-sm font-medium text-left transition-all ${
                formData.experienceYears === experienceValues[index]
                  ? "border-tertiary bg-tertiary/5 text-tertiary"
                  : "border-border text-heading hover:border-tertiary/40 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.experienceYears === experienceValues[index]
                    ? "border-tertiary"
                    : "border-gray-300"
                }`}>
                  {formData.experienceYears === experienceValues[index] && (
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  )}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
        {errors.experienceYears && <p className="text-red-500 text-xs">{errors.experienceYears}</p>}
      </div>

      {/* Visiting Charges */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.charges} *</label>
        <div className="relative">
          <DollarSign className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-paragraph w-5 h-5`} />
          <input
            type="number"
            value={formData.visitingCharges || ""}
            onChange={(e) => onChange("visitingCharges", parseInt(e.target.value) || 0)}
            placeholder="500"
            min="0"
            dir="ltr"
            className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
        </div>
        <p className="text-xs text-paragraph">{labels.chargesHint}</p>
        {errors.visitingCharges && <p className="text-red-500 text-xs">{errors.visitingCharges}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">{labels.bio} *</label>
        <div className="relative">
          <FileText className={`absolute ${isUrdu ? "right-3" : "left-3"} top-3 text-paragraph w-5 h-5`} />
          <textarea
            value={formData.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder={labels.bioPlaceholder}
            rows={4}
            className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent resize-none bg-white`}
          />
        </div>
        <p className="text-xs text-paragraph">{labels.bioHint}</p>
        {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
      </div>
    </div>
  );
}
