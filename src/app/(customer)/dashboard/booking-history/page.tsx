"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { getBookingHistory } from "@/lib/mock-bookings";

export default function BookingHistoryPage() {
  const bookings = useMemo(() => getBookingHistory(), []);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(
    bookings.length > 0 ? bookings[0].id : null
  );

  const currentBooking = bookings.find((b) => b.id === selectedBooking);

  if (bookings.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-heading mb-2">No Booking History</h2>
          <p className="text-paragraph">You haven't completed any bookings yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Booking History</h1>
        <p className="text-paragraph">
          View your past bookings and reviews
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History List */}
        <div className="lg:col-span-1 space-y-2">
          {bookings.map((booking) => (
            <button
              key={booking.id}
              onClick={() => setSelectedBooking(booking.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
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
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-heading truncate">
                    {booking.worker.name}
                  </h3>
                  <p className="text-xs text-paragraph truncate">
                    {booking.serviceName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {booking.completedAt ? new Date(booking.completedAt).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Booking Details */}
        <div className="lg:col-span-2">
          {currentBooking ? (
            <Card className="p-6 space-y-6">
              {/* Worker Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={currentBooking.worker.profileImage}
                    alt={currentBooking.worker.name}
                    size="lg"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-heading mb-1">
                      {currentBooking.worker.name}
                    </h2>
                    <p className="text-paragraph mb-2">{currentBooking.worker.category}</p>
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

              {/* Service & Cost */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary-background rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Service
                  </p>
                  <p className="text-lg font-semibold text-heading">
                    {currentBooking.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Final Cost
                  </p>
                  <p className="text-lg font-semibold text-heading">
                    Rs. {currentBooking.finalCost || currentBooking.estimatedCost}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-secondary-background rounded-lg">
                  <Calendar className="w-5 h-5 text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Booking Date</p>
                    <p className="text-sm text-paragraph">
                      {new Date(currentBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {currentBooking.completedAt && (
                  <div className="flex items-center gap-3 p-3 bg-secondary-background rounded-lg">
                    <Calendar className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Completed Date</p>
                      <p className="text-sm text-paragraph">
                        {new Date(currentBooking.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Location */}
              <div className="space-y-3">
                <h3 className="font-bold text-heading">Service Location</h3>
                <div className="p-3 bg-secondary-background rounded-lg">
                  <p className="text-sm text-paragraph">
                    {currentBooking.location.address}
                  </p>
                </div>
              </div>

              {/* Customer Review */}
              {currentBooking.rating ? (
                <div className="space-y-3 p-4 bg-secondary-background rounded-lg">
                  <h3 className="font-bold text-heading">Your Review</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < currentBooking.rating!
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-paragraph">{currentBooking.review}</p>
                </div>
              ) : (
                <div className="p-4 bg-secondary-background rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    You haven't reviewed this booking yet
                  </p>
                  <Button variant="tertiary" size="sm">
                    Leave a Review
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="flex-1" variant="secondary" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
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
