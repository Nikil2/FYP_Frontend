import type { Metadata } from "next";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Users, MapPin, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Mehnati",
  description:
    "Learn about Mehnati's mission to connect Pakistani households with verified, skilled workers.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Verification",
    description:
      "Every worker on Mehnati is CNIC-verified before they can accept a single job, so customers always know who is coming to their door.",
  },
  {
    icon: Users,
    title: "Fair for Both Sides",
    description:
      "Transparent price negotiation means customers get fair rates and workers get paid what their skill is worth.",
  },
  {
    icon: MapPin,
    title: "Built for Pakistan",
    description:
      "From bilingual support in English and Urdu to local pricing norms, Mehnati is designed around how services actually get booked here.",
  },
  {
    icon: Target,
    title: "Reliability",
    description:
      "Real-time job tracking and a clear booking flow keep both customers and workers on the same page from request to completion.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        title="About Mehnati"
        description="Pakistan's trusted marketplace for connecting customers with skilled, verified workers."
      />

      <section className="section-padding-standard">
        <div className="layout-standard max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-paragraph">
            Finding a reliable electrician, plumber, or carpenter shouldn&apos;t
            mean asking around the neighborhood and hoping for the best.
            Mehnati was built to make hiring skilled workers as simple and
            trustworthy as ordering food online &mdash; with verified
            identities, transparent pricing, and real accountability on both
            sides.
          </p>
        </div>
      </section>

      <section className="section-padding-standard bg-secondary-background">
        <div className="layout-standard">
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-10 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-tertiary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-heading mb-1">
                        {value.title}
                      </h3>
                      <p className="text-paragraph">{value.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
