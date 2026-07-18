import type { Metadata } from "next";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  MessageSquare,
  MapPin,
  CreditCard,
  Star,
  Flag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Tips - Mehnati",
  description:
    "Safety guidelines for customers booking skilled workers on Mehnati.",
};

const tips = [
  {
    icon: ShieldCheck,
    title: "Check the Verified Badge",
    description:
      "Every worker's CNIC is reviewed by our admin team. Look for the verified badge on a profile before booking.",
  },
  {
    icon: MessageSquare,
    title: "Keep Communication In-App",
    description:
      "Discuss job details and pricing through Mehnati's messaging so there's always a record of what was agreed.",
  },
  {
    icon: CreditCard,
    title: "Agree on Price Upfront",
    description:
      "Use the price negotiation feature to confirm the final rate before work begins &mdash; avoid paying in advance for work not yet done.",
  },
  {
    icon: MapPin,
    title: "Share Accurate Location",
    description:
      "Provide your correct address or saved location so the worker arrives at the right place without delays.",
  },
  {
    icon: Star,
    title: "Leave Honest Feedback",
    description:
      "Rating and reviewing workers after each job helps keep the marketplace trustworthy for everyone.",
  },
  {
    icon: Flag,
    title: "Report Any Issues",
    description:
      "If something feels wrong during a booking, use the complaint feature so our team can step in and help.",
  },
];

export default function SafetyPage() {
  return (
    <main>
      <PageHeader
        title="Safety Tips"
        description="A few simple guidelines to keep every booking safe and transparent."
      />

      <section className="section-padding-standard">
        <div className="layout-standard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card key={tip.title}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-tertiary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-paragraph">{tip.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
