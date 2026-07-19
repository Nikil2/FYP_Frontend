"use client";

import Link from "next/link";
import { ChevronLeft, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkerDetail } from "@/types/worker";

type LocationStatus = "detecting" | "granted" | "denied" | "unsupported";

interface WorkerSelectionProps {
  serviceId: string;
  serviceName: string;
  workers: WorkerDetail[];
  locationStatus?: LocationStatus;
  areaName?: string | null;
  radiusKm?: number;
  radiusOptions?: number[];
  onRadiusChange?: (radiusKm: number) => void;
  onEnableLocation?: () => void;
  /** Opens the saved-address picker. Omit to hide the "Change" affordance. */
  onChangeLocation?: () => void;
}

export function WorkerSelection({
  serviceId,
  serviceName,
  workers,
  locationStatus = "denied",
  areaName = null,
  radiusKm = 10,
  radiusOptions = [5, 10, 20, 50],
  onRadiusChange,
  onEnableLocation,
  onChangeLocation,
}: WorkerSelectionProps) {
  const locationEnabled = locationStatus === "granted";
  const header = (
    <div className="sticky top-0 z-10 bg-white border-b border-border">
      <div className="px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <Link
          href="/customer"
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-tertiary">Select Worker</h1>
          {serviceName && (
            <p className="text-xs text-muted-foreground">{serviceName}</p>
          )}
        </div>
      </div>

      {/* Confirm where we think they are — otherwise "3 km away" is unverifiable */}
      {locationEnabled && (
        <div className="px-4 md:px-6 pb-2">
          <button
            type="button"
            onClick={onChangeLocation}
            disabled={!onChangeLocation}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-left transition-colors",
              onChangeLocation && "hover:border-tertiary/50 hover:bg-muted/50",
            )}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-tertiary" />
              <span className="truncate text-xs text-heading">
                Showing workers near{" "}
                <span className="font-semibold">
                  {areaName ?? "your location"}
                </span>
              </span>
            </span>

            {onChangeLocation && (
              <span className="flex-shrink-0 text-xs font-medium text-tertiary">
                Change
              </span>
            )}
          </button>
        </div>
      )}

      {/* Radius filter — only meaningful once we know where the customer is */}
      {locationEnabled && (
        <div className="px-4 md:px-6 pb-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Within
          </span>
          {radiusOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRadiusChange?.(option)}
              className={`text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap transition-colors ${
                radiusKm === option
                  ? "bg-tertiary text-white border-tertiary"
                  : "bg-white text-heading border-border hover:border-tertiary/50"
              }`}
            >
              {option} km
            </button>
          ))}
        </div>
      )}

      {locationStatus === "detecting" && (
        <div className="px-4 md:px-6 pb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-3 w-3 animate-spin rounded-full border-b-2 border-tertiary" />
          Finding workers near you…
        </div>
      )}

      {/* Location not available — say so and offer a way back in, rather than
          silently showing an unfiltered list. */}
      {(locationStatus === "denied" || locationStatus === "unsupported") && (
        <div className="px-4 md:px-6 pb-3">
          <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-medium text-amber-900">
                  Showing all workers
                </p>
                <p className="text-[11px] text-amber-800">
                  {locationStatus === "unsupported"
                    ? "Your browser doesn't support location, so we can't sort by distance."
                    : "Turn on location to see only workers near you, sorted by distance."}
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 gap-2">
              {locationStatus === "denied" && onEnableLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEnableLocation}
                  className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                >
                  Use my location
                </Button>
              )}
              {/* The recovery path when the browser has hard-blocked GPS —
                  a saved address still gives us coordinates. */}
              {onChangeLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onChangeLocation}
                  className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                >
                  Pick address
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!workers || workers.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-8">
        {header}
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <p className="text-muted-foreground">
            {locationEnabled
              ? `No workers within ${radiusKm} km for this service.`
              : "No workers available for this service"}
          </p>
          {locationEnabled && (
            <p className="text-xs text-muted-foreground mt-2">
              Try a wider range using the options above.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {header}

      {/* Workers Grid */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground mb-4">
          {workers.length} worker{workers.length !== 1 ? "s" : ""} available for{" "}
          {serviceName}
          {locationEnabled && ` within ${radiusKm} km`}
        </p>

        <div className="space-y-3">
          {workers.map((worker) => {
            const workPrice = worker.services?.[0]?.price ?? 0;

            return (
              <div
                key={worker.id}
                className="border border-border rounded-lg p-4 hover:border-tertiary/50 transition-colors"
              >
                {/* Worker Info */}
                <div className="flex items-start gap-3 mb-3">
                  {worker.profileImage ? (
                    <img
                      src={worker.profileImage}
                      alt={worker.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-tertiary">
                        {worker.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-heading">{worker.name}</h3>
                      {worker.isVerified ? (
                        <span className="inline-flex items-center bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{worker.category}</p>

                    {/* Rating + distance */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-heading">
                        {worker.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({worker.reviewCount} reviews)
                      </span>
                      {locationEnabled && worker.distance > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground ml-1">
                          <MapPin className="w-3 h-3" />
                          {worker.distance} km away
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Online Badge */}
                  {worker.isOnline && (
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>

                {/* Pricing — the work price and the call-out fee are separate costs */}
                <div className="mb-3 space-y-1 text-xs">
                  {workPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{serviceName}</span>
                      <span className="font-semibold text-tertiary">
                        Rs. {workPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {worker.visitingFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Visiting charge</span>
                      <span className="font-medium text-heading">
                        Rs. {worker.visitingFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {worker.visitingFee > 0 && (
                    <p className="text-[10px] text-green-600">
                      Visiting charge waived if you go ahead with the job.
                    </p>
                  )}
                </div>

                {/* Bio */}
                {worker.bio && (
                  <p className="text-xs text-paragraph/75 mb-3 line-clamp-2">
                    {worker.bio}
                  </p>
                )}

                {/* Select Button */}
                <Link
                  href={`/customer/book/${serviceId}/form?workerId=${worker.id}`}
                  className="w-full"
                >
                  <Button variant="tertiary" size="sm" className="w-full">
                    Select Worker
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
