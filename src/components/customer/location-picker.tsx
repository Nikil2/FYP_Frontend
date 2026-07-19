"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Check,
  Home,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Star,
  X,
} from "lucide-react";
import { getLocations, type SavedLocation } from "@/api/services/locations";
import { cn } from "@/lib/utils";

const LABEL_ICONS: Record<string, React.ElementType> = {
  Home,
  Work: Briefcase,
  Other: Star,
};

/**
 * The location currently driving the worker search. Either the device's GPS
 * reading, or one of the customer's saved addresses.
 */
export interface ActiveLocation {
  lat: number;
  lng: number;
  /** Display name, e.g. "Clifton, Karachi" or "Home". */
  name: string;
  source: "gps" | "saved";
  savedId?: string;
}

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  active: ActiveLocation | null;
  /** GPS-derived area name, shown on the "current location" row. */
  gpsAreaName?: string | null;
  gpsAvailable: boolean;
  onUseCurrentLocation: () => void;
  onSelectSaved: (location: ActiveLocation) => void;
}

export function LocationPicker({
  open,
  onClose,
  active,
  gpsAreaName,
  gpsAvailable,
  onUseCurrentLocation,
  onSelectSaved,
}: LocationPickerProps) {
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch on open rather than on mount — addresses may have changed since the
  // customer last looked, and this is cheap.
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    getLocations()
      .then((data) => setSaved(Array.isArray(data) ? data : []))
      .catch(() => setSaved([]))
      .finally(() => setLoading(false));
  }, [open]);

  // Don't leave the page scrolling behind the sheet.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const usingGps = active?.source === "gps";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close location picker"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold text-heading">Choose location</h2>
            <p className="text-xs text-muted-foreground">
              We&apos;ll show workers near this address
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4 text-heading" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* Current location */}
          <button
            type="button"
            disabled={!gpsAvailable}
            onClick={() => {
              onUseCurrentLocation();
              onClose();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
              gpsAvailable ? "hover:bg-muted" : "cursor-not-allowed opacity-60",
            )}
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-tertiary/10">
              <Navigation className="h-4 w-4 text-tertiary" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-heading">
                Use my current location
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {!gpsAvailable
                  ? "Location is turned off in your browser"
                  : (gpsAreaName ?? "Detect where I am now")}
              </span>
            </span>
            {usingGps && (
              <Check className="h-4 w-4 flex-shrink-0 text-tertiary" />
            )}
          </button>

          <div className="my-2 border-t border-border" />

          {/* Saved addresses */}
          <p className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
            Saved addresses
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-tertiary" />
            </div>
          ) : saved.length === 0 ? (
            <p className="px-3 py-4 text-xs text-muted-foreground">
              No saved addresses yet. Add one to switch between places quickly.
            </p>
          ) : (
            saved.map((location) => {
              const Icon = LABEL_ICONS[location.label ?? "Other"] ?? MapPin;
              const isActive = active?.savedId === location.id;

              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => {
                    onSelectSaved({
                      lat: location.lat,
                      lng: location.lng,
                      name: location.label || location.address,
                      source: "saved",
                      savedId: location.id,
                    });
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-heading" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-heading">
                      {location.label || "Saved address"}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {location.address}
                    </span>
                  </span>
                  {isActive && (
                    <Check className="h-4 w-4 flex-shrink-0 text-tertiary" />
                  )}
                </button>
              );
            })
          )}

          <Link
            href="/customer/addresses"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-border">
              <Plus className="h-4 w-4 text-heading" />
            </span>
            <span className="text-sm font-medium text-heading">
              Add a new address
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
