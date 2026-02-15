import BookingPage from "@/containers/customer/booking-page";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function BookingRoutePage({ params }: PageProps) {
  const { serviceId } = await params;
  return <BookingPage serviceId={serviceId} />;
}
