"use client";

import { STATS } from "@/content/landing/landing-page-content";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding-standard bg-[#96bf48]/10">
      <div className="layout-standard">
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
          )}
        >
          {STATS.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "text-center transition-all duration-500",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-5xl font-bold text-tertiary mb-2">
                {stat.value}
              </div>
              <div className="text-paragraph font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
