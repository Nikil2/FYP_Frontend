"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { getBookingHistory } from "@/lib/mock-bookings";

function BookingHistory() {
  const bookings = useMemo(() => getBookingHistory(), []);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(
    bookings.length > 0 ? bookings[0].id : null
  );

  const currentBooking = bookings.find((b) => b.id === selectedBooking);

  /* ==================== EMPTY STATE ==================== */
  if (bookings.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h2 className="mb-2 text-xl font-bold text-heading">No Booking History</h2>
          <p className="text-paragraph">You haven't completed any bookings yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==================== PAGE HEADER ==================== */}
      <div>
        <h1 className="mb-1 text-3xl font-bold text-heading">Booking History</h1>
        <p className="text-paragraph">
          View your past bookings and reviews
        </p>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ==================== HISTORY LIST ==================== */}
        <div className="max-h-[300px] space-y-2 overflow-y-auto lg:col-span-1 lg:max-h-none">
          {bookings.map((booking) => (
            <button
              key={booking.id}
              onClick={() => setSelectedBooking(booking.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selectedBooking === booking.id
                  ? "border-tertiary bg-tertiary/5"
                  : "border-border hover:border-tertiary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar
                  src={booking.worker.profileImage}
                  alt={booking.worker.name}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-heading">
                    {booking.worker.name}
                  </h3>
                  <p className="truncate text-xs text-paragraph">
                    {booking.serviceName}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {booking.completedAt ? new Date(booking.completedAt).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ==================== BOOKING DETAILS ==================== */}
        <div className="lg:col-span-2">
          {currentBooking ? (
            <Card className="space-y-6 p-6">
              {/* ==================== WORKER HEADER ==================== */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={currentBooking.worker.profileImage}
                    alt={currentBooking.worker.name}
                    size="lg"
                  />
                  <div>
                    <h2 className="mb-1 text-2xl font-bold text-heading">
                      {currentBooking.worker.name}
                    </h2>
                    <p className="mb-2 text-paragraph">{currentBooking.worker.category}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-heading">
                        {currentBooking.worker.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({currentBooking.worker.rating > 4.5 ? "Highly Rated" : "Good Rating"})
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="default">{currentBooking.status.replace("-", " ").toUpperCase()}</Badge>
              </div>

              {/* ==================== SERVICE & COST ==================== */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary-background p-4">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Service
                  </p>
                  <p className="text-lg font-semibold text-heading">
                    {currentBooking.serviceName}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Final Cost
                  </p>
                  <p className="text-lg font-semibold text-heading">
                    Rs. {currentBooking.finalCost || currentBooking.estimatedCost}
                  </p>
                </div>
              </div>

              {/* ==================== DATES ==================== */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-secondary-background p-3">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-tertiary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Booking Date</p>
                    <p className="text-sm text-paragraph">
                      {new Date(currentBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {currentBooking.completedAt && (
                  <div className="flex items-center gap-3 rounded-lg bg-secondary-background p-3">
                    <Calendar className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Completed Date</p>
                      <p className="text-sm text-paragraph">
                        {new Date(currentBooking.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================== SERVICE LOCATION ==================== */}
              <div className="space-y-3">
                <h3 className="font-bold text-heading">Service Location</h3>
                <div className="rounded-lg bg-secondary-background p-3">
                  <p className="text-sm text-paragraph">
                    {currentBooking.location.address}
                  </p>
                </div>
              </div>

              {/* ==================== CUSTOMER REVIEW ==================== */}
              {currentBooking.rating ? (
                <div className="space-y-3 rounded-lg bg-secondary-background p-4">
                  <h3 className="font-bold text-heading">Your Review</h3>
                  <div className="mb-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < currentBooking.rating!
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-paragraph">{currentBooking.review}</p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-secondary-background p-4">
                  <p className="mb-3 text-sm text-muted-foreground">
                    You haven't reviewed this booking yet
                  </p>
                  <Button variant="tertiary" size="sm">
                    Leave a Review
                  </Button>
                </div>
              )}

              {/* ==================== ACTION BUTTONS ==================== */}
              <div className="flex gap-3 border-t border-border pt-4">
                <Button className="flex-1" variant="secondary" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Worker
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Book Again
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
