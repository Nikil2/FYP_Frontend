"use client";

import { Card } from "@/components/ui/card";
import { SERVICES } from "@/content/landing/landing-page-content";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

export function ServicesGrid() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="services"
      className="section-padding-standard py-16 md:py-20 bg-secondary-background"
    >
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
            <h2 className="text-3xl md:text-5xl font-bold text-heading mb-4">
              <span className="text-tertiary">Browse</span> Services
            </h2>
            <p className="text-lg text-paragraph max-w-2xl mx-auto">
              Find skilled professionals for all your home service needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = Icons[service.icon as keyof typeof Icons] as any;
              return (
                <Card
                  key={service.id}
                  hover
                  className={cn(
                    "text-center cursor-pointer transition-all duration-500",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10",
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center">
                      {Icon && <Icon className="w-8 h-8 text-tertiary" />}
                    </div>
                    <h3 className="text-xl font-semibold text-heading">
                      {service.name}
                    </h3>
                    <p className="text-paragraph">
                      Starting from{" "}
                      <span className="font-bold text-tertiary">
                        Rs. {service.startingPrice}
                      </span>
                    </p>
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
