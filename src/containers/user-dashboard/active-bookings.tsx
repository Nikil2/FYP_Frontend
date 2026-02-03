"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  MapPin,
  MessageSquare,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";

import { getActiveBookings } from "@/lib/mock-bookings";

function ActiveBookings() {
  const bookings = useMemo(() => getActiveBookings(), []);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(
    bookings.length > 0 ? bookings[0].id : null,
  );

  const currentBooking = bookings.find((b) => b.id === selectedBooking);

  if (bookings.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 opacity-50 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-heading">
            No Active Bookings
          </h2>
          <p className="mb-6 text-paragraph">
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
      {/* ==================== PAGE HEADER ==================== */}
      <div>
        <h1 className="mb-1 text-3xl font-bold text-heading">
          Active Bookings
        </h1>
        <p className="text-paragraph">
          {bookings.length} active booking{bookings.length !== 1 ? "s" : ""}{" "}
          waiting for you
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ==================== BOOKINGS LIST ==================== */}
        <div className="max-h-[300px] overflow-y-auto lg:col-span-1 lg:max-h-none">
          <div className="space-y-2">
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
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-semibold text-heading">
                      {booking.worker.name}
                    </h3>
                    <p className="truncate text-xs text-paragraph">
                      {booking.serviceName}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
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

        {/* ==================== BOOKING DETAILS ==================== */}
        <div className="lg:col-span-2">
          {currentBooking ? (
            <Card className="space-y-6 p-6">
              {/* Worker Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={currentBooking.worker.profileImage}
                    alt={currentBooking.worker.name}
                    size="lg"
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-heading">
                        {currentBooking.worker.name}
                      </h2>
                      {currentBooking.worker.isOnline && (
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      )}
                    </div>
                    <p className="mb-2 text-paragraph">
                      {currentBooking.worker.category}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-heading">
                        {currentBooking.worker.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {currentBooking.worker.rating > 4.5
                          ? "Highly Rated"
                          : "Good Rating"}
                        )
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="tertiary">
                  {currentBooking.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>

              {/* Service & Cost */}
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
                <div className="flex items-center gap-3 rounded-lg bg-secondary-background p-3">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-tertiary" />
                  <p className="text-sm text-paragraph">
                    {currentBooking.scheduledDate}
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-secondary-background p-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-tertiary" />
                  <p className="text-sm text-paragraph">
                    {currentBooking.scheduledTime}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="font-bold text-heading">Service Location</h3>
                <div className="flex items-start gap-3 rounded-lg bg-secondary-background p-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-tertiary" />
                  <p className="text-sm font-medium text-paragraph">
                    {currentBooking.location.address}
                  </p>
                </div>
              </div>

              {/* Job Description */}
              {currentBooking.jobDescription && (
                <div className="space-y-3">
                  <h3 className="font-bold text-heading">Job Description</h3>
                  <div className="rounded-lg bg-secondary-background p-3">
                    <p className="text-sm text-paragraph">
                      {currentBooking.jobDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-border pt-4">
                <Link
                  href={`/dashboard/messages?worker=${currentBooking.workerId}`}
                  className="flex-1"
                >
                  <Button className="w-full" variant="secondary" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Worker
                  </Button>
                </Link>
                <Button className="flex-1" variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
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

export default ActiveBookings;
