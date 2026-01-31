"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageSquare, Phone, Calendar, Clock, AlertCircle } from "lucide-react";
import { getActiveBookings } from "@/lib/mock-bookings";

export default function ActiveBookingsPage() {
  const bookings = useMemo(() => getActiveBookings(), []);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(
    bookings.length > 0 ? bookings[0].id : null
  );

  const currentBooking = bookings.find((b) => b.id === selectedBooking);

  if (bookings.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-heading mb-2">No Active Bookings</h2>
          <p className="text-paragraph mb-6">
            You don't have any active bookings at the moment.
          </p>
          <Link href="/">
            <Button variant="tertiary" size="sm">
              Browse Services
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Active Bookings</h1>
        <p className="text-paragraph">
          {bookings.length} active booking{bookings.length !== 1 ? "s" : ""} waiting for you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
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
                        {booking.scheduledDate}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
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
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-heading">
                        {currentBooking.worker.name}
                      </h2>
                      {currentBooking.worker.isOnline && (
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </div>
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
                <Badge variant="tertiary">{currentBooking.status.replace("-", " ").toUpperCase()}</Badge>
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
                    Estimated Cost
                  </p>
                  <p className="text-lg font-semibold text-heading">
                    Rs. {currentBooking.estimatedCost}
                  </p>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <h3 className="font-bold text-heading">Schedule</h3>
                <div className="flex items-center gap-3 p-3 bg-secondary-background rounded-lg">
                  <Calendar className="w-5 h-5 text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-paragraph">{currentBooking.scheduledDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary-background rounded-lg">
                  <Clock className="w-5 h-5 text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-paragraph">{currentBooking.scheduledTime}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="font-bold text-heading">Service Location</h3>
                <div className="flex items-start gap-3 p-3 bg-secondary-background rounded-lg">
                  <MapPin className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-paragraph font-medium">
                      {currentBooking.location.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              {currentBooking.jobDescription && (
                <div className="space-y-3">
                  <h3 className="font-bold text-heading">Job Description</h3>
                  <div className="p-3 bg-secondary-background rounded-lg">
                    <p className="text-sm text-paragraph">
                      {currentBooking.jobDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link href={`/dashboard/messages?worker=${currentBooking.workerId}`} className="flex-1">
                  <Button className="w-full" variant="secondary" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Worker
                  </Button>
                </Link>
                <Button className="flex-1" variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Worker
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
