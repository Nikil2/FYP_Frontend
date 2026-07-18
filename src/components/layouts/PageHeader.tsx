interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="bg-secondary-background pt-28 md:pt-36 pb-16 md:pb-20">
      <div className="layout-standard text-center">
        <div className="w-12 h-1.5 rounded-full bg-tertiary mx-auto mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-heading mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-paragraph max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
