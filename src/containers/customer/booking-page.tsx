"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  price?: number;
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
  distanceKm?: number;
}

type LocationStatus = "detecting" | "granted" | "denied";

const RADIUS_OPTIONS = [5, 10, 20, 50];
const DEFAULT_RADIUS_KM = 10;

export default function BookingPage({ serviceId }: BookingPageProps) {
  const searchParams = useSearchParams();
  const workerId = searchParams.get("workerId");
  const numericServiceId = parseInt(serviceId);

  const [serviceName, setServiceName] = useState("");
  const [workers, setWorkers] = useState<WorkerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("detecting");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);

  const mapWorkers = useCallback(
    (apiWorkers: CustomerWorkerApi[], name: string): WorkerDetail[] =>
      apiWorkers
        .filter((worker) =>
          worker.services?.some((service) => service.id === numericServiceId)
        )
        .map((w) => {
          const matchedService = w.services?.find(
            (s) => s.id === numericServiceId
          );
          const servicePrice = matchedService?.price || 0;

          return {
            id: w.workerId || w.id,
            name: w.fullName,
            category: name,
            rating: w.averageRating || 5.0,
            reviewCount: w.totalJobsCompleted || 0,
            distance: w.distanceKm ?? 0,
            // The call-out fee — distinct from the per-service work price.
            visitingFee: w.visitingCharges || 0,
            isOnline: w.isOnline,
            isVerified: w.verificationStatus === "APPROVED",
            bio: w.bio || "Available for booking",
            experienceYears: w.experienceYears || 1,
            specializations: [name],
            services: [
              {
                id: numericServiceId.toString(),
                name,
                price: servicePrice,
              },
            ],
            reviews: [],
            profileImage: w.profilePicUrl,
            location: {
              lat: w.homeLat || 24.8607,
              lng: w.homeLng || 67.0011,
            },
          };
        }),
    [numericServiceId]
  );

  // Ask for the customer's location once, on mount. Skipped when a worker is
  // already chosen, since we go straight to the booking form.
  useEffect(() => {
    if (workerId) return;

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [workerId]);

  useEffect(() => {
    // Wait for the location probe to settle before fetching the list, so we
    // don't fetch everything and then immediately refetch nearby.
    if (!workerId && locationStatus === "detecting") return;

    const loadData = async () => {
      setLoading(true);
      try {
        const serviceData = await getServiceById(numericServiceId);
        setServiceName(serviceData.name);

        // Load workers only if no worker is selected yet
        if (!workerId) {
          const location =
            locationStatus === "granted" && coords
              ? { lat: coords.lat, lng: coords.lng, radiusKm }
              : undefined;

          const backendWorkers = await getVerifiedWorkers(
            0,
            50,
            numericServiceId,
            undefined,
            location
          );

          setWorkers(
            mapWorkers(
              backendWorkers as unknown as CustomerWorkerApi[],
              serviceData.name
            )
          );
        }
      } catch (error) {
        console.error("Error loading booking flow data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    numericServiceId,
    workerId,
    coords,
    radiusKm,
    locationStatus,
    mapWorkers,
  ]);

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
          locationEnabled={locationStatus === "granted"}
          radiusKm={radiusKm}
          radiusOptions={RADIUS_OPTIONS}
          onRadiusChange={setRadiusKm}
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
