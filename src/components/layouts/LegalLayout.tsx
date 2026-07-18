import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <main>
      <PageHeader title={title} description={`Last updated: ${lastUpdated}`} />

      <section className="section-padding-standard">
        <div className="layout-standard max-w-3xl mx-auto">
          <Card className="p-8 md:p-10 space-y-8">{children}</Card>
        </div>
      </section>
    </main>
  );
}

interface LegalSectionProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-heading mb-2">
        <span className="text-tertiary">{number}.</span> {title}
      </h2>
      <p className="text-paragraph leading-relaxed">{children}</p>
    </div>
  );
}
