"use client";

import { useEffect, useRef } from "react";
import { socketClient } from "@/lib/socket";

/**
 * Worker-side: watch GPS and broadcast position for an active booking.
 *
 * Throttled to one emit per MIN_EMIT_INTERVAL_MS, and skipped entirely when the
 * worker hasn't meaningfully moved — so a parked worker doesn't spam the socket.
 */
export function useLocationBroadcast(
  bookingId: string | null,
  enabled: boolean
) {
  const lastEmit = useRef<{ time: number; lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!enabled || !bookingId) return;
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    const MIN_EMIT_INTERVAL_MS = 5000;
    const MIN_MOVE_DEGREES = 0.00005; // roughly 5 metres

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading, speed } = pos.coords;
        const now = Date.now();
        const prev = lastEmit.current;

        if (prev) {
          const movedEnough =
            Math.abs(latitude - prev.lat) > MIN_MOVE_DEGREES ||
            Math.abs(longitude - prev.lng) > MIN_MOVE_DEGREES;

          if (!movedEnough && now - prev.time < MIN_EMIT_INTERVAL_MS) return;
        }

        lastEmit.current = { time: now, lat: latitude, lng: longitude };

        socketClient.updateLocation(
          bookingId,
          latitude,
          longitude,
          heading ?? undefined,
          speed ?? undefined
        );
      },
      (err) => console.warn("Location broadcast error:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      lastEmit.current = null;
    };
  }, [bookingId, enabled]);
}
