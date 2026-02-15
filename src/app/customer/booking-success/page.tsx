"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "CB-XXXX";
  const serviceName = searchParams.get("service") || "Service";

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
          Your booking has been submitted successfully. A worker will be
          assigned shortly.
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
              {decodeURIComponent(serviceName)}
            </span>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Pending Confirmation
            </span>
          </div>
        </div>

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
                A nearby verified worker will review your booking request
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
