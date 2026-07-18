import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import * as Icons from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Services - Mehnati",
  description:
    "Explore all service categories available on Mehnati, from electricians to home cleaners.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        title="Browse Services"
        description="Verified professionals for every job around your home."
      />

      <section className="section-padding-standard">
        <div className="layout-standard grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = Icons[
              category.icon as keyof typeof Icons
            ] as Icons.LucideIcon;

            return (
              <Card key={category.id}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon className="w-7 h-7 text-tertiary" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-heading">
                      {category.name}
                    </h2>
                    <p className="text-sm text-paragraph">
                      {category.nameUrdu}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.subServices.map((sub) => (
                    <Badge key={sub.id}>{sub.name}</Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="layout-standard text-center mt-12">
          <p className="text-paragraph mb-4">
            Ready to book a skilled worker for your job?
          </p>
          <Link href="/auth/signup/customer">
            <Button variant="tertiary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
