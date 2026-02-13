"use client";

import { useState } from "react";
import { Check, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { SelectedServiceEntry } from "@/interfaces/auth-interfaces";

interface Props {
  selectedServices: SelectedServiceEntry[];
  onServicesChange: (services: SelectedServiceEntry[]) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

export function StepServiceSelection({ selectedServices, onServicesChange, errors, lang }: Props) {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "What type of work do you do?",
      subtitle: "Select your services and what you can do in each",
      selectService: "Select a service to see options",
      addedServices: "Your Added Services",
      noServices: "No services added yet. Tap a service above to begin.",
      remove: "Remove",
    },
    ur: {
      title: "آپ کس قسم کا کام کرتے ہیں؟",
      subtitle: "اپنی سروسز منتخب کریں اور ہر ایک میں کیا کر سکتے ہیں",
      selectService: "آپشنز دیکھنے کے لیے سروس منتخب کریں",
      addedServices: "آپ کی شامل شدہ سروسز",
      noServices: "ابھی تک کوئی سروس شامل نہیں۔ شروع کرنے کے لیے اوپر سروس پر ٹیپ کریں۔",
      remove: "ہٹائیں",
    },
  };

  const labels = t[lang];

  const isServiceAdded = (serviceId: string) =>
    selectedServices.some((s) => s.serviceId === serviceId);

  const getSelectedSubServices = (serviceId: string) => {
    const entry = selectedServices.find((s) => s.serviceId === serviceId);
    return entry?.subServiceIds || [];
  };

  const toggleSubService = (serviceId: string, serviceName: string, subServiceId: string) => {
    const existing = selectedServices.find((s) => s.serviceId === serviceId);
    if (existing) {
      const hasSubService = existing.subServiceIds.includes(subServiceId);
      const newSubIds = hasSubService
        ? existing.subServiceIds.filter((id) => id !== subServiceId)
        : [...existing.subServiceIds, subServiceId];

      if (newSubIds.length === 0) {
        // Remove entire service if no sub-services
        onServicesChange(selectedServices.filter((s) => s.serviceId !== serviceId));
      } else {
        onServicesChange(
          selectedServices.map((s) =>
            s.serviceId === serviceId ? { ...s, subServiceIds: newSubIds } : s
          )
        );
      }
    } else {
      // Add new service entry
      onServicesChange([
        ...selectedServices,
        { serviceId, serviceName, subServiceIds: [subServiceId] },
      ]);
    }
  };

  const removeService = (serviceId: string) => {
    onServicesChange(selectedServices.filter((s) => s.serviceId !== serviceId));
    if (expandedServiceId === serviceId) setExpandedServiceId(null);
  };

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {/* Service Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SERVICE_CATEGORIES.map((cat) => {
          const isAdded = isServiceAdded(cat.id);
          const isExpanded = expandedServiceId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setExpandedServiceId(isExpanded ? null : cat.id)}
              className={`relative p-4 border-2 rounded-xl text-center transition-all ${
                isAdded
                  ? "border-tertiary bg-tertiary/5"
                  : "border-border hover:border-tertiary/40 bg-white"
              } ${isExpanded ? "ring-2 ring-tertiary/30" : ""}`}
            >
              {isAdded && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-tertiary" />
                </div>
              )}
              <p className="font-semibold text-heading text-sm">{isUrdu ? cat.nameUrdu : cat.name}</p>
              {isAdded && (
                <p className="text-xs text-tertiary mt-1">
                  {getSelectedSubServices(cat.id).length} selected
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Sub-Services */}
      {expandedServiceId && (
        <div className="bg-gray-50 border border-border rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {(() => {
            const cat = SERVICE_CATEGORIES.find((c) => c.id === expandedServiceId);
            if (!cat) return null;
            return (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-heading">
                    {isUrdu ? cat.nameUrdu : cat.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setExpandedServiceId(null)}
                    className="text-paragraph hover:text-heading"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {cat.subServices.map((sub) => {
                    const isChecked = getSelectedSubServices(cat.id).includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          isChecked ? "bg-tertiary/10 border border-tertiary" : "bg-white border border-border hover:border-tertiary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            toggleSubService(cat.id, isUrdu ? cat.nameUrdu : cat.name, sub.id)
                          }
                          className="w-5 h-5 rounded border-border text-tertiary focus:ring-tertiary accent-[var(--tertiary)]"
                        />
                        <span className="text-sm text-heading font-medium">
                          {isUrdu ? sub.nameUrdu : sub.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Added Services Summary */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-heading">{labels.addedServices}</h3>
        {selectedServices.length === 0 ? (
          <p className="text-xs text-paragraph bg-gray-50 p-4 rounded-lg text-center">{labels.noServices}</p>
        ) : (
          <div className="space-y-2">
            {selectedServices.map((entry) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.id === entry.serviceId);
              return (
                <div
                  key={entry.serviceId}
                  className="flex items-center justify-between bg-white border border-border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-heading text-sm">{entry.serviceName}</p>
                    <p className="text-xs text-paragraph mt-0.5">
                      {entry.subServiceIds
                        .map((sid) => {
                          const sub = cat?.subServices.find((s) => s.id === sid);
                          return sub ? (isUrdu ? sub.nameUrdu : sub.name) : sid;
                        })
                        .join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeService(entry.serviceId)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    {labels.remove}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {errors.selectedServices && (
        <p className="text-red-500 text-xs">{errors.selectedServices}</p>
      )}
    </div>
  );
}
