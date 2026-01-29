"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Review } from "@/types/worker";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <Card className="p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-heading">Customer Reviews</h2>
        <p className="text-paragraph">
          {reviews.length} verified customer reviews
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-secondary-background rounded-lg space-y-3"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={review.customerAvatar}
                    alt={review.customerName}
                    size="md"
                  />
                  <div>
                    <p className="font-semibold text-heading">
                      {review.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-paragraph text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        )}
      </div>
    </Card>
  );
}
