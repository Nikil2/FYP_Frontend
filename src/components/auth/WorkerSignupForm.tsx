"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  signupWorker,
  validatePhoneNumber,
  validatePassword,
  validateCNIC,
} from "@/lib/auth";
import { WorkerSignupFormData } from "@/interfaces/auth-interfaces";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
  Upload,
  Loader2,
  CreditCard,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function WorkerSignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkerSignupFormData>({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    cnicNumber: "",
    cnicFrontImage: null,
    cnicBackImage: null,
    bio: "",
    experienceYears: 0,
    visitingCharges: 0,
    homeAddress: "",
    homeLat: 0,
    homeLng: 0,
    selectedServices: [],
  });
  const [profilePicture, setProfilePicture] = useState<File | undefined>();
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<string>("");
  const [cnicFrontPreview, setCnicFrontPreview] = useState<string>("");
  const [cnicBackPreview, setCnicBackPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock services data (replace with API call)
  const availableServices = [
    { id: 1, name: "Electrician" },
    { id: 2, name: "Plumber" },
    { id: 3, name: "Carpenter" },
    { id: 4, name: "Painter" },
    { id: 5, name: "AC Technician" },
    { id: 6, name: "Mechanic" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCnicFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, cnicFrontImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnicFrontPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCnicBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, cnicBackImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnicBackPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceToggle = (serviceId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid Pakistani phone number";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message || "Invalid password";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateCNIC(formData.cnicNumber)) {
      newErrors.cnicNumber = "Please enter a valid CNIC (XXXXX-XXXXXXX-X)";
    }

    if (!formData.cnicFrontImage) {
      newErrors.cnicFrontImage = "CNIC front image is required";
    }

    if (!formData.cnicBackImage) {
      newErrors.cnicBackImage = "CNIC back image is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (formData.experienceYears < 0) {
      newErrors.experienceYears = "Experience years cannot be negative";
    }

    if (formData.visitingCharges <= 0) {
      newErrors.visitingCharges = "Visiting charges must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.homeAddress.trim()) {
      newErrors.homeAddress = "Home address is required";
    }

    if (formData.selectedServices.length === 0) {
      newErrors.selectedServices = "Please select at least one service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupData: WorkerSignupFormData = {
        ...formData,
        profilePicture,
      };

      const response = await signupWorker(signupData);

      if (response.success) {
        router.push("/worker/dashboard");
      } else {
        setErrors({
          general: response.message || "Signup failed. Please try again.",
        });
      }
    } catch (err) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-heading mb-2">
          Become a Mehnati Worker
        </h1>
        <p className="text-paragraph">Complete the steps to start earning</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1 ">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step
                  ? "bg-tertiary text-white"
                  : "bg-secondary-background text-paragraph"
              }`}
            >
              {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? "bg-tertiary" : "bg-secondary-background"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-heading mb-4">
              Basic Information
            </h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profilePicturePreview ? (
                  <img
                    src={profilePicturePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-tertiary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-secondary-background flex items-center justify-center border-2 border-border">
                    <User className="w-12 h-12 text-paragraph" />
                  </div>
                )}
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-tertiary text-white p-2 rounded-full cursor-pointer hover:bg-tertiary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-heading"
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-heading"
              >
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-heading"
              >
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paragraph hover:text-heading"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-heading"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paragraph hover:text-heading"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-heading mb-4">
              Professional Details
            </h2>

            {/* CNIC Number */}
            <div className="space-y-2">
              <label
                htmlFor="cnicNumber"
                className="text-sm font-medium text-heading"
              >
                CNIC Number *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                <input
                  type="text"
                  id="cnicNumber"
                  name="cnicNumber"
                  value={formData.cnicNumber}
                  onChange={handleChange}
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
              </div>
              {errors.cnicNumber && (
                <p className="text-red-500 text-sm">{errors.cnicNumber}</p>
              )}
            </div>

            {/* CNIC Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CNIC Front */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">
                  CNIC Front *
                </label>
                <label
                  htmlFor="cnicFront"
                  className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-tertiary transition-colors"
                >
                  {cnicFrontPreview ? (
                    <img
                      src={cnicFrontPreview}
                      alt="CNIC front"
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-paragraph mb-2" />
                      <span className="text-sm text-paragraph">
                        Upload CNIC Front
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="cnicFront"
                    accept="image/*"
                    onChange={handleCnicFrontChange}
                    className="hidden"
                    required
                  />
                </label>
                {errors.cnicFrontImage && (
                  <p className="text-red-500 text-sm">
                    {errors.cnicFrontImage}
                  </p>
                )}
              </div>

              {/* CNIC Back */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading">
                  CNIC Back *
                </label>
                <label
                  htmlFor="cnicBack"
                  className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-tertiary transition-colors"
                >
                  {cnicBackPreview ? (
                    <img
                      src={cnicBackPreview}
                      alt="CNIC back"
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-paragraph mb-2" />
                      <span className="text-sm text-paragraph">
                        Upload CNIC Back
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="cnicBack"
                    accept="image/*"
                    onChange={handleCnicBackChange}
                    className="hidden"
                    required
                  />
                </label>
                {errors.cnicBackImage && (
                  <p className="text-red-500 text-sm">{errors.cnicBackImage}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-heading">
                Bio *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-paragraph w-5 h-5" />
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your skills and experience..."
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
              </div>
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio}</p>
              )}
            </div>

            {/* Experience & Charges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="experienceYears"
                  className="text-sm font-medium text-heading"
                >
                  Years of Experience *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                  <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                    required
                  />
                </div>
                {errors.experienceYears && (
                  <p className="text-red-500 text-sm">
                    {errors.experienceYears}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="visitingCharges"
                  className="text-sm font-medium text-heading"
                >
                  Visiting Charges (PKR) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                  <input
                    type="number"
                    id="visitingCharges"
                    name="visitingCharges"
                    value={formData.visitingCharges}
                    onChange={handleChange}
                    min="1"
                    placeholder="500"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                    required
                  />
                </div>
                {errors.visitingCharges && (
                  <p className="text-red-500 text-sm">
                    {errors.visitingCharges}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location & Services */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-heading mb-4">
              Location & Services
            </h2>

            {/* Home Address */}
            <div className="space-y-2">
              <label
                htmlFor="homeAddress"
                className="text-sm font-medium text-heading"
              >
                Home Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
                <input
                  type="text"
                  id="homeAddress"
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleChange}
                  placeholder="Enter your home address"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  required
                />
              </div>
              {errors.homeAddress && (
                <p className="text-red-500 text-sm">{errors.homeAddress}</p>
              )}
              <p className="text-xs text-paragraph">
                Note: For now, coordinates will be set automatically. Map
                integration coming soon!
              </p>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Select Services *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceToggle(service.id)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                      formData.selectedServices.includes(service.id)
                        ? "border-tertiary bg-tertiary/10 text-tertiary"
                        : "border-border text-paragraph hover:border-tertiary/50"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
              {errors.selectedServices && (
                <p className="text-red-500 text-sm">
                  {errors.selectedServices}
                </p>
              )}
            </div>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button type="button" onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Worker Account"
              )}
            </Button>
          )}
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-paragraph">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-tertiary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}
