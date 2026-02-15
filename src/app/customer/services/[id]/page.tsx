import ServiceListPage from "@/containers/customer/service-list-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceListRoutePage({ params }: PageProps) {
  const { id } = await params;
  return <ServiceListPage subCategoryId={id} />;
}
