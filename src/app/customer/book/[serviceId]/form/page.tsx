import BookingFormPage from "@/containers/customer/booking-form-page";

interface PageProps {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ workerId?: string }>;
}

export default async function FormRoutePage({ params, searchParams }: PageProps) {
  const { serviceId } = await params;
  const { workerId } = await searchParams;
  
  return <BookingFormPage serviceId={serviceId} workerId={workerId} />;
}
