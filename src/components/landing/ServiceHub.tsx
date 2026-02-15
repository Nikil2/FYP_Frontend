"use client";

import { useState, useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/lib/animations";
import {
  CITIES,
  SERVICE_CATEGORY_GROUPS,
  SUB_CATEGORY_SERVICES,
  SERVICE_ITEMS,
  WEEKLY_OFFERS,
  POPULAR_SERVICES,
} from "@/lib/customer-data";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LoginPromptModal } from "@/components/modals/login-prompt-modal";

// ─── Icon maps ───
const CATEGORY_ICONS: Record<string, keyof typeof Icons> = {
  "home-maintenance": "Wrench",
  tailoring: "Scissors",
  "car-care": "Car",
  "home-construction": "HardHat",
};

const SUB_CATEGORY_ICONS: Record<string, string> = {
  "ac-services": "Wind",
  "electrician-services": "Zap",
  "plumber-services": "Droplet",
  "home-cleaning": "Sparkles",
  "pest-control": "Bug",
  "water-tank-cleaning": "Droplets",
  "ladies-tailoring": "Scissors",
  "gents-tailoring": "Scissors",
  "alteration-services": "Ruler",
  "car-wash": "Car",
  "car-repair": "Wrench",
  "bike-repair": "Bike",
  "tire-service": "Circle",
  "mason-services": "Blocks",
  "carpenter-services": "Hammer",
  "painter-services": "Paintbrush",
  waterproofing: "Umbrella",
  "welding-services": "Flame",
};

