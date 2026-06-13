"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { WorkerHeader } from "@/components/worker-detail/worker-header";
import { WorkerAbout } from "@/components/worker-detail/worker-about";
import { ServicesList } from "@/components/worker-detail/services-list";
import { ReviewsSection } from "@/components/worker-detail/reviews-section";
import { BookingPanel } from "@/components/worker-detail/booking-panel";
import { ChatModal } from "@/components/modals/chat-modal";

import { getWorkerDetails } from "@/api/services/workers";

import type { WorkerDetail } from "@/types/worker";

import { Container } from "@/components/ui/container";

export default function WorkerDetailPage() {
  const params = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        setIsLoading(true);
        const workerId = params.id as string;
        const data = await getWorkerDetails(workerId) as any;
        const mapped: WorkerDetail = {
          id: data.workerId || data.id,
          name: data.fullName,
          category: data.services && data.services.length > 0 ? data.services[0].name : "Service Worker",
          rating: data.averageRating || 5.0,
          reviewCount: data.totalJobsCompleted || 0,
          distance: 1.5,
          visitingFee: data.visitingCharges || 0,
          isOnline: data.isOnline,
          isVerified: data.verificationStatus === "APPROVED",
          bio: data.bio || "Available for booking",
          experienceYears: data.experienceYears || 1,
          specializations: data.services ? data.services.map((s: any) => s.name) : [],
          services: data.services ? data.services.map((s: any) => ({
            id: s.id.toString(),
            name: s.name,
            price: s.price || 0,
          })) : [],
          reviews: [],
          profileImage: data.profilePicUrl,
          location: {
            lat: data.homeLat || 24.8607,
            lng: data.homeLng || 67.0011,
          }
        };
        setWorker(mapped);
      } catch (error) {
        console.error("Failed to load worker details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchWorker();
    }
  }, [params.id]);

  // Handle loading state
  if (isLoading) {
    return (
      <main className="bg-background min-h-screen pt-20 md:pt-24 py-8 md:py-12">
        <Container>
          <div className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="bg-gray-200 rounded-2xl h-64 animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-3">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border border-border rounded-xl p-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-gray-200 rounded-2xl h-64 animate-pulse" />
              </div>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // Handle worker not found
  if (!worker) {
    return (
      <main className="bg-background min-h-screen flex-center pt-20 md:pt-24 py-8 md:py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-heading">
              Worker not found
            </h1>
            <p className="text-paragraph">
              The worker profile you're looking for doesn't exist.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-tertiary text-white rounded-lg hover:bg-tertiary-hover transition-colors"
            >
              Back to Home
            </a>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen pt-20 md:pt-24 py-8 md:py-12">
      <Container>
        <div className="space-y-8 md:space-y-12">
          {/* Worker Header with Booking Panel (Side by side on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Worker Header - Left side */}
            <div className="md:col-span-2">
              <WorkerHeader worker={worker} />
            </div>

            {/* Booking Panel - Right side (appears on mobile too) */}
            <div className="lg:hidden md:col-span-1">
              <BookingPanel
                worker={worker}
                onChatClick={() => setIsChatOpen(true)}
                staticLocation={{
                  address: "Karachi, Pakistan",
                  lat: 24.8607,
                  lng: 67.0011,
                }}
              />
            </div>
          </div>

          {/* Main Content + Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (70%) */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <WorkerAbout worker={worker} />

              {/* Services Section */}
              <ServicesList services={worker.services} />

              {/* Reviews Section */}
              <ReviewsSection reviews={worker.reviews} />
            </div>

            {/* Right Column (30%) - Sticky Sidebar for desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <BookingPanel
                  worker={worker}
                  onChatClick={() => setIsChatOpen(true)}
                  staticLocation={{
                    address: "Karachi, Pakistan",
                    lat: 24.8607,
                    lng: 67.0011,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Chat Modal */}
      <ChatModal
        worker={worker}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </main>
  );
}
