"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Search, Crosshair, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  homeAddress: string;
  homeLat: number;
  homeLng: number;
  onAddressChange: (address: string, lat: number, lng: number) => void;
  errors: Record<string, string>;
  lang: "en" | "ur";
}

interface Suggestion {
  placeId: string;
  description: string;
  lat: number;
  lng: number;
}

export function StepAddressLocation({
  homeAddress,
  homeLat,
  homeLng,
  onAddressChange,
  errors,
  lang,
}: Props) {
  const [searchQuery, setSearchQuery] = useState(homeAddress);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(!!homeAddress);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "Your Work Location",
      subtitle: "This helps customers near you find your services",
      searchPlaceholder: "Search your area, city or address...",
      useCurrentLocation: "Use Current Location",
      locating: "Detecting your location...",
      confirmedAddress: "Confirmed Address",
      changeAddress: "Change Address",
      popularCities: "Popular Cities",
      noResults: "No results found. Try a different search.",
      locationDenied: "Location permission denied. Please pick a city below.",
      locationUnavailable: "Could not detect location. Please search manually.",
      locationTimeout: "Location timed out. Please search manually.",
      httpsRequired: "Location requires HTTPS. Please search manually.",
      unsupported: "Your browser doesn't support location. Please search manually.",
    },
    ur: {
      title: "آپ کا کام کا مقام",
      subtitle: "اس سے آپ کے قریبی کسٹمرز آپ کو تلاش کر سکیں گے",
      searchPlaceholder: "اپنا علاقہ، شہر یا پتہ تلاش کریں...",
      useCurrentLocation: "موجودہ مقام استعمال کریں",
      locating: "مقام معلوم ہو رہا ہے...",
      confirmedAddress: "تصدیق شدہ پتہ",
      changeAddress: "پتہ تبدیل کریں",
      popularCities: "مشہور شہر",
      noResults: "کوئی نتیجہ نہیں ملا۔ دوسری تلاش کریں۔",
      locationDenied: "لوکیشن کی اجازت نہیں دی گئی۔ براہ کرم نیچے سے شہر منتخب کریں۔",
      locationUnavailable: "لوکیشن معلوم نہ ہو سکی۔ براہ کرم دستی تلاش کریں۔",
      locationTimeout: "لوکیشن ٹائم آؤٹ ہو گئی۔ براہ کرم دستی تلاش کریں۔",
      httpsRequired: "لوکیشن کے لیے HTTPS ضروری ہے۔ براہ کرم دستی تلاش کریں۔",
      unsupported: "آپ کا براؤزر لوکیشن سپورٹ نہیں کرتا۔ براہ کرم دستی تلاش کریں۔",
    },
  };

  const labels = t[lang];

  const popularCities = [
    { name: "Karachi", nameUrdu: "کراچی", lat: 24.8607, lng: 67.0011 },
    { name: "Lahore", nameUrdu: "لاہور", lat: 31.5204, lng: 74.3587 },
    { name: "Islamabad", nameUrdu: "اسلام آباد", lat: 33.6844, lng: 73.0479 },
    { name: "Rawalpindi", nameUrdu: "راولپنڈی", lat: 33.5651, lng: 73.0169 },
    { name: "Faisalabad", nameUrdu: "فیصل آباد", lat: 31.4504, lng: 73.135 },
    { name: "Multan", nameUrdu: "ملتان", lat: 30.1575, lng: 71.5249 },
    { name: "Peshawar", nameUrdu: "پشاور", lat: 34.0151, lng: 71.5249 },
    { name: "Quetta", nameUrdu: "کوئٹہ", lat: 30.1798, lng: 66.975 },
  ];

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check geolocation permission once
  useEffect(() => {
    if (!("permissions" in navigator)) return;
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((status) => {
        setPermissionState(status.state);
        status.onchange = () => setPermissionState(status.state);
      })
      .catch(() => setPermissionState("unknown"));
  }, []);

  // ── FREE address search via Nominatim (OpenStreetMap) ──────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsConfirmed(false);
    setLocationError(null);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(query + ", Pakistan")}` +
          `&format=json&addressdetails=1&limit=6&countrycodes=pk`;

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "Accept-Language": isUrdu ? "ur" : "en" },
        });
        const data = await res.json();

        const mapped: Suggestion[] = data.map((item: any) => ({
          placeId: item.place_id,
          description: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));

        setSuggestions(mapped);
        setShowSuggestions(true);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [isUrdu]);

  const handleSelectSuggestion = (s: Suggestion) => {
    setSearchQuery(s.description);
    setSuggestions([]);
    setShowSuggestions(false);
    setLocationError(null);
    onAddressChange(s.description, s.lat, s.lng);
    setIsConfirmed(true);
  };

  const handleCitySelect = (city: (typeof popularCities)[0]) => {
    const address = isUrdu ? `${city.nameUrdu}، پاکستان` : `${city.name}, Pakistan`;
    setSearchQuery(address);
    setLocationError(null);
    onAddressChange(address, city.lat, city.lng);
    setIsConfirmed(true);
  };

  // ── FREE reverse geocode via Nominatim ────────────────────────────────────
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": isUrdu ? "ur" : "en" } }
      );
      const data = await res.json();
      return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  // ── Use Current Location (browser geolocation — FREE, no API key) ─────────
  const handleUseCurrentLocation = async () => {
    setLocationError(null);

    // 1. HTTPS check
    if (!window.isSecureContext) {
      setLocationError(labels.httpsRequired);
      return;
    }

    // 2. Browser support check
    if (!("geolocation" in navigator)) {
      setLocationError(labels.unsupported);
      return;
    }

    // 3. Already blocked
    if (permissionState === "denied") {
      setLocationError(labels.locationDenied);
      return;
    }

    setIsLocating(true);

    const tryPosition = (options: PositionOptions) =>
      new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      );

    try {
      // First try: high accuracy
      let position: GeolocationPosition;
      try {
        position = await tryPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      } catch {
        // Fallback: low accuracy (works better on desktop)
        position = await tryPosition({ enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 });
      }

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      setSearchQuery(address);
      onAddressChange(address, latitude, longitude);
      setIsConfirmed(true);
      setLocationError(null);
    } catch (err: any) {
      // Map error codes to friendly messages
      const code = (err as GeolocationPositionError).code;
      if (code === 1) setLocationError(labels.locationDenied);        // PERMISSION_DENIED
      else if (code === 2) setLocationError(labels.locationUnavailable); // POSITION_UNAVAILABLE
      else if (code === 3) setLocationError(labels.locationTimeout);     // TIMEOUT
      else setLocationError(labels.locationUnavailable);
    } finally {
      setIsLocating(false);
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setSearchQuery("");
    setLocationError(null);
    setSuggestions([]);
    onAddressChange("", 0, 0);
  };

  // ── FREE map embed via OpenStreetMap ──────────────────────────────────────
  const mapSrc =
    homeLat && homeLng
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${homeLng - 0.05},${homeLat - 0.05},${homeLng + 0.05},${homeLat + 0.05}&layer=mapnik&marker=${homeLat},${homeLng}`
      : null;

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-xl font-bold text-heading">{labels.title}</h2>
        <p className="text-paragraph text-sm mt-1">{labels.subtitle}</p>
      </div>

      {/* Search Box */}
      <div ref={wrapperRef} className="relative">
        <div className="relative">
          <Search
            className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-paragraph`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={labels.searchPlaceholder}
            className={`w-full ${isUrdu ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
          {isSearching && (
            <Loader2
              className={`absolute ${isUrdu ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-paragraph animate-spin`}
            />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.length === 0 ? (
              <p className="text-sm text-paragraph px-4 py-3">{labels.noResults}</p>
            ) : (
              suggestions.map((s) => (
                <button
                  key={s.placeId}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-border last:border-0 flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 text-paragraph shrink-0 mt-0.5" />
                  <span className="text-sm text-heading leading-snug">{s.description}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Use Current Location */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-tertiary/40 rounded-lg text-tertiary hover:bg-tertiary/5 transition-colors disabled:opacity-60"
      >
        {isLocating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Crosshair className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">
          {isLocating ? labels.locating : labels.useCurrentLocation}
        </span>
      </button>

      {/* Location error */}
      {locationError && (
        <p className="text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {locationError}
        </p>
      )}

      {/* Popular Cities — shown when not confirmed */}
      {!isConfirmed && (
        <div>
          <p className="text-xs font-semibold text-paragraph mb-3">{labels.popularCities}</p>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="px-4 py-2 bg-white border border-border rounded-full text-sm text-heading hover:border-tertiary hover:bg-tertiary/5 transition-all"
              >
                {isUrdu ? city.nameUrdu : city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Address */}
      {isConfirmed && homeAddress && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-xs font-semibold text-green-700">{labels.confirmedAddress}</p>
          </div>
          <p className="text-sm text-green-800 font-medium leading-snug">{homeAddress}</p>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-green-600 hover:underline mt-2"
          >
            {labels.changeAddress}
          </button>
        </div>
      )}

      {/* FREE OpenStreetMap embed — no API key needed */}
      {isConfirmed && mapSrc && (
        <div className="h-48 rounded-lg border border-border overflow-hidden">
          <iframe
            title="map"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      )}

      {errors.homeAddress && (
        <p className="text-red-500 text-xs">{errors.homeAddress}</p>
      )}
    </div>
  );
}