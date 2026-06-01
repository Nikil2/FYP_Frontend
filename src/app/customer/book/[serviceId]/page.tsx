import { Suspense } from "react";

import BookingPage from "@/containers/customer/booking-page";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function BookingRoutePage({ params }: PageProps) {
  const { serviceId } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full" />
        </div>
      }
    >
      <BookingPage serviceId={serviceId} />
    </Suspense>
  );
}
