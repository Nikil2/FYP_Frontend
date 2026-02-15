"use client";

import Link from "next/link";
import type { ServiceItem } from "@/types/customer";

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/customer/book/${service.id}/workers`}
      className="block rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all hover:border-tertiary/50"
    >
      {/* Service Image */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center p-3">
          <p className="text-sm font-semibold text-heading/70">{service.name}</p>
        </div>
        {/* Book Now Overlay Button */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <span className="bg-tertiary text-white text-xs font-semibold px-5 py-1.5 rounded-md">
            Book Now
          </span>
        </div>
      </div>

      {/* Service Details */}
      <div className="p-3">
        <p className="text-sm font-semibold text-heading line-clamp-2 min-h-[2.5rem]">
          {service.name}
        </p>
        <p className="text-sm font-bold text-tertiary mt-1">
          Rs. {service.price.toLocaleString()} (
          {service.priceType === "fixed" ? "Fixed" : "Estimated"})
        </p>
        {service.description && service.priceType === "estimated" && (
          <p className="text-xs text-muted-foreground mt-1">
            ({service.description})
          </p>
        )}
      </div>
    </Link>
  );
}
