"use client";

import { useState, useEffect } from "react";
import { BookingForm } from "@/components/customer/booking-form";
import { getServiceById } from "@/api/services/services";
import { FloatingButtons } from "@/components/customer/floating-buttons";

interface BookingFormPageProps {
  serviceId: string;
  workerId?: string;
}

export default function BookingFormPage({ serviceId, workerId }: BookingFormPageProps) {
  const [serviceName, setServiceName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(parseInt(serviceId));
        setServiceName(data.name);
      } catch (error) {
        console.error("Error loading service details for booking form:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
      </div>
    );
  }

  if (!serviceName) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Service not found</p>
          <a href="/customer" className="text-tertiary text-sm hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <BookingForm 
        serviceId={serviceId} 
        serviceName={serviceName}
        workerId={workerId}
      />
      <FloatingButtons />
    </>
  );
}
