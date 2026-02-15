"use client";

import { BookingForm } from "@/components/customer/booking-form";
import { getServiceItemById } from "@/lib/customer-data";
import { FloatingButtons } from "@/components/customer/floating-buttons";

interface BookingFormPageProps {
  serviceId: string;
  workerId?: string;
}

export default function BookingFormPage({ serviceId, workerId }: BookingFormPageProps) {
  const service = getServiceItemById(serviceId);

  if (!service) {
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
        serviceId={service.id} 
        serviceName={service.name}
        workerId={workerId}
      />
      <FloatingButtons />
    </>
  );
}
