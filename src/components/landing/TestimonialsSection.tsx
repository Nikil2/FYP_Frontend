"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TESTIMONIALS } from "@/content/landing/landing-page-content";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

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
              What Our Users Say
            </h2>
            <p className="text-lg text-paragraph max-w-2xl mx-auto">
              Trusted by thousands of customers and workers across Pakistan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="relative">
              <div className="text-center space-y-6 py-8">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-tertiary/20 flex items-center justify-center mx-auto text-3xl">
                  {currentTestimonial.name.charAt(0)}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl text-heading font-medium max-w-2xl mx-auto">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < currentTestimonial.rating
                          ? "fill-tertiary text-tertiary"
                          : "text-muted",
                      )}
                    />
                  ))}
                </div>

                {/* Name & City */}
                <div>
                  <div className="font-semibold text-heading text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-paragraph">
                    {currentTestimonial.city}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted hover:bg-muted-hover animation-standard flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted hover:bg-muted-hover animation-standard flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </Card>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full animation-standard",
                    index === currentIndex ? "bg-tertiary w-8" : "bg-muted",
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
