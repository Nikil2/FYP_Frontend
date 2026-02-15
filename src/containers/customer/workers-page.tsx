"use client";

import { getServiceItemById } from "@/lib/customer-data";
import { getWorkersForService } from "@/lib/mock-bookings";
import { WorkerSelection } from "@/components/customer/worker-selection";
import { FloatingButtons } from "@/components/customer/floating-buttons";

interface WorkersPageProps {
  serviceId: string;
}

export default function WorkersPage({ serviceId }: WorkersPageProps) {
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

  const workers = getWorkersForService(serviceId);

  return (
    <>
      <WorkerSelection 
        serviceId={service.id} 
        serviceName={service.name}
        workers={workers}
      />
      <FloatingButtons />
    </>
  );
}
