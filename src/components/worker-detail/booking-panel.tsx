"use client";

import React, { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { MapPin, MessageCircle } from "lucide-react";
import type {
  WorkerDetail,
  BookingFormData,
  BookingStatus,
} from "@/types/worker";

// Time slots configuration - Easy to maintain and update
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const TIME_SLOT_LABELS: Record<string, string> = {
  "08:00": "08:00 AM",
  "09:00": "09:00 AM",
  "10:00": "10:00 AM",
  "11:00": "11:00 AM",
  "12:00": "12:00 PM",
  "14:00": "02:00 PM",
  "15:00": "03:00 PM",
  "16:00": "04:00 PM",
  "17:00": "05:00 PM",
  "18:00": "06:00 PM",
};

// Default static location for all bookings
const DEFAULT_LOCATION = {
  address: "Karachi, Pakistan",
  lat: 24.8607,
  lng: 67.0011,
};

interface BookingPanelProps {
  worker: WorkerDetail;
  onChatClick: () => void;
  staticLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
}

export function BookingPanel({
  worker,
  onChatClick,
  staticLocation = DEFAULT_LOCATION,
}: BookingPanelProps) {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: "",
    date: null,
    timeSlot: "",
    address: "",
    jobDescription: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    // Handle invalid date values gracefully
    if (!dateValue) {
      setFormData((prev) => ({
        ...prev,
        date: null,
      }));
      return;
    }

    const date = new Date(dateValue);
    // Validate that the date was parsed correctly
    if (!isNaN(date.getTime())) {
      setFormData((prev) => ({
        ...prev,
        date,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.serviceId ||
      !formData.date ||
      !formData.timeSlot ||
      !formData.address ||
      !formData.jobDescription
    ) {
      alert("Please fill all fields");
      return;
    }

    setBookingStatus("booking-submitted");

    setTimeout(() => {
      setBookingStatus("worker-en-route");
    }, 3000);
  };

  const handleNewBooking = () => {
    setBookingStatus("idle");
    setFormData({
      serviceId: "",
      date: null,
      timeSlot: "",
      address: "",
      jobDescription: "",
    });
  };

  // Format date safely for input field
  const getFormattedDateValue = () => {
    if (!formData.date) return "";
    try {
      return formData.date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <Card className="p-6 space-y-6 md:sticky md:top-24 md:max-h-[calc(100vh-150px)] md:overflow-y-auto">
      {bookingStatus === "idle" ? (
        <>
          {/* Visiting Fee */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              Visiting Fee
            </p>
            <p className="text-4xl font-bold text-tertiary">
              Rs. {worker.visitingFee.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Additional charges may apply based on service
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Service Type *
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-white text-heading focus:outline-none focus:ring-2 focus:ring-tertiary"
              >
                <option value="">Select a service</option>
                {worker.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - Rs. {service.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">Date *</label>
              <input
                type="date"
                name="date"
                value={getFormattedDateValue()}
                onChange={handleDateChange}
                min={getMinDate()}
                className="w-full px-4 py-3 border border-border rounded-lg bg-white text-heading focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Time Slot - Dynamic from configuration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Time Slot *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-white text-heading focus:outline-none focus:ring-2 focus:ring-tertiary"
              >
                <option value="">Select a time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {TIME_SLOT_LABELS[slot]}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Address *
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-white text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Job Description *
              </label>
              <textarea
                name="jobDescription"
                placeholder="Describe the work you need done"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg bg-white text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
              />
            </div>

            {/* Book Now Button */}
            <Button
              type="submit"
              variant="tertiary"
              size="lg"
              className="w-full"
            >
              Book Now
            </Button>
          </form>

          {/* Message Provider Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={onChatClick}
          >
            <MessageCircle className="w-5 h-5" />
            Message Provider
          </Button>
        </>
      ) : (
        <>
          {/* Booking Confirmation State */}
          <div className="space-y-4 text-center py-4">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-heading">
                {bookingStatus === "booking-submitted"
                  ? "Booking Confirmed!"
                  : "Worker On The Way"}
              </h3>

              <p className="text-paragraph text-sm">
                {bookingStatus === "booking-submitted"
                  ? "Worker has been notified and will arrive shortly"
                  : "Your worker is on the way to your location"}
              </p>
            </div>

            {/* Tracking Info */}
            <div className="bg-secondary-background rounded-lg p-4 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-tertiary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-heading text-sm">
                    {formData.address}
                  </p>
                  <p className="text-xs text-muted-foreground">Your location</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-tertiary flex-shrink-0" />
                <div>
                  <p className="font-medium text-heading">
                    Estimated arrival: 25 mins
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Embed - Karachi, Pakistan */}
            <div className="w-full h-64 bg-muted rounded-lg overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115919.46625620897!2d67.01165!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890"
                title="Karachi, Pakistan Location Map"
              />
            </div>

            {/* New Booking Button */}
            <Button
              variant="tertiary"
              size="lg"
              className="w-full"
              onClick={handleNewBooking}
            >
              New Booking
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
