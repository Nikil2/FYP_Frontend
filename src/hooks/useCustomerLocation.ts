"use client";

import { useCallback, useEffect, useState } from "react";

export type LocationStatus =
  | "detecting"
  | "granted"
  | "denied"
  | "unsupported";

export interface CustomerCoords {
  lat: number;
  lng: number;
}

/**
 * Customer's current position, used to find nearby workers.
 *
 * Requests once on mount so the common "allow" path is seamless, but exposes
 * `request` so the UI can offer an explicit retry — a silent failure would
 * leave the customer with no idea the nearby feature exists.
 *
 * Coordinates are held in memory only; they're search input, not profile data.
 */
export function useCustomerLocation(enabled: boolean = true) {
  const [status, setStatus] = useState<LocationStatus>("detecting");
  const [coords, setCoords] = useState<CustomerCoords | null>(null);
  const [areaName, setAreaName] = useState<string | null>(null);

  /**
   * Turn coordinates into a short area name ("Clifton, Karachi") so the customer
   * can see where we think they are and sanity-check it. Best-effort: a failure
   * here must never block the search, which only needs the raw coordinates.
   */
  const resolveAreaName = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`,
      );
      const data = await res.json();
      const a = data?.address ?? {};

      const locality =
        a.suburb || a.neighbourhood || a.village || a.town || a.city_district;
      const city = a.city || a.town || a.state_district;

      const label = [locality, city].filter(Boolean).join(", ");
      setAreaName(label || null);
    } catch {
      setAreaName(null);
    }
  }, []);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    setStatus("detecting");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(next);
        setStatus("granted");
        void resolveAreaName(next.lat, next.lng);
      },
      () => {
        setCoords(null);
        setAreaName(null);
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [resolveAreaName]);

  useEffect(() => {
    if (!enabled) return;
    request();
  }, [enabled, request]);

  return { status, coords, areaName, request };
}
