import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Radio, MessageSquare, Wallet, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works for Workers - Mehnati",
  description:
    "Learn how to register, get verified, and start earning as a skilled worker on Mehnati.",
};

const steps = [
  {
    icon: Upload,
    title: "Create Your Profile",
    description:
      "Sign up and upload your CNIC along with details about your trade, experience, and service area.",
  },
  {
    icon: Star,
    title: "Get Verified",
    description:
      "Our admin team reviews your CNIC and profile to confirm your identity before you go live.",
  },
  {
    icon: Radio,
    title: "Go Online",
    description:
      "Set your availability and start receiving job requests from customers near you.",
  },
  {
    icon: MessageSquare,
    title: "Negotiate & Accept",
    description:
      "Chat with customers, agree on a fair price, and confirm the job details before you start.",
  },
  {
    icon: Wallet,
    title: "Get Paid",
    description:
      "Complete the job, collect payment, and build your rating with every satisfied customer.",
  },
];

export default function WorkersHowItWorksPage() {
  return (
    <main>
      <PageHeader
        title="How It Works for Workers"
        description="From sign-up to your first job in five simple steps."
      />

      <section className="section-padding-standard">
        <div className="layout-standard max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary text-tertiary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-tertiary" />
                      <h3 className="text-lg font-semibold text-heading">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-paragraph">{step.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="layout-standard text-center mt-12">
          <Link href="/auth/signup/worker">
            <Button variant="tertiary" size="lg">
              Register as a Worker
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
