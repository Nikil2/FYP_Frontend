"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { WorkerHeader } from "@/components/worker-detail/worker-header";
import { WorkerAbout } from "@/components/worker-detail/worker-about";
import { ServicesList } from "@/components/worker-detail/services-list";
import { ReviewsSection } from "@/components/worker-detail/reviews-section";
import { BookingPanel } from "@/components/worker-detail/booking-panel";
import { ChatModal } from "@/components/modals/chat-modal";

import { getWorkerById } from "@/lib/mock-data";

import type { WorkerDetail } from "@/types/worker";

import { Container } from "@/components/ui/container";

export default function WorkerDetailPage() {
  const params = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get worker data from centralized mock data
    const workerId = params.id as string;
    const workerData = getWorkerById(workerId);
    setWorker(workerData);
    setIsLoading(false);
  }, [params.id]);

  // Handle loading state
  if (isLoading) {
    return (
      <main className="bg-background min-h-screen pt-20 md:pt-24 py-8 md:py-12">
        <Container>
          <div className="text-center space-y-4">
            <p className="text-paragraph">Loading worker details...</p>
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
