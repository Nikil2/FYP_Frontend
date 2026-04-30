"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  validatePhoneNumber,
  validatePassword,
  validateCNIC,
  validateEmail,
  login,
} from "@/lib/auth";
import { WorkerSignupFormData } from "@/interfaces/auth-interfaces";
import { registerWorker, ApiRequestError } from "@/api";

import { StepBasicInfo } from "./StepBasicInfo";
import { StepOtpVerification } from "./StepOtpVerification";
import { StepServiceSelection } from "./StepServiceSelection";
import { StepAddressLocation } from "./StepAddressLocation";
import { StepExperience } from "./StepExperience";
import { StepWorkPhotos } from "./StepWorkPhotos";
import { StepSelfieVerification } from "./StepSelfieVerification";
import { StepCnicIdentity } from "./StepCnicIdentity";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";

const TOTAL_STEPS = 8;

const STEP_LABELS = {
  en: ["Account", "OTP", "Services", "Location", "Experience", "Work Photos", "Selfie", "CNIC"],
  ur: ["اکاؤنٹ", "او ٹی پی", "سروسز", "مقام", "تجربہ", "کام کی تصاویر", "سیلفی", "شناختی کارڈ"],
};

export function WorkerSignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<WorkerSignupFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otpCode: "",
    selectedServiceIds: [],
    homeAddress: "",
    homeLat: 0,
    homeLng: 0,
    experienceYears: 0,
    visitingCharges: 0,
    bio: "",
    workPhotos: [],
    selfieImage: null,
    cnicNumber: "",
    cnicFrontImage: null,
    cnicBackImage: null,
  });

  // Cloudinary upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedWorkPhotoUrls, setUploadedWorkPhotoUrls] = useState<string[]>([]);
  const [uploadedSelfieUrl, setUploadedSelfieUrl] = useState<string | null>(null);
  const [uploadedCnicFrontUrl, setUploadedCnicFrontUrl] = useState<string | null>(null);
  const [uploadedCnicBackUrl, setUploadedCnicBackUrl] = useState<string | null>(null);

  const isUrdu = lang === "ur";

  // ─── Field Change Handlers ───

  const handleFieldChange = (field: keyof WorkerSignupFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleServicesChange = (serviceIds: number[]) => {
    setFormData((prev) => ({ ...prev, selectedServiceIds: serviceIds }));
    if (errors.selectedServiceIds) {
      setErrors((prev) => ({ ...prev, selectedServiceIds: "" }));
    }
  };

  const handleAddressChange = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, homeAddress: address, homeLat: lat, homeLng: lng }));
    if (errors.homeAddress) setErrors((prev) => ({ ...prev, homeAddress: "" }));
  };

  const handleWorkPhotosChange = async (photos: File[]) => {
    setFormData((prev) => ({ ...prev, workPhotos: photos }));
    if (errors.workPhotos) setErrors((prev) => ({ ...prev, workPhotos: "" }));

    // Upload to Cloudinary immediately when 2+ photos selected
    if (photos.length >= 2) {
      setIsUploading(true);
      setUploadProgress((prev) => ({ ...prev, workPhotos: 0 }));
      try {
        const urls = await uploadMultipleToCloudinary(photos, 'worker-portfolio');
        setUploadedWorkPhotoUrls(urls);
        setUploadProgress((prev) => ({ ...prev, workPhotos: 100 }));
      } catch (error) {
        console.error('Work photo upload failed:', error);
        setErrors((prev) => ({
          ...prev,
          workPhotos: isUrdu ? 'تصاویر اپلوڈ نہیں ہو سکیں' : 'Failed to upload work photos',
        }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSelfieChange = async (file: File | null) => {
    setFormData((prev) => ({ ...prev, selfieImage: file }));
    if (errors.selfieImage) setErrors((prev) => ({ ...prev, selfieImage: "" }));

    if (file) {
      setIsUploading(true);
      setUploadProgress((prev) => ({ ...prev, selfie: 0 }));
      try {
        const url = await uploadToCloudinary(file, 'worker-selfie');
        setUploadedSelfieUrl(url);
        setUploadProgress((prev) => ({ ...prev, selfie: 100 }));
      } catch (error) {
        console.error('Selfie upload failed:', error);
        setErrors((prev) => ({
          ...prev,
          selfieImage: isUrdu ? 'سیلفی اپلوڈ نہیں ہو سکی' : 'Failed to upload selfie',
        }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCnicFrontChange = async (file: File | null) => {
    setFormData((prev) => ({ ...prev, cnicFrontImage: file }));
    if (errors.cnicFrontImage) setErrors((prev) => ({ ...prev, cnicFrontImage: "" }));

    if (file) {
      setIsUploading(true);
      setUploadProgress((prev) => ({ ...prev, cnicFront: 0 }));
      try {
        const url = await uploadToCloudinary(file, 'worker-cnic');
        setUploadedCnicFrontUrl(url);
        setUploadProgress((prev) => ({ ...prev, cnicFront: 100 }));
      } catch (error) {
        console.error('CNIC front upload failed:', error);
        setErrors((prev) => ({
          ...prev,
          cnicFrontImage: isUrdu ? 'شناختی کارڈ سامنے کی تصویر اپلوڈ نہیں ہو سکی' : 'Failed to upload CNIC front',
        }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCnicBackChange = async (file: File | null) => {
    setFormData((prev) => ({ ...prev, cnicBackImage: file }));
    if (errors.cnicBackImage) setErrors((prev) => ({ ...prev, cnicBackImage: "" }));

    if (file) {
      setIsUploading(true);
      setUploadProgress((prev) => ({ ...prev, cnicBack: 0 }));
      try {
        const url = await uploadToCloudinary(file, 'worker-cnic');
        setUploadedCnicBackUrl(url);
        setUploadProgress((prev) => ({ ...prev, cnicBack: 100 }));
      } catch (error) {
        console.error('CNIC back upload failed:', error);
        setErrors((prev) => ({
          ...prev,
          cnicBackImage: isUrdu ? 'شناختی کارڈ پیچھے کی تصویر اپلوڈ نہیں ہو سکی' : 'Failed to upload CNIC back',
        }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  // ─── Validation Per Step ───

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    const errMsg = isUrdu
      ? {
          required: "ضروری ہے",
          invalidEmail: "درست ای میل درج کریں",
          fullName: "پہلا اور آخری نام درج کریں",
          invalidPhone: "درست فون نمبر درج کریں",
          weakPassword: "پاسورڈ کم از کم 6 حروف کا ہونا چاہیے",
          passwordMismatch: "پاسورڈ مماثل نہیں ہیں",
          otpInvalid: "6 ہندسوں کا کوڈ درج کریں",
          noServices: "کم از کم ایک سروس منتخب کریں",
          noAddress: "پتہ درج کریں",
          noLocation: "مقام منتخب کریں",
          noCharges: "وزٹ چارجز درج کریں",
          noBio: "اپنے بارے میں لکھیں",
          minPhotos: "کم از کم 2 تصاویر ضروری ہیں",
          noSelfie: "سیلفی ضروری ہے",
          invalidCnic: "درست شناختی کارڈ نمبر درج کریں",
          noCnicFront: "سامنے کی تصویر ضروری ہے",
          noCnicBack: "پیچھے کی تصویر ضروری ہے",
        }
      : {
          required: "This field is required",
          invalidEmail: "Enter a valid email address",
          fullName: "Enter your first and last name",
          invalidPhone: "Enter a valid Pakistani phone number",
          weakPassword: "Password must be at least 6 characters",
          passwordMismatch: "Passwords do not match",
          otpInvalid: "Enter the 6-digit code",
          noServices: "Select at least one service",
          noAddress: "Address is required",
          noLocation: "Select your location",
          noCharges: "Visiting charges are required",
          noBio: "Please write about yourself",
          minPhotos: "Minimum 2 work photos are required",
          noSelfie: "Selfie is required for verification",
          invalidCnic: "Enter a valid CNIC (XXXXX-XXXXXXX-X)",
          noCnicFront: "CNIC front photo is required",
          noCnicBack: "CNIC back photo is required",
        };

    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) {
          newErrors.fullName = errMsg.required;
        } else if (formData.fullName.trim().split(/\s+/).length < 2) {
          newErrors.fullName = errMsg.fullName;
        }
        if (formData.email && !validateEmail(formData.email)) {
          newErrors.email = errMsg.invalidEmail;
        }
        if (!validatePhoneNumber(formData.phoneNumber)) newErrors.phoneNumber = errMsg.invalidPhone;
        const pwdCheck = validatePassword(formData.password);
        if (!pwdCheck.valid) newErrors.password = errMsg.weakPassword;
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = errMsg.passwordMismatch;
        break;
      case 2:
        if (formData.otpCode.length !== 6) newErrors.otpCode = errMsg.otpInvalid;
        break;
      case 3:
        if (formData.selectedServiceIds.length === 0) {
          newErrors.selectedServiceIds = errMsg.noServices;
        }
        break;
      case 4:
        if (!formData.homeAddress.trim()) newErrors.homeAddress = errMsg.noAddress;
        if (!formData.homeLat || !formData.homeLng) newErrors.homeAddress = errMsg.noLocation;
        break;
      case 5:
        if (formData.visitingCharges <= 0) newErrors.visitingCharges = errMsg.noCharges;
        if (!formData.bio.trim()) newErrors.bio = errMsg.noBio;
        break;
      case 6:
        if (formData.workPhotos.length < 2) newErrors.workPhotos = errMsg.minPhotos;
        break;
      case 7:
        if (!formData.selfieImage) newErrors.selfieImage = errMsg.noSelfie;
        break;
      case 8:
        if (!validateCNIC(formData.cnicNumber)) newErrors.cnicNumber = errMsg.invalidCnic;
        if (!formData.cnicFrontImage) newErrors.cnicFrontImage = errMsg.noCnicFront;
        if (!formData.cnicBackImage) newErrors.cnicBackImage = errMsg.noCnicBack;
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Navigation ───

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    try {
      // Ensure all images are uploaded before submitting
      let workPhotoUrls = uploadedWorkPhotoUrls;
      let selfieUrl = uploadedSelfieUrl;
      let cnicFrontUrl = uploadedCnicFrontUrl;
      let cnicBackUrl = uploadedCnicBackUrl;

      // Upload any remaining images that haven't been uploaded yet (fallback)
      if (formData.workPhotos.length > 0 && workPhotoUrls.length === 0) {
        setIsUploading(true);
        workPhotoUrls = await uploadMultipleToCloudinary(formData.workPhotos, 'worker-portfolio');
      }
      if (formData.selfieImage && !selfieUrl) {
        setIsUploading(true);
        selfieUrl = await uploadToCloudinary(formData.selfieImage, 'worker-selfie');
      }
      if (formData.cnicFrontImage && !cnicFrontUrl) {
        setIsUploading(true);
        cnicFrontUrl = await uploadToCloudinary(formData.cnicFrontImage, 'worker-cnic');
      }
      if (formData.cnicBackImage && !cnicBackUrl) {
        setIsUploading(true);
        cnicBackUrl = await uploadToCloudinary(formData.cnicBackImage, 'worker-cnic');
      }

      // Validate all URLs are present
      if (!cnicFrontUrl || !cnicBackUrl) {
        setErrors({
          general: isUrdu
            ? 'شناختی کارڈ کی تصاویر ضروری ہیں'
            : 'CNIC images are required',
        });
        setIsLoading(false);
        return;
      }

      const registrationData = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        cnicNumber: formData.cnicNumber.replace(/\D/g, ""),
        cnicFrontUrl,      // Cloudinary URL
        cnicBackUrl,       // Cloudinary URL
        selfieUrl: selfieUrl || undefined,         // Cloudinary URL
        workPhotosUrls: workPhotoUrls,  // Array of Cloudinary URLs
        homeAddress: formData.homeAddress,
        homeLat: formData.homeLat,
        homeLng: formData.homeLng,
        experienceYears: formData.experienceYears,
        visitingCharges: formData.visitingCharges,
        serviceIds: formData.selectedServiceIds,
      };

      // Register worker profile
      await registerWorker(registrationData);

      // Create authenticated session for immediate dashboard access
      const loginResponse = await login({
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Worker created but login failed");
      }

      // Redirect to worker dashboard
      router.push("/worker/dashboard");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors({
          general: isUrdu
            ? `خرابی: ${error.message}`
            : `Error: ${error.message}`
        });
      } else if (error instanceof Error) {
        setErrors({
          general: isUrdu
            ? `خرابی: ${error.message}`
            : `Error: ${error.message}`
        });
      } else {
        setErrors({
          general: isUrdu
            ? "غلطی ہوئی، دوبارہ کوشش کریں"
            : "An error occurred. Please try again."
        });
      }
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  // ─── UI Labels ───

  const uiLabels = {
    en: {
      next: "Next",
      back: "Back",
      submit: "Submit & Register",
      submitting: "Submitting...",
      step: "Step",
      of: "of",
      alreadyHave: "Already have an account?",
      signIn: "Sign in",
    },
    ur: {
      next: "اگلا",
      back: "واپس",
      submit: "جمع کرائیں اور رجسٹر کریں",
      submitting: "جمع ہو رہا ہے...",
      step: "مرحلہ",
      of: "میں سے",
      alreadyHave: "پہلے سے اکاؤنٹ ہے؟",
      signIn: "لاگ ان کریں",
    },
  };

  const ui = uiLabels[lang];

  return (
    <Card className="w-full max-w-lg p-6 md:p-8 relative">
      {/* Language Toggle */}
      <button
        type="button"
        onClick={() => setLang(lang === "en" ? "ur" : "en")}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-medium text-heading"
      >
        <Globe className="w-4 h-4" />
        {lang === "en" ? "اردو" : "English"}
      </button>

      {/* Header */}
      <div className="text-center mb-6 mt-4">
        <h1 className="text-2xl font-bold text-heading">Mehnati</h1>
        <p className="text-xs text-paragraph mt-1">
          {ui.step} {currentStep} {ui.of} {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        {/* Step indicators - scroll horizontally on small screens */}
        <div className="flex items-center justify-between mb-3 overflow-x-auto gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  currentStep > step
                    ? "bg-green-500 text-white"
                    : currentStep === step
                    ? "bg-tertiary text-white ring-4 ring-tertiary/20"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
              </div>
              {step < TOTAL_STEPS && (
                <div
                  className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                    currentStep > step ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        {/* Current step label */}
        <p className="text-center text-xs font-semibold text-tertiary">
          {STEP_LABELS[lang][currentStep - 1]}
        </p>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <StepBasicInfo
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 2 && (
          <StepOtpVerification
            phoneNumber={formData.phoneNumber}
            otpCode={formData.otpCode}
            onChange={(val) => handleFieldChange("otpCode", val)}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 3 && (
          <StepServiceSelection
            selectedServiceIds={formData.selectedServiceIds}
            onServicesChange={handleServicesChange}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 4 && (
          <StepAddressLocation
            homeAddress={formData.homeAddress}
            homeLat={formData.homeLat}
            homeLng={formData.homeLng}
            onAddressChange={handleAddressChange}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 5 && (
          <StepExperience
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 6 && (
          <StepWorkPhotos
            workPhotos={formData.workPhotos}
            onPhotosChange={handleWorkPhotosChange}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 7 && (
          <StepSelfieVerification
            selfieImage={formData.selfieImage}
            onSelfieChange={handleSelfieChange}
            errors={errors}
            lang={lang}
          />
        )}
        {currentStep === 8 && (
          <StepCnicIdentity
            cnicNumber={formData.cnicNumber}
            cnicFrontImage={formData.cnicFrontImage}
            cnicBackImage={formData.cnicBackImage}
            onCnicNumberChange={(val) => handleFieldChange("cnicNumber", val)}
            onCnicFrontChange={handleCnicFrontChange}
            onCnicBackChange={handleCnicBackChange}
            errors={errors}
            lang={lang}
          />
        )}
      </div>

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg text-sm mt-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-medium">
              {isUrdu ? 'تصاویر اپلوڈ ہو رہی ہیں...' : 'Uploading images...'}
            </span>
          </div>
          {/* Progress bars for each image type */}
          <div className="mt-2 space-y-1">
            {uploadProgress.workPhotos !== undefined && uploadProgress.workPhotos < 100 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-600 w-24">
                  {isUrdu ? 'کام کی تصاویر' : 'Work photos'}
                </span>
                <div className="flex-1 bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress.workPhotos}%` }}
                  />
                </div>
                <span className="text-blue-600">{uploadProgress.workPhotos}%</span>
              </div>
            )}
            {uploadProgress.selfie !== undefined && uploadProgress.selfie < 100 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-600 w-24">
                  {isUrdu ? 'سیلفی' : 'Selfie'}
                </span>
                <div className="flex-1 bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress.selfie}%` }}
                  />
                </div>
                <span className="text-blue-600">{uploadProgress.selfie}%</span>
              </div>
            )}
            {uploadProgress.cnicFront !== undefined && uploadProgress.cnicFront < 100 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-600 w-24">
                  {isUrdu ? 'شناختی کارڈ (آگے)' : 'CNIC Front'}
                </span>
                <div className="flex-1 bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress.cnicFront}%` }}
                  />
                </div>
                <span className="text-blue-600">{uploadProgress.cnicFront}%</span>
              </div>
            )}
            {uploadProgress.cnicBack !== undefined && uploadProgress.cnicBack < 100 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-600 w-24">
                  {isUrdu ? 'شناختی کارڈ (پیچھے)' : 'CNIC Back'}
                </span>
                <div className="flex-1 bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress.cnicBack}%` }}
                  />
                </div>
                <span className="text-blue-600">{uploadProgress.cnicBack}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Success Indicators */}
      {!isUploading && (
        <div className="space-y-1 mt-4">
          {uploadedWorkPhotoUrls.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {isUrdu ? `${uploadedWorkPhotoUrls.length} کام کی تصاویر اپلوڈ ہو گئیں` : `${uploadedWorkPhotoUrls.length} work photos uploaded`}
              </span>
            </div>
          )}
          {uploadedSelfieUrl && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isUrdu ? 'سیلفی اپلوڈ ہو گئی' : 'Selfie uploaded'}</span>
            </div>
          )}
          {uploadedCnicFrontUrl && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isUrdu ? 'شناختی کارڈ (آگے) اپلوڈ ہو گیا' : 'CNIC front uploaded'}</span>
            </div>
          )}
          {uploadedCnicBackUrl && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isUrdu ? 'شناختی کارڈ (پیچھے) اپلوڈ ہو گیا' : 'CNIC back uploaded'}</span>
            </div>
          )}
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
          {errors.general}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-border">
        {currentStep > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack} size="md">
            <ArrowLeft className="w-4 h-4" />
            {ui.back}
          </Button>
        ) : (
          <div />
        )}

        {currentStep < TOTAL_STEPS ? (
          <Button type="button" variant="tertiary" onClick={handleNext} size="md">
            {ui.next}
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="tertiary"
            onClick={handleSubmit}
            size="md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {ui.submitting}
              </>
            ) : (
              ui.submit
            )}
          </Button>
        )}
      </div>

      {/* Sign In Link */}
      <p className="text-center text-sm text-paragraph mt-4">
        {ui.alreadyHave}{" "}
        <Link href="/auth/login" className="text-tertiary hover:underline font-medium">
          {ui.signIn}
        </Link>
      </p>
    </Card>
  );
}
