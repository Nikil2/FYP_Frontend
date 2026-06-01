"use client";

import Link from "next/link";

interface ServiceCardProps {
  service: {
    id: number | string;
    name: string;
    iconUrl?: string | null;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/customer/book/${service.id}/workers`}
      className="block rounded-xl border border-tertiary/20 overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-tertiary/40 transition-all group"
    >
      {/* Service Icon Banner */}
      <div className="relative h-28 bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
        <div className="text-center p-3">
          <span className="text-3xl filter drop-shadow">
            {service.iconUrl || "🔧"}
          </span>
        </div>
        {/* Book Now Overlay Button */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="bg-tertiary text-white text-xs font-semibold px-4 py-1 rounded-md shadow-sm">
            Book Now
          </span>
        </div>
      </div>

      {/* Service Details */}
      <div className="p-3 text-center">
        <p className="text-sm font-semibold text-heading line-clamp-2 min-h-[2.5rem] group-hover:text-tertiary transition-colors">
          {service.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Flexible Price
        </p>
      </div>
    </Link>
  );
}
