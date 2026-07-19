"use client";

import { useState, useEffect, useCallback } from "react";
import { WorkerSelection } from "@/components/customer/worker-selection";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import { getServiceById } from "@/api/services/services";
import { getVerifiedWorkers } from "@/api/services/workers";
import { useCustomerLocation } from "@/hooks/useCustomerLocation";
import {
  LocationPicker,
  type ActiveLocation,
} from "@/components/customer/location-picker";
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
  distanceKm?: number;
}

const RADIUS_OPTIONS = [5, 10, 20, 50];
const DEFAULT_RADIUS_KM = 10;

export default function WorkersPage({ serviceId }: WorkersPageProps) {
  const numericServiceId = parseInt(serviceId);

  const [service, setService] = useState<{ id: number; name: string } | null>(null);
  const [workers, setWorkers] = useState<WorkerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);

  const {
    status: gpsStatus,
    coords: gpsCoords,
    areaName: gpsAreaName,
    request: requestLocation,
  } = useCustomerLocation();

  // A saved address, when the customer picks one, overrides the GPS reading.
  const [savedChoice, setSavedChoice] = useState<ActiveLocation | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const coords = savedChoice ?? gpsCoords;
  const areaName = savedChoice ? savedChoice.name : gpsAreaName;
  // A chosen address gives us coordinates even if the browser blocked GPS.
  const locationStatus = savedChoice ? "granted" : gpsStatus;

  const mapWorkers = useCallback(
    (apiWorkers: CustomerWorkerApi[], serviceName: string): WorkerDetail[] =>
      apiWorkers
        .filter((worker) =>
          worker.services?.some((s) => s.id === numericServiceId)
        )
        .map((w) => {
          const matchedService = w.services?.find((s) => s.id === numericServiceId);
          const servicePrice = matchedService?.price || 0;

          return {
            id: w.workerId || w.id,
            name: w.fullName,
            category: serviceName,
            rating: w.averageRating || 5.0,
            reviewCount: w.totalJobsCompleted || 0,
            distance: w.distanceKm ?? 0,
            // The call-out fee — distinct from the per-service work price below.
            visitingFee: w.visitingCharges || 0,
            isOnline: w.isOnline,
            isVerified: w.verificationStatus === "APPROVED",
            bio: w.bio || "Available for booking",
            experienceYears: w.experienceYears || 1,
            specializations: [serviceName],
            services: [
              {
                id: numericServiceId.toString(),
                name: serviceName,
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

  // Load the service once.
  useEffect(() => {
    getServiceById(numericServiceId)
      .then(setService)
      .catch((error) => console.error("Error loading service:", error));
  }, [numericServiceId]);

  // Fetch workers whenever the service, location, or radius changes.
  useEffect(() => {
    // Wait for both the service and the location probe to settle, so we don't
    // fetch everything and then immediately refetch nearby.
    if (!service || locationStatus === "detecting") return;

    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const location =
          locationStatus === "granted" && coords
            ? { lat: coords.lat, lng: coords.lng, radiusKm }
            : undefined;

        const apiWorkers = await getVerifiedWorkers(
          0,
          50,
          numericServiceId,
          undefined,
          location
        );

        setWorkers(
          mapWorkers(apiWorkers as unknown as CustomerWorkerApi[], service.name)
        );
      } catch (error) {
        console.error("Error loading workers:", error);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [service, coords, radiusKm, locationStatus, numericServiceId, mapWorkers]);

  if (loading && workers.length === 0) {
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
        serviceName={service?.name ?? ""}
        workers={workers}
        locationStatus={locationStatus}
        areaName={areaName}
        radiusKm={radiusKm}
        radiusOptions={RADIUS_OPTIONS}
        onRadiusChange={setRadiusKm}
        onEnableLocation={requestLocation}
        onChangeLocation={() => setPickerOpen(true)}
      />

      <LocationPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        active={
          savedChoice ??
          (gpsCoords
            ? {
                ...gpsCoords,
                name: gpsAreaName ?? "Current location",
                source: "gps",
              }
            : null)
        }
        gpsAreaName={gpsAreaName}
        gpsAvailable={gpsStatus !== "unsupported"}
        onUseCurrentLocation={() => {
          setSavedChoice(null);
          requestLocation();
        }}
        onSelectSaved={setSavedChoice}
      />

      <FloatingButtons />
    </>
  );
}
