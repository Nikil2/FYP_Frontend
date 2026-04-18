"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { groupServicesByCategory, Service } from "@/api";
import { useServices } from "@/hooks/useServices";

interface Props {
  selectedServiceIds: number[];
  onServicesChange: (serviceIds: number[]) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

type CategoryGroup = {
  id: string;
  name: string;
  services: Service[];
};

export function StepServiceSelection({ selectedServiceIds, onServicesChange, errors, lang }: Props) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const { services, loading, error, refetch } = useServices();

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "What type of work do you do?",
      subtitle: "Select the services you can provide",
      addedServices: "Your Added Services",
      noServices: "No services added yet. Tap a service to begin.",
      remove: "Remove",
      allServices: "All Services",
      loading: "Loading services...",
      loadError: "Failed to load services.",
      retry: "Retry",
      empty: "No services available yet.",
      selected: "selected",
    },
    ur: {
      title: "آپ کس قسم کا کام کرتے ہیں؟",
      subtitle: "اپنی سروسز منتخب کریں",
      addedServices: "آپ کی شامل شدہ سروسز",
      noServices: "ابھی تک کوئی سروس شامل نہیں۔ شروع کرنے کے لیے سروس پر ٹیپ کریں۔",
      remove: "ہٹائیں",
      allServices: "تمام سروسز",
      loading: "سروسز لوڈ ہو رہی ہیں...",
      loadError: "سروسز لوڈ نہیں ہو سکیں۔",
      retry: "دوبارہ کوشش کریں",
      empty: "ابھی کوئی سروس دستیاب نہیں۔",
      selected: "منتخب",
    },
  };

  const labels = t[lang];

  const grouped = useMemo(() => groupServicesByCategory(services), [services]);
  const categories = useMemo<CategoryGroup[]>(
    () =>
      Object.entries(grouped).map(([category, items]) => ({
        id: category,
        name: category,
        services: items,
      })),
    [grouped]
  );

  const shouldShowFlatList =
    categories.length === 1 && categories[0].id === "Other";

  const toggleService = (serviceId: number) => {
    if (selectedServiceIds.includes(serviceId)) {
      onServicesChange(selectedServiceIds.filter((id) => id !== serviceId));
    } else {
      onServicesChange([...selectedServiceIds, serviceId]);
    }
  };

  const selectedServices = useMemo(
    () => services.filter((service) => selectedServiceIds.includes(service.id)),
    [services, selectedServiceIds]
  );

  const renderServiceList = (items: Service[]) => (
    <div className="space-y-2">
      {items.map((service) => {
        const isChecked = selectedServiceIds.includes(service.id);
        return (
          <label
            key={service.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              isChecked
                ? "bg-tertiary/10 border border-tertiary"
                : "bg-white border border-border hover:border-tertiary/40"
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleService(service.id)}
              className="w-5 h-5 rounded border-border text-tertiary focus:ring-tertiary accent-[var(--tertiary)]"
            />
            <span className="text-sm text-heading font-medium">
              {service.name}
            </span>
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-paragraph">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">{labels.loading}</span>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <p>{labels.loadError}</p>
          <p className="text-xs mt-1">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-3 inline-flex items-center text-xs font-semibold text-red-700 hover:underline"
          >
            {labels.retry}
          </button>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="bg-gray-50 border border-border text-paragraph px-4 py-3 rounded-lg text-sm">
          {labels.empty}
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          {shouldShowFlatList ? (
            <div className="bg-gray-50 border border-border rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-heading">{labels.allServices}</h3>
              {renderServiceList(services)}
            </div>
          ) : (
            <>
              {/* Service Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const selectedCount = category.services.filter((service) =>
                    selectedServiceIds.includes(service.id)
                  ).length;
                  const isExpanded = expandedCategoryId === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                      className={`relative p-4 border-2 rounded-xl text-center transition-all ${
                        selectedCount > 0
                          ? "border-tertiary bg-tertiary/5"
                          : "border-border hover:border-tertiary/40 bg-white"
                      } ${isExpanded ? "ring-2 ring-tertiary/30" : ""}`}
                    >
                      {selectedCount > 0 && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-4 h-4 text-tertiary" />
                        </div>
                      )}
                      <p className="font-semibold text-heading text-sm">{category.name}</p>
                      {selectedCount > 0 && (
                        <p className="text-xs text-tertiary mt-1">
                          {selectedCount} {labels.selected}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Expanded Services */}
              {expandedCategoryId && (
                <div className="bg-gray-50 border border-border rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  {(() => {
                    const category = categories.find((c) => c.id === expandedCategoryId);
                    if (!category) return null;
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-heading">{category.name}</h3>
                          <button
                            type="button"
                            onClick={() => setExpandedCategoryId(null)}
                            className="text-paragraph hover:text-heading"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {renderServiceList(category.services)}
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          )}

          {/* Added Services Summary */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-heading">{labels.addedServices}</h3>
            {selectedServices.length === 0 ? (
              <p className="text-xs text-paragraph bg-gray-50 p-4 rounded-lg text-center">{labels.noServices}</p>
            ) : (
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between bg-white border border-border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium text-heading text-sm">{service.name}</p>
                      <p className="text-xs text-paragraph mt-0.5">{service.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      {labels.remove}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {errors.selectedServiceIds && (
        <p className="text-red-500 text-xs">{errors.selectedServiceIds}</p>
      )}
    </div>
  );
}
