"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BookingForm } from "@/components/customer/booking-form";
import { WorkerSelection } from "@/components/customer/worker-selection";
import { getServiceById } from "@/api/services/services";
import { getVerifiedWorkers } from "@/api/services/workers";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { WorkerDetail } from "@/types/worker";

interface BookingPageProps {
  serviceId: string;
}

interface CustomerWorkerService {
  id: number;
  name: string;
}

interface CustomerWorkerApi {
  id: string;
  workerId?: string;
  fullName: string;
  services?: CustomerWorkerService[];
  averageRating?: number;
  totalJobsCompleted?: number;
  visitingCharges?: number;
  isOnline: boolean;
  verificationStatus: string;
  bio?: string | null;
  experienceYears?: number;
  profilePicUrl?: string | null;
  homeLat?: number;
  homeLng?: number;
}

export default function BookingPage({ serviceId }: BookingPageProps) {
  const searchParams = useSearchParams();
  const workerId = searchParams.get("workerId");
  
  const [serviceName, setServiceName] = useState("");
  const [workers, setWorkers] = useState<WorkerDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const numericServiceId = parseInt(serviceId);
        
        // Load Service details
        const serviceData = await getServiceById(numericServiceId);
        setServiceName(serviceData.name);

        // Load workers only if no worker is selected yet
        if (!workerId) {
          const backendWorkers = await getVerifiedWorkers(0, 10, numericServiceId);
          
          const customerWorkers = (
            backendWorkers as unknown as CustomerWorkerApi[]
          ).filter((worker) =>
            worker.services?.some((service) => service.id === numericServiceId)
          );
          const mapped: WorkerDetail[] = customerWorkers.map((w) => ({
            id: w.workerId || w.id,
            name: w.fullName,
            category: serviceData.name,
            rating: w.averageRating || 5.0,
            reviewCount: w.totalJobsCompleted || 0,
            distance: 1.5,
            visitingFee: w.visitingCharges || 1000,
            isOnline: w.isOnline,
            isVerified: w.verificationStatus === "APPROVED",
            bio: w.bio || "Available for booking",
            experienceYears: w.experienceYears || 1,
            specializations: [serviceData.name],
            services: [{
              id: serviceData.id.toString(),
              name: serviceData.name,
              price: w.visitingCharges || 1000
            }],
            reviews: [],
            profileImage: w.profilePicUrl,
            location: {
              lat: w.homeLat || 24.8607,
              lng: w.homeLng || 67.0011,
            }
          }));
          
          setWorkers(mapped);
        }
      } catch (error) {
        console.error("Error loading booking flow data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId, workerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
      </div>
    );
  }

  // If no workerId, show worker selection
  if (!workerId) {
    return (
      <>
        <WorkerSelection 
          serviceId={serviceId} 
          serviceName={serviceName}
          workers={workers}
        />
        <FloatingButtons />
      </>
    );
  }

  // If workerId provided, show booking form
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
