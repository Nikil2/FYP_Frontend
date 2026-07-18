"use client";

import Link from "next/link";
import { ChevronLeft, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WorkerDetail } from "@/types/worker";

interface WorkerSelectionProps {
  serviceId: string;
  serviceName: string;
  workers: WorkerDetail[];
  locationEnabled?: boolean;
  radiusKm?: number;
  radiusOptions?: number[];
  onRadiusChange?: (radiusKm: number) => void;
}

export function WorkerSelection({
  serviceId,
  serviceName,
  workers,
  locationEnabled = false,
  radiusKm = 10,
  radiusOptions = [5, 10, 20, 50],
  onRadiusChange,
}: WorkerSelectionProps) {
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
