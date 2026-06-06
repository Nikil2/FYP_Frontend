"use client";

import { useState, useEffect } from "react";
import { WorkerSelection } from "@/components/customer/worker-selection";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { getServiceById } from "@/api/services/services";
import { getVerifiedWorkers } from "@/api/services/workers";
import { WorkerDetail } from "@/types/worker";

interface WorkersPageProps {
  serviceId: string;
}

interface CustomerWorkerService {
  id: number;
  name: string;
  price: number;
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

export default function WorkersPage({ serviceId }: WorkersPageProps) {
  const [serviceName, setServiceName] = useState("");
  const [workers, setWorkers] = useState<WorkerDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceAndWorkers = async () => {
      try {
        const numericServiceId = parseInt(serviceId);
        
        // 1. Fetch Service Details
        const serviceData = await getServiceById(numericServiceId);
        setServiceName(serviceData.name);

        // 2. Fetch approved workers linked to this exact service in WorkerService.
        const backendWorkers = await getVerifiedWorkers(0, 10, numericServiceId);
        
        // 3. Map to WorkerDetail format for UI
        const customerWorkers = (
          backendWorkers as unknown as CustomerWorkerApi[]
        ).filter((worker) =>
          worker.services?.some((service) => service.id === numericServiceId)
        );
        const mapped: WorkerDetail[] = customerWorkers.map((w) => {
          const matchedService = w.services?.find((s) => s.id === numericServiceId);
          const servicePrice = matchedService?.price || 0;
          return {
            id: w.workerId || w.id,
            name: w.fullName,
            category: serviceData.name,
            rating: w.averageRating || 5.0,
            reviewCount: w.totalJobsCompleted || 0,
            distance: 0,
            visitingFee: servicePrice,
            isOnline: w.isOnline,
            isVerified: w.verificationStatus === "APPROVED",
            bio: w.bio || "Available for booking",
            experienceYears: w.experienceYears || 1,
            specializations: [serviceData.name],
            services: [{
              id: serviceData.id.toString(),
              name: serviceData.name,
              price: servicePrice,
            }],
            reviews: [],
            profileImage: w.profilePicUrl,
            location: {
              lat: w.homeLat || 24.8607,
              lng: w.homeLng || 67.0011,
            },
          };
        });

        setWorkers(mapped);
      } catch (error) {
        console.error("Error loading workers page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndWorkers();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
      </div>
    );
  }

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
