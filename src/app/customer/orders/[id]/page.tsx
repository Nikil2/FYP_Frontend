"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Star,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  getCurrentCustomer,
  type CustomerBooking,
} from "@/app/dummy/dummy-customers";

function getStatusConfig(status: CustomerBooking["status"]) {
  switch (status) {
    case "pending":
      return {
        label: "Pending Confirmation",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: AlertCircle,
        description: "Waiting for worker to confirm your booking",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: CheckCircle2,
        description: "Worker has accepted. They will arrive at scheduled time",
      };
    case "in-progress":
      return {
        label: "In Progress",
        color: "text-tertiary",
        bg: "bg-tertiary/5",
        border: "border-tertiary/20",
        icon: Clock,
        description: "Worker is currently working on your service",
      };
    case "completed":
      return {
        label: "Completed",
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: CheckCircle2,
        description: "This service has been completed",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: XCircle,
        description: "This booking was cancelled",
      };
    default:
      return {
        label: status,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
        icon: AlertCircle,
        description: "",
      };
  }
}

// Status timeline steps
function StatusTimeline({ status }: { status: CustomerBooking["status"] }) {
  const steps = [
    { key: "pending", label: "Booking Placed" },
    { key: "confirmed", label: "Worker Confirmed" },
    { key: "in-progress", label: "Work Started" },
    { key: "completed", label: "Completed" },
  ];

  const statusOrder = ["pending", "confirmed", "in-progress", "completed"];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = !isCancelled && index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;

        return (
          <div key={step.key} className="flex items-start gap-3">
            {/* Dot + Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  isCompleted
                    ? "bg-tertiary border-tertiary"
                    : isCancelled && index === 0
                    ? "bg-red-500 border-red-500"
                    : "bg-white border-gray-300"
                )}
              >
                {isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8",
                    isCompleted && index < currentIndex
                      ? "bg-tertiary"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
            {/* Label */}
            <div className="pb-6">
              <p
                className={cn(
                  "text-xs font-medium",
                  isCurrent
                    ? "text-tertiary"
                    : isCompleted
                    ? "text-heading"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 text-[10px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}

      {isCancelled && (
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-500 flex items-center justify-center">
              <XCircle className="w-3 h-3 text-white" />
            </div>
          </div>
          <p className="text-xs font-medium text-red-600">Cancelled</p>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const customer = getCurrentCustomer();
    if (customer) {
      const allBookings = [
        ...customer.activeBookings,
        ...customer.pastBookings,
      ];
      const found = allBookings.find((b) => b.id === id);
      if (found) setBooking(found);
    }
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Booking not found</p>
          <button
            onClick={() => router.push("/customer/orders")}
            className="mt-3 text-sm text-tertiary font-medium"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const isActive = ["pending", "confirmed", "in-progress"].includes(
    booking.status
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/orders")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors md:hidden"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-heading">
            Order Details
          </h1>
          <p className="text-[10px] text-muted-foreground">{booking.id}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Banner */}
        <div
          className={cn(
            "rounded-xl p-4 border",
            statusConfig.bg,
            statusConfig.border
          )}
        >
          <div className="flex items-center gap-3">
            <StatusIcon className={cn("w-8 h-8", statusConfig.color)} />
            <div>
              <h2
                className={cn("text-sm font-bold", statusConfig.color)}
              >
                {statusConfig.label}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {statusConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-4">
            Order Timeline
          </h3>
          <StatusTimeline status={booking.status} />
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-3">
            Service Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Service</span>
              <span className="text-sm font-medium text-heading">
                {booking.serviceName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Category</span>
              <span className="text-xs text-muted-foreground">
                {booking.categoryName}
              </span>
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Price</span>
              <span className="text-base font-bold text-heading">
                Rs. {booking.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-3">
            Schedule & Location
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-tertiary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-heading">
                  {new Date(booking.scheduledDate).toLocaleDateString("en-PK", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-tertiary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-heading">
                  {booking.scheduledTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-tertiary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-heading">
                  {booking.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-2">
            Work Description
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {booking.description}
          </p>
        </div>

        {/* Worker Info */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-3">
            Assigned Worker
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-tertiary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-heading">
                {booking.workerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {booking.workerCategory}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-muted-foreground">
                  {booking.workerRating} rating
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isActive && (
            <div className="flex gap-2 mt-4">
              <a
                href={`tel:${booking.workerPhone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-tertiary/10 text-tertiary rounded-lg text-xs font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                <MessageCircle className="w-3.5 h-3.5" />
                Message
              </button>
            </div>
          )}
        </div>

        {/* Cancel Reason (if cancelled) */}
        {booking.status === "cancelled" && booking.cancelReason && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <h3 className="text-sm font-semibold text-red-700 mb-1">
              Cancellation Reason
            </h3>
            <p className="text-xs text-red-600">{booking.cancelReason}</p>
          </div>
        )}

        {/* Review (if completed and rated) */}
        {booking.status === "completed" && booking.rating && (
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-heading mb-2">
              Your Review
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < booking.rating!
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200"
                  )}
                />
              ))}
            </div>
            {booking.review && (
              <p className="text-xs text-muted-foreground">
                {booking.review}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {isActive && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border p-4">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowCancelModal(true)}
            >
              <Ban className="w-4 h-4" />
              Cancel Booking
            </Button>
            <Button variant="tertiary" size="sm" className="flex-1">
              <MessageCircle className="w-4 h-4" />
              Chat with Worker
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 animate-slide-in-right">
            <h3 className="text-lg font-bold text-heading mb-2">
              Cancel Booking?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Booking
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setShowCancelModal(false);
                  router.push("/customer/orders");
                }}
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
