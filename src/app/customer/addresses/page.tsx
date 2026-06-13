"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Plus, Trash2, Home, Briefcase, Star, Loader2, X, Check, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/customer/notification-bell";
import { apiClient } from "@/api/client";
import { toast } from "sonner";

interface SavedAddress {
  id: string;
  label?: string;
  address: string;
  lat: number;
  lng: number;
}

const LABEL_ICONS: Record<string, React.ElementType> = {
  Home: Home,
  Work: Briefcase,
  Other: Star,
};

const LABEL_OPTIONS = ["Home", "Work", "Other"];

async function fetchAddresses(): Promise<SavedAddress[]> {
  const res = await apiClient.get<SavedAddress[] | { data?: SavedAddress[] }>("/locations");
  if (res && typeof res === "object" && "data" in res && Array.isArray((res as { data: unknown }).data)) {
    return (res as { data: SavedAddress[] }).data;
  }
  return Array.isArray(res) ? res : [];
}

export default function SavedAddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formAddress, setFormAddress] = useState("");
  const [formLabel, setFormLabel] = useState("Home");
  const [formLat, setFormLat] = useState(0);
  const [formLng, setFormLng] = useState(0);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchAddresses()
      .then(setAddresses)
      .catch(() => toast.error("Failed to load addresses"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await apiClient.delete(`/locations/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed.");
    } catch {
      toast.error("Failed to remove address.");
    } finally {
      setDeleting(null);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormLat(latitude);
        setFormLng(longitude);
        // Reverse-geocode using OpenStreetMap Nominatim (free, no API key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr =
            data.display_name ||
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setFormAddress(addr);
          toast.success("Location detected.");
        } catch {
          setFormAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast.success("Location detected (address lookup failed).");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please allow access and try again.");
        } else {
          toast.error("Could not get your location. Please enter manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAdd = async () => {
    if (!formAddress.trim()) {
      toast.error("Please enter an address.");
      return;
    }
    setSaving(true);
    try {
      const created = await apiClient.post<SavedAddress>("/locations", {
        address: formAddress.trim(),
        label: formLabel,
        lat: formLat,
        lng: formLng,
      });
      setAddresses((prev) => [...prev, created]);
      setShowForm(false);
      setFormAddress("");
      setFormLabel("Home");
      toast.success("Address saved.");
    } catch {
      toast.error("Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/profile")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading flex-1">Saved Addresses</h1>
        <NotificationBell />
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {addresses.length === 0 && !showForm && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-tertiary" />
                </div>
                <h3 className="text-base font-semibold text-heading mb-1">No Saved Addresses</h3>
                <p className="text-sm text-muted-foreground mb-5">Save your home, office or frequent locations for faster booking.</p>
                <Button variant="tertiary" size="sm" onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>
            )}

            {addresses.map((addr) => {
              const LabelIcon = LABEL_ICONS[addr.label || ""] || MapPin;
              return (
                <div key={addr.id} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                    <LabelIcon className="w-5 h-5 text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-tertiary uppercase tracking-wide">{addr.label || "Saved"}</p>
                      {addr.lat !== 0 && addr.lng !== 0 && (
                        <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Navigation className="w-2.5 h-2.5" /> GPS
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-heading mt-0.5 leading-snug">{addr.address}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deleting === addr.id}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    {deleting === addr.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}

            {/* Add new address form */}
            {showForm ? (
              <div className="bg-white rounded-xl border border-tertiary/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-heading">Add New Address</h3>
                  <button onClick={() => { setShowForm(false); setFormAddress(""); setFormLat(0); setFormLng(0); }} className="p-1 hover:bg-muted rounded">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Label selector */}
                <div className="flex gap-2">
                  {LABEL_OPTIONS.map((label) => {
                    const Icon = LABEL_ICONS[label] || MapPin;
                    return (
                      <button
                        key={label}
                        onClick={() => setFormLabel(label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          formLabel === label
                            ? "bg-tertiary text-white border-tertiary"
                            : "border-border text-heading hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Current location button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-tertiary/40 text-tertiary text-xs font-semibold hover:bg-tertiary/5 transition-colors disabled:opacity-60"
                >
                  {locating
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting location...</>
                    : <><Navigation className="w-3.5 h-3.5" /> Use Current Location</>
                  }
                </button>

                <div className="relative flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">or type manually</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <input
                  type="text"
                  placeholder="Enter full address (e.g. Street 5, F-7, Islamabad)"
                  value={formAddress}
                  onChange={(e) => { setFormAddress(e.target.value); setFormLat(0); setFormLng(0); }}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setShowForm(false); setFormAddress(""); setFormLat(0); setFormLng(0); }}>
                    Cancel
                  </Button>
                  <Button variant="tertiary" size="sm" className="flex-1" onClick={handleAdd} disabled={saving || !formAddress.trim()}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                  </Button>
                </div>
              </div>
            ) : (
              addresses.length > 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-tertiary hover:text-tertiary transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
