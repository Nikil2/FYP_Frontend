import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BadgeCheck,
  Banknote,
  TrendingUp,
  MapPin,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Worker Benefits - Mehnati",
  description:
    "Discover the benefits of working as a verified skilled worker on Mehnati.",
};

const benefits = [
  {
    icon: Clock,
    title: "Work on Your Schedule",
    description:
      "Go online whenever you're available and offline when you're not. You decide your own hours.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Badge",
    description:
      "CNIC verification earns you a trust badge that customers see before they even message you.",
  },
  {
    icon: Banknote,
    title: "Fair, Transparent Pricing",
    description:
      "Negotiate every job directly with the customer — no hidden cuts, no forced rates.",
  },
  {
    icon: MapPin,
    title: "Local Job Requests",
    description:
      "Get matched with customers near your service area so you spend less time traveling.",
  },
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description:
      "Discuss job details, share updates, and confirm pricing directly in the app.",
  },
  {
    icon: TrendingUp,
    title: "Build Your Reputation",
    description:
      "Every completed job adds to your rating and reviews, helping you win more work over time.",
  },
];

export default function WorkerBenefitsPage() {
  return (
    <main>
      <PageHeader
        title="Worker Benefits"
        description="Everything you gain by joining Mehnati as a verified worker."
      />

      <section className="section-padding-standard">
        <div className="layout-standard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} hover className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-tertiary" />
                  </div>
                  <h3 className="text-lg font-semibold text-heading">
                    {benefit.title}
                  </h3>
                  <p className="text-paragraph">{benefit.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="layout-standard text-center mt-12">
          <Link href="/auth/signup/worker">
            <Button variant="tertiary" size="lg">
              Join as a Worker
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
