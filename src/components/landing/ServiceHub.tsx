"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/lib/animations";
import { CITIES } from "@/lib/customer-data";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LoginPromptModal } from "@/components/modals/login-prompt-modal";
import { getActiveServices } from "@/api/services/services";
import { Service } from "@/api/types";

// Map category IDs to icons
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

export function ServiceHub() {
  const router = useRouter();
  const { ref, isVisible } = useScrollReveal();

  // ─── State ───
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingServiceName, setPendingServiceName] = useState("");
  const [pendingServiceId, setPendingServiceId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getActiveServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch active services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ─── Helpers ───
  const handleBookClick = (serviceId: string | number, serviceName: string) => {
    if (isAuthenticated()) {
      router.push(`/customer/book/${serviceId}`);
    } else {
      setPendingServiceName(serviceName);
      setPendingServiceId(serviceId.toString());
      setShowLoginModal(true);
    }
  };

  // Extract unique categories from active services
  const categories = useMemo(() => {
    const categoryMap = new Map();
    services.forEach((s) => {
      if (!categoryMap.has(s.categoryId)) {
        categoryMap.set(s.categoryId, {
          id: s.categoryId,
          name: s.categoryName,
          description: `Hire professional ${s.categoryName.toLowerCase()} services`,
        });
      }
    });
    return Array.from(categoryMap.values());
  }, [services]);

  // Filter services by active category
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    return services.filter((s) => s.categoryId === selectedCategory);
  }, [services, selectedCategory]);

  // ─── Search Results ───
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    
    // Find matching services
    const matchedServices = services.filter(
      (s) => s.name.toLowerCase().includes(q)
    );
    
    // Find matching categories
    const matchedCategories = categories.filter(
      (c) => c.name.toLowerCase().includes(q)
    );

    return {
      services: matchedServices,
      categories: matchedCategories,
    };
  }, [services, categories, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const currentCategoryName = useMemo(() => {
    if (!selectedCategory) return "";
    const matched = categories.find((c) => c.id === selectedCategory);
    return matched ? matched.name : "";
  }, [categories, selectedCategory]);

  return (
    <>
      <section
        id="services-hub"
        className="py-12 md:py-16 bg-white"
        ref={ref}
      >
        <div
          className={cn(
            "max-w-6xl mx-auto transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Promo Banner */}
          <div className="px-4 md:px-6 mb-4">
            <p className="text-center text-tertiary font-semibold text-lg mb-3">
              Professional Services at Your Doorstep
            </p>
            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-tertiary/10 via-tertiary/5 to-pink-50 border border-tertiary/20 shadow-sm">
              <div className="flex items-center justify-between p-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-heading leading-tight">
                    Quality Services
                    <br />
                    at Your Doorstep
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trusted Professionals • Verified Workers
                  </p>
                </div>
                <div className="w-24 h-20 flex-shrink-0 rounded-lg bg-tertiary/10 flex items-center justify-center">
                  <span className="text-3xl">🏠</span>
                </div>
              </div>
            </div>
          </div>

          {/* City Selector */}
          <div className="px-4 md:px-6 py-3">
            <p className="text-sm text-heading font-medium mb-2">
              Select the city in which you need service
            </p>
            <div className="relative max-w-md">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none bg-white border border-border rounded-lg px-4 py-3 pr-10 text-heading text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
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

          {/* Service Categories Section */}
          <div id="browse-services" className="py-6 px-4 md:px-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">
                Mehnati <span className="text-tertiary">Services</span>
              </h2>
              <p className="text-paragraph max-w-xl mx-auto">
                Browse all our service categories or search for what you need
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search any service... (e.g. AC repair, plumber, painting)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      setSelectedCategory(null);
                    }
                  }}
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

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
              </div>
            )}

            {/* Category Breadcrumb */}
            {selectedCategory && !isSearching && !loading && (
              <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-tertiary hover:underline font-medium"
                >
                  All Categories
                </button>
                <Icons.ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-heading font-medium">
                  {currentCategoryName}
                </span>
              </div>
            )}

            {/* ── Search Results ── */}
            {isSearching && searchResults && !loading && (
              <div className="space-y-6">
                {/* Services Matches */}
                {searchResults.services.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-heading mb-3">
                      Matching Services ({searchResults.services.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.services.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-tertiary/20 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="h-24 bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
                            <span className="text-3xl filter drop-shadow">
                              {item.iconUrl || "🔧"}
                            </span>
                          </div>
                          <div className="p-3 text-center">
                            <p className="text-sm font-semibold text-heading line-clamp-2 min-h-[2.5rem] group-hover:text-tertiary transition-colors">
                              {item.name}
                            </p>
                            <button
                              onClick={() => handleBookClick(item.id, item.name)}
                              className="w-full mt-2 bg-tertiary text-white text-xs font-semibold py-2 rounded-md hover:bg-tertiary-hover transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories Matches */}
                {searchResults.categories.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-heading mb-3">
                      Matching Categories ({searchResults.categories.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.categories.map((c) => {
                        const iconName = CATEGORY_ICONS[c.id] || "Wrench";
                        const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                        return (
                          <button
                            key={c.id}
                            onClick={() => { setSearchQuery(""); setSelectedCategory(c.id); }}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-tertiary/30 hover:shadow-sm transition-all"
                          >
                            <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center">
                              {Icon ? (
                                <Icon className="w-7 h-7 text-tertiary" />
                              ) : (
                                <span className="text-2xl">🔧</span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-heading">{c.name}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Matches */}
                {searchResults.services.length === 0 && searchResults.categories.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">
                      No services found for &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Try different keywords (e.g. wire, pipe, AC)</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Default: Category Grid ── */}
            {!isSearching && !selectedCategory && !loading && (
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                {categories.map((category) => {
                  const iconName = CATEGORY_ICONS[category.id] || "Wrench";
                  const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                  return (
                    <button
                      key={category.id}
                      onClick={() => { setSelectedCategory(category.id); }}
                      className="w-full flex items-center gap-4 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:border-tertiary/30 transition-all group text-left"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center flex-shrink-0 group-hover:from-tertiary/20 group-hover:to-tertiary/10 transition-colors">
                        {Icon ? (
                          <Icon className="w-8 h-8 text-tertiary" />
                        ) : (
                          <span className="text-2xl">🔧</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-heading group-hover:text-tertiary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {category.description}
                        </p>
                      </div>
                      <Icons.ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-tertiary transition-colors" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Services list under selected Category ── */}
            {!isSearching && selectedCategory && !loading && (
              <div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 text-tertiary hover:underline mb-4 font-medium text-sm"
                >
                  <Icons.ChevronLeft className="w-4 h-4" />
                  Back to Categories
                </button>
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredServices.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-tertiary/20 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group text-center"
                      >
                        <div className="h-24 bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
                          <span className="text-3xl filter drop-shadow">
                            {item.iconUrl || "🔧"}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-heading line-clamp-2 min-h-[2.5rem] group-hover:text-tertiary transition-colors">
                            {item.name}
                          </p>
                          <button
                            onClick={() => handleBookClick(item.id, item.name)}
                            className="w-full mt-2 bg-tertiary text-white text-xs font-semibold py-2 rounded-md hover:bg-tertiary-hover transition-colors"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No services available in this category yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        serviceName={pendingServiceName}
        redirectUrl={`/customer/book/${pendingServiceId}`}
      />
    </>
  );
}
