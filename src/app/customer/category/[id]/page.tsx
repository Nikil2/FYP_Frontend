import CategoryPage from "@/containers/customer/category-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryRoutePage({ params }: PageProps) {
  const { id } = await params;
  return <CategoryPage categoryId={id} />;
}
