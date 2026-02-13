"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Search, Crosshair, Loader2 } from "lucide-react";

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
}

export function StepAddressLocation({ homeAddress, homeLat, homeLng, onAddressChange, errors, lang }: Props) {
  const [searchQuery, setSearchQuery] = useState(homeAddress);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(!!homeAddress);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isUrdu = lang === "ur";

  const t = {
    en: {
      title: "Your Work Location",
      subtitle: "This helps customers near you find your services",
      searchPlaceholder: "Search your area, city or address...",
      useCurrentLocation: "Use Current Location",
      confirmedAddress: "Confirmed Address",
      changeAddress: "Change Address",
      confirmThis: "Confirm This Location",
      popularCities: "Popular Cities",
    },
    ur: {
      title: "آپ کا کام کا مقام",
      subtitle: "اس سے آپ کے قریبی کسٹمرز آپ کو تلاش کر سکیں گے",
      searchPlaceholder: "اپنا علاقہ، شہر یا پتہ تلاش کریں...",
      useCurrentLocation: "موجودہ مقام استعمال کریں",
      confirmedAddress: "تصدیق شدہ پتہ",
      changeAddress: "پتہ تبدیل کریں",
      confirmThis: "اس مقام کی تصدیق کریں",
      popularCities: "مشہور شہر",
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

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock search - simulates Google Places API autocomplete
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsConfirmed(false);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      // Mock suggestions - replace with Google Places API
      const mockSuggestions: Suggestion[] = [
        { placeId: "1", description: `${query}, Karachi, Pakistan` },
        { placeId: "2", description: `${query}, Lahore, Pakistan` },
        { placeId: "3", description: `${query}, Islamabad, Pakistan` },
        { placeId: "4", description: `${query} Block, DHA, Karachi` },
        { placeId: "5", description: `${query} Town, Gulshan, Karachi` },
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    // Mock lat/lng - replace with geocoding
    onAddressChange(suggestion.description, 24.8607, 67.0011);
    setIsConfirmed(true);
  };

  const handleCitySelect = (city: typeof popularCities[0]) => {
    const address = `${isUrdu ? city.nameUrdu : city.name}, Pakistan`;
    setSearchQuery(address);
    onAddressChange(address, city.lat, city.lng);
    setIsConfirmed(true);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocode - replace with Google Geocoding API
          const address = "Your Current Location, Pakistan";
          setSearchQuery(address);
          onAddressChange(address, latitude, longitude);
          setIsConfirmed(true);
          setIsSearching(false);
        },
        () => {
          setIsSearching(false);
        }
      );
    }
  };

  return (
    <div className="space-y-5" dir={isUrdu ? "rtl" : "ltr"}>
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
          <Search className={`absolute ${isUrdu ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-paragraph`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={labels.searchPlaceholder}
            className={`w-full ${isUrdu ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent bg-white`}
          />
          {isSearching && (
            <Loader2 className={`absolute ${isUrdu ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-paragraph animate-spin`} />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((s) => (
              <button
                key={s.placeId}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-border last:border-0 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-paragraph shrink-0" />
                <span className="text-sm text-heading">{s.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Use Current Location */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-tertiary/40 rounded-lg text-tertiary hover:bg-tertiary/5 transition-colors"
      >
        <Crosshair className="w-5 h-5" />
        <span className="text-sm font-medium">{labels.useCurrentLocation}</span>
      </button>

      {/* Popular Cities */}
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
          <p className="text-xs font-semibold text-green-700 mb-1">{labels.confirmedAddress}</p>
          <p className="text-sm text-green-800 font-medium">{homeAddress}</p>
          <button
            type="button"
            onClick={() => { setIsConfirmed(false); setSearchQuery(""); onAddressChange("", 0, 0); }}
            className="text-xs text-green-600 hover:underline mt-2"
          >
            {labels.changeAddress}
          </button>
        </div>
      )}

      {/* Map Placeholder */}
      {isConfirmed && (
        <div className="h-40 bg-gray-100 rounded-lg border border-border flex items-center justify-center">
          <div className="text-center text-paragraph">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-tertiary" />
            <p className="text-xs">Map will display here (Google Maps API)</p>
            <p className="text-xs mt-1">Lat: {homeLat.toFixed(4)}, Lng: {homeLng.toFixed(4)}</p>
          </div>
        </div>
      )}

      {errors.homeAddress && <p className="text-red-500 text-xs">{errors.homeAddress}</p>}
    </div>
  );
}
