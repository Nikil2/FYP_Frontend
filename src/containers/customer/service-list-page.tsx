"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import {
  getSubCategoryById,
  getServiceItemsBySubCategory,
} from "@/lib/customer-data";
import { ServiceCard } from "@/components/customer/service-card";
import { FloatingButtons } from "@/components/customer/floating-buttons";

interface ServiceListPageProps {
  subCategoryId: string;
}

export default function ServiceListPage({ subCategoryId }: ServiceListPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const subCategory = getSubCategoryById(subCategoryId);
  const serviceItems = getServiceItemsBySubCategory(subCategoryId);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return serviceItems;
    const q = searchQuery.toLowerCase();
    return serviceItems.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nameUrdu.includes(q)
    );
  }, [serviceItems, searchQuery]);

  if (!subCategory) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Service category not found</p>
      </div>
    );
  }

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
          <h1 className="text-base font-semibold text-heading flex-1 text-center pr-8">
            {subCategory.name}
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

      {/* Tab */}
      <div className="px-4 pt-4 pb-3">
        <span className="text-sm font-semibold text-tertiary border-b-2 border-tertiary pb-1">
          All Services
        </span>
      </div>

      {/* Service Cards Grid */}
      <div className="px-4">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            {searchQuery
              ? `No services found for "${searchQuery}"`
              : "No services available in this category"}
          </p>
        )}
      </div>

      <FloatingButtons />
    </div>
  );
}
