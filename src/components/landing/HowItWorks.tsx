"use client";

import { Card } from "@/components/ui/card";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  FileText,
  MessageSquare,
  CheckCircle,
  Upload,
  Radio,
  Wallet,
} from "lucide-react";

const customerSteps = [
  {
    icon: FileText,
    title: "Post Your Job",
    description: "Describe the work you need done in detail",
  },
  {
    icon: MessageSquare,
    title: "Get Offers",
    description: "Chat with workers and negotiate the best price",
  },
  {
    icon: CheckCircle,
    title: "Hire & Rate",
    description: "Track your worker in real-time and leave feedback",
  },
];

const workerSteps = [
  {
    icon: Upload,
    title: "Register",
    description: "Upload your CNIC and get verified by our admin team",
  },
  {
    icon: Radio,
    title: "Go Online",
    description: "Receive nearby job requests based on your location",
  },
  {
    icon: Wallet,
    title: "Earn Money",
    description: "Complete jobs and build your reputation",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" className="section-padding-standard">
      <div className="layout-standard">
        <div
          ref={ref}
          className={cn(
            "transition-all duration-1000",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
          )}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
              How It Works
            </h2>
            <p className="text-lg text-paragraph max-w-2xl mx-auto">
              Simple steps to connect customers with skilled workers
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Customers */}
            <div>
              <h3 className="text-2xl font-bold text-heading mb-8 text-center lg:text-left">
                For Customers
              </h3>
              <div className="space-y-6">
                {customerSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card
                      key={index}
                      className={cn(
                        "transition-all duration-500",
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-10",
                      )}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-tertiary" />
                            <h4 className="text-lg font-semibold text-heading">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-paragraph">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* For Workers */}
            <div>
              <h3 className="text-2xl font-bold text-heading mb-8 text-center lg:text-left">
                For Workers
              </h3>
              <div className="space-y-6">
                {workerSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card
                      key={index}
                      className={cn(
                        "transition-all duration-500",
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-10",
                      )}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-tertiary text-tertiary-foreground flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <h4 className="text-lg font-semibold text-heading">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-paragraph">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
