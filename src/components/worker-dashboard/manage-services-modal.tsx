"use client";

import { useState, useMemo } from "react";
import { X, Check, Loader2, Save, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/useServices";
import { updateWorkerServices } from "@/api/services/workers";
import { toast } from "sonner";

interface SelectedService {
  serviceId: number;
  price: number;
}

interface Props {
  workerId: string;
  initialServices: SelectedService[];
  onClose: () => void;
  onSaved: () => void;
}

export function ManageServicesModal({ workerId, initialServices, onClose, onSaved }: Props) {
  const { services, loading: loadingServices } = useServices();
  const [selected, setSelected] = useState<SelectedService[]>(initialServices);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");

  const selectedIds = selected.map((s) => s.serviceId);

  const availableServices = useMemo(
    () =>
      services.filter(
        (svc) =>
          !selectedIds.includes(svc.id) &&
          svc.name.toLowerCase().includes(search.toLowerCase())
      ),
    [services, selectedIds, search]
  );

  const addService = (serviceId: number) => {
    setSelected((prev) => [...prev, { serviceId, price: 0 }]);
    setSearch("");
  };

  const removeService = (serviceId: number) => {
    setSelected((prev) => prev.filter((s) => s.serviceId !== serviceId));
  };

  const updatePrice = (serviceId: number, price: number) => {
    setSelected((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, price } : s))
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      toast.error("Select at least one service");
      return;
    }
    if (selected.some((s) => s.price <= 0)) {
      toast.error("Enter a price greater than 0 for all services");
      return;
    }
    setSaving(true);
    try {
      await updateWorkerServices(workerId, selected);
      toast.success("Services updated successfully");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update services");
    } finally {
      setSaving(false);
    }
  };

  const selectedDetails = useMemo(
    () =>
      selected.map((s) => ({
        ...s,
        service: services.find((svc) => svc.id === s.serviceId),
      })),
    [selected, services]
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-heading">Manage Services</h3>
            <p className="text-xs text-paragraph mt-0.5">Add services and set your price for each</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-paragraph" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loadingServices ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-tertiary" />
            </div>
          ) : (
            <>
              {/* Selected services with price inputs */}
              {selectedDetails.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-heading">Your Services & Prices</p>
                  {selectedDetails.map(({ serviceId, price, service }) => (
                    <div
                      key={serviceId}
                      className="bg-white border border-border rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-heading text-sm">{service?.name}</p>
                          <p className="text-xs text-paragraph">{service?.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeService(serviceId)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-heading">Rs.</span>
                        <input
                          type="number"
                          min={0}
                          value={price || ""}
                          onChange={(e) => updatePrice(serviceId, parseFloat(e.target.value) || 0)}
                          placeholder="Enter your price"
                          className={`flex-1 text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30 ${
                            price <= 0 ? "border-red-300 bg-red-50" : "border-border bg-gray-50"
                          }`}
                        />
                      </div>
                      {price <= 0 && (
                        <p className="text-xs text-red-500">Please enter a price</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selected.length === 0 && !showPicker && (
                <p className="text-center text-sm text-paragraph bg-gray-50 rounded-xl py-8">
                  No services added yet.
                </p>
              )}

              {/* Add New Service button / picker */}
              {!showPicker ? (
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-tertiary/40 rounded-xl text-tertiary font-medium text-sm hover:border-tertiary hover:bg-tertiary/5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add New Service
                </button>
              ) : (
                <div className="border border-border rounded-xl overflow-hidden">
                  {/* Search bar */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-gray-50">
                    <Search className="w-4 h-4 text-paragraph flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search services..."
                      className="flex-1 text-sm bg-transparent outline-none text-heading placeholder:text-paragraph"
                    />
                    <button
                      type="button"
                      onClick={() => { setShowPicker(false); setSearch(""); }}
                      className="text-paragraph hover:text-heading"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Service list */}
                  <div className="max-h-52 overflow-y-auto divide-y divide-border">
                    {availableServices.length === 0 ? (
                      <p className="text-center text-sm text-paragraph py-6">
                        {search ? "No services match your search" : "All services already added"}
                      </p>
                    ) : (
                      availableServices.map((svc) => (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => { addService(svc.id); setShowPicker(false); }}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-tertiary/5 text-left transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-heading">{svc.name}</p>
                            <p className="text-xs text-paragraph">{svc.category}</p>
                          </div>
                          <Plus className="w-4 h-4 text-tertiary flex-shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border">
          <Button
            variant="tertiary"
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={handleSave}
            disabled={saving || loadingServices}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Services
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
