"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, ClipboardList, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { MOCK_BOOKINGS } from "@/lib/mock-bookings";

import { getBookingById } from "@/api/services/bookings";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "";
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error("Failed to load booking success details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full" />
      </div>
    );
  }

  const worker = booking?.worker;
  const serviceName = booking?.service?.name || "Service";
  const workerName = worker?.user?.fullName || "";
  const workerRating = worker?.averageRating || 5.0;
  const workerPic = worker?.user?.profilePicUrl;
  const workerCategory = worker?.services && worker.services.length > 0 && worker.services[0].service
    ? worker.services[0].service.name
    : "Provider";

  let dateStr = "Not scheduled";
  if (booking?.scheduledAt) {
    const d = new Date(booking.scheduledAt);
    dateStr = d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }) + " at " + d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  }

  const cost = booking?.finalPrice ? `Rs ${Number(booking.finalPrice).toLocaleString()}` : "Variable";

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
          {workerName && ` ${workerName} will handle your service.`}
        </p>

        {/* Booking Details Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4 space-y-3 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Booking ID</span>
            <span className="text-xs font-semibold text-heading truncate max-w-[200px]">
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

          {/* Booking Details */}
          {booking && (
            <>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Date & Time</span>
                <span className="text-sm font-medium text-heading text-right">
                  {dateStr}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Price Estimate</span>
                <span className="text-sm font-semibold text-tertiary">
                  {cost}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Assigned Worker Card */}
        {worker && (
          <div className="w-full max-w-sm mt-6 bg-white rounded-xl border-2 border-tertiary/30 p-4">
            <h3 className="text-sm font-semibold text-heading mb-3">
              Assigned Worker
            </h3>
            <div className="flex items-center gap-3">
              {workerPic ? (
                <img
                  src={workerPic}
                  alt={workerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span className="font-semibold text-tertiary">
                    {workerName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-heading">{workerName}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-heading">
                    {workerRating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {workerCategory}
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
