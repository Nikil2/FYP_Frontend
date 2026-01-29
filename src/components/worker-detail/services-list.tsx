"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Service } from "@/types/worker";

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  return (
    <Card className="p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-heading">Services Offered</h2>

      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 bg-secondary-background rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-lg text-heading font-medium">
              {service.name}
            </span>
            <span className="text-lg font-semibold text-tertiary">
              Rs. {service.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