export function ServiceHub() {
  const router = useRouter();
  const { ref, isVisible } = useScrollReveal();

  // ─── State ───
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingServiceName, setPendingServiceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const offersScrollRef = useRef<HTMLDivElement>(null);
  const popularScrollRef = useRef<HTMLDivElement>(null);

  // ─── Helpers ───
  const handleBookClick = (serviceId: string, serviceName: string) => {
    if (isAuthenticated()) {
      router.push(`/customer/book/${serviceId}`);
    } else {
      setPendingServiceName(serviceName);
      setShowLoginModal(true);
    }
  };

  const scrollOffers = (dir: "left" | "right") => {
    offersScrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  const scrollPopular = (dir: "left" | "right") => {
    popularScrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  // ─── Search ───
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      items: SERVICE_ITEMS.filter(
        (i) => i.name.toLowerCase().includes(q) || i.nameUrdu.includes(q)
      ),
      subCategories: SUB_CATEGORY_SERVICES.filter(
        (s) => s.name.toLowerCase().includes(q) || s.nameUrdu.includes(q)
      ),
    };
  }, [searchQuery]);

  // ─── Category drill-down ───
  const subCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return SUB_CATEGORY_SERVICES.filter((s) => s.categoryId === selectedCategory);
  }, [selectedCategory]);

  const serviceItems = useMemo(() => {
    if (!selectedSubCategory) return [];
    return SERVICE_ITEMS.filter((i) => i.subCategoryId === selectedSubCategory);
  }, [selectedSubCategory]);

  const isSearching = searchQuery.trim().length > 0;

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
          {/* ═══════════════════════ PROMO BANNER ═══════════════════════ */}
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
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Electrician | Plumber | AC Tech | Cleaning
                    </span>
                  </div>
                </div>
                <div className="w-24 h-20 flex-shrink-0 rounded-lg bg-tertiary/10 flex items-center justify-center">
                  <span className="text-3xl">🏠</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════ CITY SELECTOR ═══════════════════════ */}
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

          {false && (
            <>
          {/* ═══════════════════════ WEEKLY OFFERS ═══════════════════════ */}
          <div className="py-4">
            <div className="px-4 md:px-6 flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-heading">Weekly Offers</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollOffers("left")}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-heading" />
                </button>
                <button
                  onClick={() => scrollOffers("right")}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-heading" />
                </button>
              </div>
            </div>
            <div
              ref={offersScrollRef}
              className="flex gap-4 overflow-x-auto px-4 md:px-6 pb-2 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {WEEKLY_OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  className="flex-shrink-0 w-[260px] md:w-full rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative h-40 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-xl font-bold text-pink-600 italic">
                        {offer.title}
                      </p>
                      <p className="text-sm text-pink-500 mt-1">Special Deal</p>
                    </div>
                    <button
                      onClick={() => handleBookClick(offer.id, offer.title)}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-tertiary text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-tertiary-hover transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
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
            </>
          )}

          {/* ═══════════════════════ POPULAR SERVICES ═══════════════════════ */}
          <div className="py-4">
            <div className="px-4 md:px-6 flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-heading">Popular Services</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollPopular("left")}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-heading" />
                </button>
                <button
                  onClick={() => scrollPopular("right")}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-heading" />
                </button>
              </div>
            </div>
            <div
              ref={popularScrollRef}
              className="flex gap-4 overflow-x-auto px-4 md:px-6 pb-2 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {POPULAR_SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-[260px] md:w-full rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-lg font-bold text-heading">
                        {service.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookClick(service.id, service.name)}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-tertiary text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-tertiary-hover transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
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
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════ SERVICE CATEGORIES ═══════════════════════ */}
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
                      setSelectedSubCategory(null);
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

            {/* Breadcrumb when drilling down */}
            {(selectedCategory || selectedSubCategory) && !isSearching && (
              <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                  className="text-tertiary hover:underline font-medium"
                >
                  All Categories
                </button>
                {selectedCategory && (
                  <>
                    <Icons.ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <button
                      onClick={() => setSelectedSubCategory(null)}
                      className={cn("font-medium", selectedSubCategory ? "text-tertiary hover:underline" : "text-heading")}
                    >
                      {SERVICE_CATEGORY_GROUPS.find((c) => c.id === selectedCategory)?.name}
                    </button>
                  </>
                )}
                {selectedSubCategory && (
                  <>
                    <Icons.ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-heading font-medium">
                      {SUB_CATEGORY_SERVICES.find((s) => s.id === selectedSubCategory)?.name}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* ── Search Results ── */}
            {isSearching && searchResults && (
              <div className="space-y-6">
                {searchResults.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-3">
                      Services ({searchResults.items.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="h-28 bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
                            <p className="text-sm font-semibold text-heading/70 text-center px-2">
                              {item.name}
                            </p>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-semibold text-heading line-clamp-2">
                              {item.name}
                            </p>
                            <p className="text-sm font-bold text-tertiary mt-1">
                              Rs. {item.price.toLocaleString()} ({item.priceType === "fixed" ? "Fixed" : "Est."})
                            </p>
                            <button
                              onClick={() => handleBookClick(item.id, item.name)}
                              className="w-full mt-2 bg-tertiary text-white text-sm font-semibold py-2 rounded-md hover:bg-tertiary-hover transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.subCategories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-3">
                      Categories ({searchResults.subCategories.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.subCategories.map((sub) => {
                        const iconName = SUB_CATEGORY_ICONS[sub.id] || "Wrench";
                        const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => { setSearchQuery(""); setSelectedCategory(sub.categoryId); setSelectedSubCategory(sub.id); }}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-tertiary/30 hover:shadow-sm transition-all"
                          >
                            <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center">
                              {Icon && <Icon className="w-7 h-7 text-tertiary" />}
                            </div>
                            <p className="text-sm font-semibold text-heading">{sub.name}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {searchResults.items.length === 0 && searchResults.subCategories.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">
                      No services found for &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Default: Category Grid ── */}
            {!isSearching && !selectedCategory && (
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                {SERVICE_CATEGORY_GROUPS.map((category) => {
                  const iconName = CATEGORY_ICONS[category.id] || "Grid3X3";
                  const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                  return (
                    <button
                      key={category.id}
                      onClick={() => { setSelectedCategory(category.id); setSelectedSubCategory(null); }}
                      className="w-full flex items-center gap-4 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:border-tertiary/30 transition-all group text-left"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center flex-shrink-0 group-hover:from-tertiary/20 group-hover:to-tertiary/10 transition-colors">
                        {Icon && <Icon className="w-8 h-8 text-tertiary" />}
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

            {/* ── Sub-Category View ── */}
            {!isSearching && selectedCategory && !selectedSubCategory && (
              <div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 text-tertiary hover:underline mb-4 font-medium text-sm"
                >
                  <Icons.ChevronLeft className="w-4 h-4" />
                  Back to Categories
                </button>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subCategories.map((sub) => {
                    const iconName = SUB_CATEGORY_ICONS[sub.id] || "Wrench";
                    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub.id)}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-tertiary/30 hover:shadow-sm transition-all"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
                          {Icon && <Icon className="w-8 h-8 text-tertiary" />}
                        </div>
                        <h3 className="text-sm font-semibold text-heading">{sub.name}</h3>
                        <p className="text-xs text-muted-foreground">{sub.nameUrdu}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Service Items (Bookable) ── */}
            {!isSearching && selectedSubCategory && (
              <div>
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className="flex items-center gap-1 text-tertiary hover:underline mb-4 font-medium text-sm"
                >
                  <Icons.ChevronLeft className="w-4 h-4" />
                  Back to {SERVICE_CATEGORY_GROUPS.find((c) => c.id === selectedCategory)?.name}
                </button>
                {serviceItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {serviceItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-tertiary/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="h-28 bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
                          <p className="text-sm font-semibold text-heading/70 text-center px-2">
                            {item.name}
                          </p>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-heading line-clamp-2 min-h-[2.5rem]">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.nameUrdu}</p>
                          <p className="text-sm font-bold text-tertiary mt-1">
                            Rs. {item.price.toLocaleString()} ({item.priceType === "fixed" ? "Fixed" : "Est."})
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                          )}
                          <button
                            onClick={() => handleBookClick(item.id, item.name)}
                            className="w-full mt-2 bg-tertiary text-white text-sm font-semibold py-2 rounded-md hover:bg-tertiary-hover transition-colors"
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
      />
    </>
  );
}
