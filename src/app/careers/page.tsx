import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Headset, Megaphone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers - Mehnati",
  description:
    "Join the Mehnati team and help build Pakistan's trusted marketplace for skilled workers.",
};

const openRoles = [
  {
    icon: Code2,
    title: "Full Stack Engineer",
    location: "Remote / Lahore",
    type: "Full-time",
  },
  {
    icon: ShieldCheck,
    title: "Worker Verification Specialist",
    location: "Karachi",
    type: "Full-time",
  },
  {
    icon: Headset,
    title: "Customer Support Associate",
    location: "Remote",
    type: "Full-time",
  },
  {
    icon: Megaphone,
    title: "Growth & Marketing Associate",
    location: "Lahore",
    type: "Part-time",
  },
];

export default function CareersPage() {
  return (
    <main>
      <PageHeader
        title="Careers at Mehnati"
        description="Help us connect skilled workers with the customers who need them, across every city in Pakistan."
      />

      <section className="section-padding-standard">
        <div className="layout-standard max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            Why Work With Us
          </h2>
          <p className="text-lg text-paragraph">
            We&apos;re a small, focused team solving a real problem for
            millions of households and workers across Pakistan. You&apos;ll
            get ownership over your work, direct impact on the product, and a
            team that cares about doing right by both sides of the
            marketplace.
          </p>
        </div>

        <div className="layout-standard">
          <h3 className="text-xl font-bold text-heading mb-6">Open Roles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {openRoles.map((role) => {
              const Icon = role.icon;
              return (
                <Card key={role.title} hover>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-tertiary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-heading mb-1">
                        {role.title}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{role.location}</Badge>
                        <Badge variant="tertiary">{role.type}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-paragraph mb-4">
              Don&apos;t see a role that fits? We&apos;d still love to hear
              from you.
            </p>
            <Link href="/contact">
              <Button variant="tertiary">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
