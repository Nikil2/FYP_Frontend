"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Upload,
  X,
  ChevronDown,
  LocateFixed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIME_SLOTS, REFERRAL_SOURCES } from "@/lib/customer-data";
import { getWorkerDetails } from "@/api/services/workers";
import { createBooking } from "@/api/services/bookings";

interface BookingFormProps {
  serviceId: string;
  serviceName: string;
  workerId?: string;
}

export function BookingForm({ serviceId, serviceName, workerId }: BookingFormProps) {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loadingWorker, setLoadingWorker] = useState(false);

  useEffect(() => {
    if (workerId) {
      setLoadingWorker(true);
      getWorkerDetails(workerId)
        .then((w: any) => {
          setWorker({
            id: w.workerId || w.id,
            name: w.fullName,
            category: w.services && w.services.length > 0 ? w.services[0].name : "Worker",
            rating: w.averageRating || 5.0,
            profileImage: w.profilePicUrl,
            visitingCharges: w.visitingCharges || 1000,
          });
        })
        .catch((err) => {
          console.error("Failed to load worker details:", err);
        })
        .finally(() => {
          setLoadingWorker(false);
        });
    }
  }, [workerId]);

  const [formData, setFormData] = useState({
    location: "",
    serviceDate: "",
    serviceTime: "",
    workDescription: "",
    referralSource: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.serviceDate) {
      newErrors.serviceDate = "Service date is required";
    }
    if (!formData.serviceTime) {
      newErrors.serviceTime = "Service time is required";
    }
    if (!formData.workDescription.trim()) {
      newErrors.workDescription = "Work description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTimeTo24h = (timeStr: string): string => {
    if (!timeStr) return "12:00";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !workerId) return;

    setSubmitting(true);

    try {
      const time24h = formatTimeTo24h(formData.serviceTime);
      const scheduledAt = new Date(`${formData.serviceDate}T${time24h}:00`).toISOString();
      const initialPrice = worker ? Number(worker.visitingCharges) : 1000;

      // Create booking via backend API client
      const booking = await createBooking({
        workerId,
        serviceId: parseInt(serviceId),
        description: formData.workDescription,
        jobAddress: formData.location,
        jobLat: 24.8607,
        jobLng: 67.0011,
        scheduledAt,
        initialPrice,
      });

      // Redirect to success page
      router.push(`/customer/booking-success?id=${booking.id}`);
    } catch (err: any) {
      console.error("Booking creation failed:", err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "Failed to create booking. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-tertiary">Add Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 max-w-2xl">
        {errors.submit && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100">
            {errors.submit}
          </div>
        )}
        {/* Service Name (readonly) */}
        <div>
          <div className="bg-gray-100 rounded-lg px-4 py-3">
            <p className="text-base font-semibold text-heading">
              {serviceName}
            </p>
          </div>
        </div>

        {/* Selected Worker (NEW) */}
        {worker && (
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Assigned Worker
            </label>
            <div className="bg-tertiary/10 rounded-lg px-4 py-3 flex items-center gap-3">
              {worker.profileImage ? (
                <img
                  src={worker.profileImage}
                  alt={worker.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-tertiary">
                    {worker.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-heading">{worker.name}</p>
                <p className="text-xs text-muted-foreground">{worker.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-tertiary">⭐ {worker.rating}</p>
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Select Your Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Select address"
              className="w-full border border-border rounded-lg px-4 py-3 pr-10 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary/40"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location}</p>
          )}
          <button
            type="button"
            className="flex items-center gap-1 mt-2 text-sm text-tertiary hover:text-tertiary-hover transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
            Change Location
          </button>
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Service Date */}
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Service Date<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="serviceDate"
                value={formData.serviceDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-tertiary/40"
              />
            </div>
            {errors.serviceDate && (
              <p className="text-xs text-red-500 mt-1">{errors.serviceDate}</p>
            )}
          </div>

          {/* Service Time */}
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">
              Service Time<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="serviceTime"
                value={formData.serviceTime}
                onChange={handleInputChange}
                className="w-full appearance-none border border-border rounded-lg px-4 py-3 pr-8 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-tertiary/40"
              >
                <option value="">Select Time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.serviceTime && (
              <p className="text-xs text-red-500 mt-1">{errors.serviceTime}</p>
            )}
          </div>
        </div>

        {/* Work Description */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1">
            Work Description<span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-red-500 mb-1.5">
            Do not write your contact number. It is against our company policy
          </p>
          <textarea
            name="workDescription"
            value={formData.workDescription}
            onChange={handleInputChange}
            placeholder="Write work description, your budget, etc.."
            rows={4}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary/40 resize-none"
          />
          {errors.workDescription && (
            <p className="text-xs text-red-500 mt-1">
              {errors.workDescription}
            </p>
          )}
        </div>

        {/* Referral Source */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Where did you get to know about Mehnati? (optional)
          </label>
          <div className="relative">
            <select
              name="referralSource"
              value={formData.referralSource}
              onChange={handleInputChange}
              className="w-full appearance-none border border-border rounded-lg px-4 py-3 pr-8 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-tertiary/40"
            >
              <option value="">Select Platform</option>
              {REFERRAL_SOURCES.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Upload Service Related Images
          </label>
          <div className="border-2 border-dashed border-tertiary/30 rounded-lg p-4">
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <Upload className="w-8 h-8 text-tertiary/50" />
              <span className="text-sm text-muted-foreground">
                Tap to upload images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-border"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancel}
            className="w-full"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="tertiary" 
            size="md" 
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
