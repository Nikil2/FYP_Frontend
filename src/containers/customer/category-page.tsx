"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import {
  getCategoryById,
  getSubCategoriesByCategoryId,
  getPopularServicesByCategory,
} from "@/lib/customer-data";
import { CitySelector } from "@/components/customer/city-selector";
import { ServiceCard } from "@/components/customer/service-card";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import * as Icons from "lucide-react";

// Map category IDs to icons for the banner
const CATEGORY_ICONS: Record<string, keyof typeof Icons> = {
  "home-maintenance": "Wrench",
  "tailoring": "Scissors",
  "car-care": "Car",
  "home-construction": "HardHat",
};

interface CategoryPageProps {
  categoryId: string;
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [activeTab, setActiveTab] = useState<"popular" | "all">("popular");

  const category = getCategoryById(categoryId);
  const subCategories = getSubCategoriesByCategoryId(categoryId);
  const popularServices = getPopularServicesByCategory(categoryId);

  const filteredSubCategories = useMemo(() => {
    if (!searchQuery.trim()) return subCategories;
    const q = searchQuery.toLowerCase();
    return subCategories.filter(
      (sub) =>
        sub.name.toLowerCase().includes(q) || sub.nameUrdu.includes(q)
    );
  }, [subCategories, searchQuery]);

  const filteredPopularServices = useMemo(() => {
    if (!searchQuery.trim()) return popularServices;
    const q = searchQuery.toLowerCase();
    return popularServices.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nameUrdu.includes(q)
    );
  }, [popularServices, searchQuery]);

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  const iconName = CATEGORY_ICONS[categoryId] || "Grid3X3";
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
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-heading" />
          </button>
          <h1 className="text-base font-semibold text-heading flex-1 truncate">
            {category.name}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
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
              {category.name.split(" ")[0]} Service
            </h2>
          </div>
        </div>
      </div>

      {/* City Selector */}
      <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />

      {/* Tabs */}
      <div className="px-4 flex items-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("popular")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "popular"
              ? "text-tertiary border-tertiary"
              : "text-muted-foreground border-transparent hover:text-heading"
          }`}
        >
          Popular Services
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "all"
              ? "text-tertiary border-tertiary"
              : "text-muted-foreground border-transparent hover:text-heading"
          }`}
        >
          All Services
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === "popular" ? (
          <>
            {filteredPopularServices.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredPopularServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No popular services found
              </p>
            )}
          </>
        ) : (
          <>
            {filteredSubCategories.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {filteredSubCategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/customer/services/${sub.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-white hover:border-tertiary/30 hover:shadow-sm transition-all"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <p className="text-xs font-medium text-heading text-center line-clamp-2">
                      {sub.name}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No services found
              </p>
            )}
          </>
        )}
      </div>

      <FloatingButtons />
    </div>
  );
}
