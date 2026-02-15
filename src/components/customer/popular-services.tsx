"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { POPULAR_SERVICES } from "@/lib/customer-data";

export function PopularServices() {
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
        <h2 className="text-lg font-bold text-heading">Popular Services</h2>
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
        {POPULAR_SERVICES.map((service) => (
          <Link
            key={service.id}
            href={`/customer/book/${service.id}/workers`}
            className="flex-shrink-0 w-[260px] md:w-full rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Service Image */}
            <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-lg font-bold text-heading">
                  {service.name}
                </p>
              </div>
              {/* Book Now Button */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <span className="bg-tertiary text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-tertiary-hover transition-colors">
                  Book Now
                </span>
              </div>
            </div>

            {/* Service Details */}
            <div className="p-3 text-center">
              <p className="text-sm font-semibold text-heading line-clamp-2 min-h-[2.5rem]">
                {service.name}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground line-through">
                  Rs. {service.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-tertiary">
                  Rs. {service.discountedPrice.toLocaleString()} (
                  {service.priceType === "fixed" ? "Fixed" : "Est."})
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
