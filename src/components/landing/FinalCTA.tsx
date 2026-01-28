"use client";

import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding-standard relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 via-transparent to-primary/5" />

      <div className="layout-standard relative z-10">
        <div
          ref={ref}
          className={cn(
            "text-center space-y-8 max-w-3xl mx-auto transition-all duration-1000",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
          )}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-heading">
            Ready to Get Started?
          </h2>

          <p className="text-xl text-paragraph">
            Join thousands of satisfied customers and skilled workers across
            Pakistan
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="primary" size="lg" className="text-lg px-10 py-6">
              I Need a Worker
            </Button>
            <Button variant="tertiary" size="lg" className="text-lg px-10 py-6">
              I Want to Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
