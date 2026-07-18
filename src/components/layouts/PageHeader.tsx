interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-secondary-background pt-32 md:pt-44 pb-16 md:pb-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_srgb,var(--tertiary)_15%,transparent),transparent)]"
        aria-hidden
      />
      <div className="relative layout-standard text-center">
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
