"use client";

import { useState, useEffect, useMemo } from "react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { PromoBanner } from "@/components/customer/promo-banner";
import { CitySelector } from "@/components/customer/city-selector";
import { ServiceCategories } from "@/components/customer/service-categories";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { getAuthUser } from "@/lib/auth";
import { getActiveServices } from "@/api/services/services";
import { Search, X } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";

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

export default function CustomerHome() {
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [userName, setUserName] = useState("Guest User");
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage (set during login)
    const user = getAuthUser();
    if (user) {
      setUserName(user.fullName || "User");
    }

    // Fetch active services and group into categories
    const fetchCategories = async () => {
      try {
        const activeServices = await getActiveServices();
        setServices(activeServices);
        const categoryMap = new Map();
        
        activeServices.forEach((s) => {
          if (!categoryMap.has(s.categoryId)) {
            categoryMap.set(s.categoryId, {
              id: s.categoryId,
              name: s.categoryName,
              description: `Hire professional ${s.categoryName.toLowerCase()} services`,
            });
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const matchedServices = services.filter(
      (s) => s.name.toLowerCase().includes(q)
    );

    const matchedCategories = categories.filter(
      (c) => c.name.toLowerCase().includes(q)
    );

    return {
      services: matchedServices,
      categories: matchedCategories,
    };
  }, [services, categories, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <CustomerHeader userName={userName} />

      {/* Promo Banner */}
      <PromoBanner />

      {/* City Selector */}
      <CitySelector
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Search Bar */}
      <div className="px-4 py-3 md:px-6 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search any service... (e.g. AC repair, plumber, painting)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white border border-border rounded-xl text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heading"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
        </div>
      ) : isSearching && searchResults ? (
        <div className="px-4 md:px-6 max-w-2xl mx-auto space-y-6">
          {/* Services Matches */}
          {searchResults.services.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-heading mb-3">
                Matching Services ({searchResults.services.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.services.map((item) => (
                  <Link
                    key={item.id}
                    href={`/customer/book/${item.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-tertiary/30 hover:shadow-sm bg-white transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-tertiary/20 transition-colors">
                      <span className="text-xl">{item.iconUrl || "🔧"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-heading truncate group-hover:text-tertiary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.categoryName}
                      </p>
                    </div>
                    <Icons.ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-tertiary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories Matches */}
          {searchResults.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-heading mb-3">
                Matching Categories ({searchResults.categories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.categories.map((c) => {
                  const iconName = CATEGORY_ICONS[c.id] || "Wrench";
                  const Icon = Icons[iconName] as React.ComponentType<{
                    className?: string;
                  }>;
                  return (
                    <Link
                      key={c.id}
                      href={`/customer/category/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-tertiary/30 hover:shadow-sm bg-white transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-tertiary/20 transition-colors">
                        {Icon ? (
                          <Icon className="w-5 h-5 text-tertiary" />
                        ) : (
                          <span className="text-xl">🔧</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-heading truncate group-hover:text-tertiary transition-colors">
                          {c.name}
                        </p>
                      </div>
                      <Icons.ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-tertiary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Matches */}
          {searchResults.services.length === 0 && searchResults.categories.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-base font-semibold text-heading">
                No services found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords (e.g. wiring, leak, paint)
              </p>
            </div>
          )}
        </div>
      ) : (
        <ServiceCategories categories={categories} />
      )}

      {/* Floating WhatsApp + Phone Buttons */}
      <FloatingButtons />
    </div>
  );
}
