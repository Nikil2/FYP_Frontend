"use client";

import { useState, useEffect } from "react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { PromoBanner } from "@/components/customer/promo-banner";
import { CitySelector } from "@/components/customer/city-selector";
import { WeeklyOffers } from "@/components/customer/weekly-offers";
import { PopularServices } from "@/components/customer/popular-services";
import { ServiceCategories } from "@/components/customer/service-categories";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { getCurrentCustomer } from "@/app/dummy/dummy-customers";

export default function CustomerHome() {
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [userName, setUserName] = useState("Guest User");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const customer = getCurrentCustomer();
    if (customer) {
      setUserName(customer.profile.name);
      setNotificationCount(
        customer.notifications.filter((n) => !n.read).length
      );
      // Set city from customer profile
      setSelectedCity(customer.profile.city.toLowerCase());
    }
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

      {/* Weekly Offers - Commented out for now */}
      {/* <WeeklyOffers /> */}

      {/* Popular Services */}
      <PopularServices />

      {/* Service Categories */}
      <ServiceCategories />

      {/* Floating WhatsApp + Phone Buttons */}
      <FloatingButtons />
    </div>
  );
}
