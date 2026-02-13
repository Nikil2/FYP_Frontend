"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, RefreshCw, UserCheck, Upload } from "lucide-react";

interface Props {
  selfieImage: File | null;
  onSelfieChange: (file: File | null) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepSelfieVerification({ selfieImage, onSelfieChange, errors, lang }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "Verify Your Identity",
      subtitle: "Take a clear selfie so customers can trust your profile",
      takeSelfie: "Take a Selfie",
      uploadPhoto: "Or Upload a Photo",
      capture: "Capture",
      retake: "Retake",
      verified: "Selfie Added ✓",
      instructions: [
        "Face the camera directly",
        "Make sure your face is clearly visible",
        "Use good lighting",
        "Remove sunglasses or face coverings",
      ],
    },
    ur: {
      title: "اپنی شناخت تصدیق کریں",
      subtitle: "واضح سیلفی لیں تاکہ کسٹمرز آپ پر اعتماد کر سکیں",
      takeSelfie: "سیلفی لیں",
      uploadPhoto: "یا تصویر اپ لوڈ کریں",
      capture: "کیپچر",
      retake: "دوبارہ لیں",
      verified: "سیلفی شامل ✓",
      instructions: [
        "کیمرے کی طرف سیدھا دیکھیں",
        "چہرہ صاف دکھائی دے",
        "اچھی روشنی میں لیں",
        "چشمہ یا چہرے کی چادر ہٹائیں",
      ],
    },
  };

  const labels = t[lang];

  // When stream changes and video element exists, attach it
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, isCameraActive]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      // Set state first so the video element renders, then the effect will attach the stream
      setPreviewUrl(null);
      onSelfieChange(null);
      setIsCameraActive(true);
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert(lang === "ur" ? "کیمرے تک رسائی نہیں ملی۔ براؤزر سیٹنگز چیک کریں۔" : "Camera access denied. Please check browser permissions.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          onSelfieChange(file);
          setPreviewUrl(URL.createObjectURL(file));
        }
      }, "image/jpeg", 0.9);
    }

    // Stop camera
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelfieChange(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsCameraActive(false);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    onSelfieChange(null);
    startCamera();
  };

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {/* Camera / Preview Area */}
      <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-tertiary/30 bg-gray-100">
        {/* Video element always present so ref works - hidden when not active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
        />
        {previewUrl && !isCameraActive && (
          <img
            src={previewUrl}
            alt="Selfie preview"
            className="w-full h-full object-cover"
          />
        )}
        {!isCameraActive && !previewUrl && (
          <div className="w-full h-full flex flex-col items-center justify-center text-paragraph">
            <Camera className="w-12 h-12 mb-2" />
            <p className="text-xs">{labels.takeSelfie}</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3">
        {!isCameraActive && !previewUrl && (
          <>
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-tertiary text-white rounded-lg hover:bg-tertiary/90 transition-colors font-medium"
            >
              <Camera className="w-5 h-5" />
              {labels.takeSelfie}
            </button>
            <p className="text-xs text-paragraph">{labels.uploadPhoto}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-heading hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {labels.uploadPhoto}
            </button>
          </>
        )}

        {isCameraActive && (
          <button
            type="button"
            onClick={capturePhoto}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold shadow-lg"
          >
            <Camera className="w-5 h-5" />
            {labels.capture}
          </button>
        )}

        {previewUrl && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-heading hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {labels.retake}
            </button>
            <span className="text-green-600 font-semibold text-sm">{labels.verified}</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <ul className="space-y-1.5">
          {labels.instructions.map((inst, i) => (
            <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
              <span>📷</span>
              <span>{inst}</span>
            </li>
          ))}
        </ul>
      </div>

      {errors.selfieImage && <p className="text-red-500 text-xs text-center">{errors.selfieImage}</p>}
    </div>
  );
}
