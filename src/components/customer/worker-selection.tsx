"use client";

import Link from "next/link";
import { ChevronLeft, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WorkerDetail } from "@/types/worker";

interface WorkerSelectionProps {
  serviceId: string;
  serviceName: string;
  workers: WorkerDetail[];
}

export function WorkerSelection({
  serviceId,
  serviceName,
  workers,
}: WorkerSelectionProps) {
  if (!workers || workers.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-8">
        <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
          <Link
            href="/customer"
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-heading" />
          </Link>
          <h1 className="text-lg font-semibold text-tertiary">Select Worker</h1>
        </div>

        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">No workers available for this service</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <Link
          href="/customer"
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-tertiary">Select Worker</h1>
          <p className="text-xs text-muted-foreground">{serviceName}</p>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground mb-4">
          {workers.length} worker{workers.length !== 1 ? "s" : ""} available for{" "}
          {serviceName}
        </p>

        <div className="space-y-3">
          {workers.map((worker) => (
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
                  <h3 className="font-semibold text-heading">{worker.name}</h3>
                  <p className="text-xs text-muted-foreground">{worker.category}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-heading">
                      {worker.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({worker.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Online Badge */}
                {worker.isOnline && (
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {worker.distance} km away
                </div>
                <div className="text-right font-semibold text-tertiary">
                  Rs {
                    worker.services && worker.services.length > 0
                      ? worker.services[0].price
                      : worker.visitingFee
                  }
                </div>
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
          ))}
        </div>
      </div>
    </div>
  );
}
