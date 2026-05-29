"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { CitySelector } from "@/components/customer/city-selector";
import { ServiceCard } from "@/components/customer/service-card";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import * as Icons from "lucide-react";
import { getActiveServices } from "@/api/services/services";
import { Service } from "@/api/types";

// Map category IDs to icons for the banner
const CATEGORY_ICONS: Record<string, keyof typeof Icons> = {
  "electrician": "Zap",
  "plumber": "Droplet",
  "carpenter": "Hammer",
  "painter": "Palette",
  "ac_technician": "Snowflake",
  "mason": "Grid",
  "mechanic": "Settings",
  "home_cleaner": "Sparkles",
  "tailoring": "Scissors",
  "car_care": "Car",
  "home_construction": "HardHat",
  "pest_control": "Bug",
};

interface CategoryPageProps {
  categoryId: string;
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await getActiveServices();
        const filtered = allServices.filter(s => s.categoryId === categoryId);
        setServices(filtered);
      } catch (error) {
        console.error("Failed to load category services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [categoryId]);

  const categoryName = useMemo(() => {
    if (services.length > 0) {
      return services[0].categoryName;
    }
    // Fallback formatting
    return categoryId
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }, [services, categoryId]);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter((s) => s.name.toLowerCase().includes(q));
  }, [services, searchQuery]);

  const iconName = CATEGORY_ICONS[categoryId] || "Wrench";
  const Icon = Icons[iconName] as React.ComponentType<{
    className?: string;
  }>;

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-heading" />
          </button>
          <h1 className="text-base font-semibold text-heading flex-1 truncate">
            {categoryName}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${categoryName.toLowerCase()} services`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary/40"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 py-4">
        <div className="rounded-xl bg-gradient-to-r from-tertiary/10 to-tertiary/5 p-6 flex items-center justify-center">
          <div className="text-center">
            {Icon && <Icon className="w-12 h-12 text-tertiary mx-auto mb-2" />}
            <h2 className="text-xl font-bold text-heading">
              {categoryName} Services
            </h2>
          </div>
        </div>
      </div>

      {/* City Selector */}
      <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />

      {/* Services Grid */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-bold text-heading mb-4">Available Services</h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No services found under this category
          </p>
        )}
      </div>

      <FloatingButtons />
    </div>
  );
}
