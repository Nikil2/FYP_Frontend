"use client";

import { Card } from "@/components/ui/card";
import { FEATURES } from "@/content/landing/landing-page-content";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

export function FeaturesSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding-standard bg-secondary-background">
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
              Why Choose Mehnati?
            </h2>
            <p className="text-lg text-paragraph max-w-2xl mx-auto">
              The most trusted and secure platform for connecting with skilled
              workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = Icons[feature.icon as keyof typeof Icons] as any;
              return (
                <Card
                  key={index}
                  hover
                  className={cn(
                    "transition-all duration-500",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10",
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-lg bg-tertiary/10 flex items-center justify-center">
                      {Icon && <Icon className="w-7 h-7 text-tertiary" />}
                    </div>
                    <h3 className="text-xl font-semibold text-heading">
                      {feature.title}
                    </h3>
                    <p className="text-paragraph">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
