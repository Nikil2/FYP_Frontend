"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WEEKLY_OFFERS } from "@/lib/customer-data";
import type { ServiceOffer } from "@/types/customer";

interface WeeklyOffersProps {
  onOfferClick?: (offer: ServiceOffer) => void;
}

export function WeeklyOffers({ onOfferClick }: WeeklyOffersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-3">
      <div className="px-4 flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-heading">Weekly Offers</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-heading" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-heading" />
          </button>
        </div>
      </div>

      {/* Mobile: horizontal scroll / Desktop: grid */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {WEEKLY_OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="flex-shrink-0 w-[260px] md:w-full rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
            onClick={() => onOfferClick?.(offer)}
          >
            {/* Offer Image */}
            <div className="relative h-40 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-xl font-bold text-pink-600 italic">
                    {offer.title}
                  </p>
                  <p className="text-sm text-pink-500 mt-1">Special Deal</p>
                </div>
              </div>
              {/* Book Now Button */}
              <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-tertiary text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-tertiary-hover transition-colors">
                Book Now
              </button>
            </div>

            {/* Offer Details */}
            <div className="p-3 text-center">
              <p className="text-sm font-semibold text-heading truncate">
                {offer.title}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground line-through">
                  Rs. {offer.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-tertiary">
                  Rs. {offer.discountedPrice.toLocaleString()} (Fixed)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
