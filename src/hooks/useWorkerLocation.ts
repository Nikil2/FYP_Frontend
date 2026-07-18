"use client";

import { useEffect, useState } from "react";
import { socketClient } from "@/lib/socket";

export interface WorkerLocation {
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  updatedAt: string;
}

/**
 * Customer-side: subscribe to the assigned worker's live position for a booking.
 * Assumes the caller has already joined the booking room via
 * `socketClient.joinBooking(bookingId)`.
 */
export function useWorkerLocation(bookingId: string | null) {
  const [location, setLocation] = useState<WorkerLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const unsubscribe = socketClient.onWorkerLocation((data) => {
      if (data.bookingId !== bookingId) return;

      if (data.stopped) {
        setIsTracking(false);
        setLocation(null);
        return;
      }

      setLocation({
        lat: data.lat,
        lng: data.lng,
        heading: data.heading,
        speed: data.speed,
        updatedAt: data.updatedAt,
      });
      setIsTracking(true);
    });

    return unsubscribe;
  }, [bookingId]);

  return { location, isTracking };
}
