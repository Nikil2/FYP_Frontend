"use client";

import { useRef } from "react";
import { ImagePlus, X, Camera } from "lucide-react";

interface Props {
  workPhotos: File[];
  onPhotosChange: (photos: File[]) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepWorkPhotos({ workPhotos, onPhotosChange, errors, lang }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "Previous Work Photos",
      subtitle: "Show customers the quality of your work",
      mandatory: "Minimum 2 photos required",
      addPhoto: "Add Photo",
      photosAdded: "photos added",
      maxPhotos: "Maximum 6 photos allowed",
      remove: "Remove",
      tips: [
        "Clear, well-lit photos work best",
        "Show before & after if possible",
        "Include different types of work",
      ],
    },
    ur: {
      title: "پچھلے کام کی تصاویر",
      subtitle: "کسٹمرز کو اپنے کام کا معیار دکھائیں",
      mandatory: "کم از کم 2 تصاویر ضروری ہیں",
      addPhoto: "تصویر شامل کریں",
      photosAdded: "تصاویر شامل ہیں",
      maxPhotos: "زیادہ سے زیادہ 6 تصاویر",
      remove: "ہٹائیں",
      tips: [
        "صاف اور روشن تصاویر بہتر ہیں",
        "ممکن ہو تو پہلے اور بعد کی تصویر دکھائیں",
        "مختلف قسم کے کام شامل کریں",
      ],
    },
  };

  const labels = t[lang];

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 6 - workPhotos.length;
    const newPhotos = [...workPhotos, ...files.slice(0, remaining)];
    onPhotosChange(newPhotos);
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    onPhotosChange(workPhotos.filter((_, i) => i !== index));
  };

  const getPreviewUrl = (file: File) => URL.createObjectURL(file);

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
        <p className="text-red-500 text-xs font-semibold mt-1">⚠️ {labels.mandatory}</p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-3">
        {workPhotos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-tertiary">
            <img
              src={getPreviewUrl(photo)}
              alt={`Work photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add Photo Button */}
        {workPhotos.length < 6 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-tertiary/40 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-tertiary hover:bg-tertiary/5 transition-all"
          >
            <ImagePlus className="w-6 h-6 text-tertiary" />
            <span className="text-xs text-tertiary font-medium">{labels.addPhoto}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleAddPhotos}
        className="hidden"
      />

      {/* Counter */}
      <p className="text-center text-sm text-paragraph">
        <span className={`font-bold ${workPhotos.length >= 2 ? "text-green-600" : "text-red-500"}`}>
          {workPhotos.length}
        </span>
        /6 {labels.photosAdded}
      </p>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-blue-700 mb-2">💡 Tips</p>
        <ul className="space-y-1">
          {labels.tips.map((tip, i) => (
            <li key={i} className="text-xs text-blue-600 flex items-start gap-2">
              <span>•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {errors.workPhotos && <p className="text-red-500 text-xs">{errors.workPhotos}</p>}
    </div>
  );
}
