"use client";

import { useState, useEffect } from "react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { PromoBanner } from "@/components/customer/promo-banner";
import { CitySelector } from "@/components/customer/city-selector";
import { PopularServices } from "@/components/customer/popular-services";
import { ServiceCategories } from "@/components/customer/service-categories";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { getAuthUser } from "@/lib/auth";
import { getUnreadCount } from "@/api/services/notifications";

export default function CustomerHome() {
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [userName, setUserName] = useState("Guest User");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Get user from localStorage (set during login)
    const user = getAuthUser();
    if (user) {
      setUserName(user.fullName || "User");
    }

    // Fetch real notification count from API
    const fetchNotifications = async () => {
      try {
        const result = await getUnreadCount();
        setNotificationCount(result.unreadCount);
      } catch {
        // Silently fail — notifications are non-critical
        setNotificationCount(0);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <CustomerHeader
        userName={userName}
        notificationCount={notificationCount}
      />

      {/* Promo Banner */}
      <PromoBanner />

      {/* City Selector */}
      <CitySelector
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Popular Services */}
      <PopularServices />

      {/* Service Categories */}
      <ServiceCategories />

      {/* Floating WhatsApp + Phone Buttons */}
      <FloatingButtons />
    </div>
  );
}
