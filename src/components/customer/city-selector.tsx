"use client";

import { ChevronDown } from "lucide-react";
import { CITIES } from "@/lib/customer-data";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

export function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-sm text-heading font-medium mb-2">
        Select the city in which you need service
      </p>
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full appearance-none bg-white border border-border rounded-lg px-4 py-3 pr-10 text-heading text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40 transition-all"
        >
          {CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
