"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { WorkerDetail } from "@/types/worker";

interface WorkerAboutProps {
  worker: WorkerDetail;
}

export function WorkerAbout({ worker }: WorkerAboutProps) {
  return (
    <Card className="p-6 md:p-8 space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-heading">About</h2>
        <p className="text-lg text-paragraph leading-relaxed">{worker.bio}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            Experience
          </p>
          <p className="text-2xl font-bold text-heading">
            {worker.experienceYears}+
          </p>
          <p className="text-xs text-muted-foreground">Years</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Rating</p>
          <p className="text-2xl font-bold text-heading">{worker.rating}</p>
          <p className="text-xs text-muted-foreground">Stars</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Reviews</p>
          <p className="text-2xl font-bold text-heading">
            {worker.reviewCount}
          </p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </Card>
  );
}
