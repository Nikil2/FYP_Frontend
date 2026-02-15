"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, ClipboardList, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { MOCK_BOOKINGS } from "@/lib/mock-bookings";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "CB-XXXX";
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find booking in array
    const foundBooking = MOCK_BOOKINGS.find((b) => b.id === bookingId);
    if (!foundBooking) {
      // Try to load from localStorage
      const stored = JSON.parse(localStorage.getItem("user_bookings") || "[]");
      const storedBooking = stored.find((b: any) => b.id === bookingId);
      setBooking(storedBooking || null);
    } else {
      setBooking(foundBooking);
    }
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full" />
      </div>
    );
  }

  const worker = booking?.worker;
  const serviceName = booking?.serviceName || "Service";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Success Animation Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-16">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-tertiary/10 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-14 h-14 text-tertiary" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-heading mb-2 text-center">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
          Your booking has been submitted successfully.
          {worker && ` ${worker.name} will handle your service.`}
        </p>

        {/* Booking Details Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4 space-y-3 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Booking ID</span>
            <span className="text-sm font-semibold text-heading">
              {bookingId}
            </span>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Service</span>
            <span className="text-sm font-medium text-heading">
              {serviceName}
            </span>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Pending Confirmation
            </span>
          </div>

          {/* Booking Details - NEW */}
          {booking && (
            <>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Date & Time</span>
                <span className="text-sm font-medium text-heading">
                  {booking.scheduledDate} at {booking.scheduledTime}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Cost</span>
                <span className="text-sm font-semibold text-tertiary">
                  Rs {booking.estimatedCost}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Assigned Worker Card - NEW */}
        {worker && (
          <div className="w-full max-w-sm mt-6 bg-white rounded-xl border-2 border-tertiary/30 p-4">
            <h3 className="text-sm font-semibold text-heading mb-3">
              Assigned Worker
            </h3>
            <div className="flex items-center gap-3">
              {worker.profileImage ? (
                <img
                  src={worker.profileImage}
                  alt={worker.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span className="font-semibold text-tertiary">
                    {worker.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-heading">{worker.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-heading">
                    {worker.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {worker.category}
                  </span>
                </div>
              </div>
              {worker.isOnline && (
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="w-full max-w-sm mt-6">
          <h3 className="text-sm font-semibold text-heading mb-3">
            What happens next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-tertiary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-xs text-muted-foreground">
                {worker
                  ? `${worker.name} will review your booking request`
                  : "A nearby verified worker will review your booking request"}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-tertiary/60 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-xs text-muted-foreground">
                You&apos;ll receive a notification once the worker confirms
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-tertiary/30 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-xs text-muted-foreground">
                Track the worker&apos;s arrival in real-time on the day of service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 md:p-6 space-y-3 border-t border-border pb-24 md:pb-8 max-w-md mx-auto w-full">
        <Button
          className="w-full"
          variant="tertiary"
          onClick={() => router.push("/customer/orders")}
        >
          <ClipboardList className="w-4 h-4" />
          View My Orders
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push("/customer")}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full" />
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
