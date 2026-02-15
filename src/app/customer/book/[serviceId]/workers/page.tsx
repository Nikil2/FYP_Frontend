import WorkersPage from "@/containers/customer/workers-page";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function WorkersRoutePage({ params }: PageProps) {
  const { serviceId } = await params;
  return <WorkersPage serviceId={serviceId} />;
}
