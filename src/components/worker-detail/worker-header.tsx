"use client";

import React from "react";
import { MapPin, Star, Shield } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkerDetail } from "@/types/worker";

interface WorkerHeaderProps {
  worker: WorkerDetail;
}

export function WorkerHeader({ worker }: WorkerHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-6 flex-col sm:flex-row">
        <Avatar
          src={worker.profileImage}
          alt={worker.name}
          size="xl"
          className="w-24 h-24"
        />

        <div className="flex-1 space-y-4">
          {/* Name and Status */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-heading">
                  {worker.name}
                </h1>
                {worker.isVerified && (
                  <div className="flex items-center gap-1 bg-tertiary/10 px-3 py-1 rounded-full">
                    <Shield className="w-4 h-4 text-tertiary" />
                    <span className="text-sm font-medium text-tertiary">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Online Status */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    worker.isOnline ? "bg-green-500" : "bg-muted-foreground"
                  )}
                />
                <span className="text-sm text-paragraph">
                  {worker.isOnline ? "Online now" : "Offline"}
                </span>
              </div>
            </div>

            {/* Category Badge */}
            <Badge variant="tertiary" className="text-base px-4 py-2">
              {worker.category}
            </Badge>
          </div>

          {/* Rating and Distance */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-heading">
                  {worker.rating}
                </span>
              </div>
              <span className="text-paragraph">
                ({worker.reviewCount} reviews)
              </span>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-2 text-paragraph">
              <MapPin className="w-5 h-5 text-tertiary" />
              <span>{worker.distance} km away</span>
            </div>
          </div>

          {/* Experience and Specializations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-paragraph">
              <span className="font-medium text-heading">Experience:</span>
              <span>{worker.experienceYears}+ years</span>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-heading text-sm">Specializations:</p>
              <div className="flex flex-wrap gap-2">
                {worker.specializations.map((spec) => (
                  <Badge
                    key={spec}
                    variant="default"
                    className="text-xs"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
