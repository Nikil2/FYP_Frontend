"use client";

import { useState, useRef } from "react";
import { WorkerCard } from "./WorkerCard";
import { TOP_WORKERS } from "@/content/landing/landing-page-content";
import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export function TopRatedWorkers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isVisible } = useScrollReveal();
  const carouselRef = useRef<HTMLDivElement>(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const maxIndex = Math.max(0, TOP_WORKERS.length - itemsPerView.desktop);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="section-padding-standard py-16 md:py-20">
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
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-heading mb-2">
                Top Rated Workers
              </h2>
              <p className="text-paragraph">
                Highly rated professionals ready to serve you
              </p>
            </div>

            <div className="flex items-center gap-5 mr-14">
              {/* Navigation Arrows (Desktop) */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={cn(
                    "w-10 h-10 rounded-full border border-border flex items-center justify-center animation-standard text-heading",
                    currentIndex === 0
                      ? "opacity-50 cursor-not-allowed bg-muted/50"
                      : "hover:bg-muted bg-card",
                  )}
                  aria-label="Previous workers"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= maxIndex}
                  className={cn(
                    "w-10 h-10 rounded-full border border-border flex items-center justify-center animation-standard text-heading",
                    currentIndex >= maxIndex
                      ? "opacity-50 cursor-not-allowed bg-muted/50"
                      : "hover:bg-muted bg-card",
                  )}
                  aria-label="Next workers"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              {/* 
              <a
                href="/workers"
                className="hidden md:flex items-center gap-2 text-tertiary hover:text-tertiary-hover animation-standard font-medium"
              >
                View All
                <ArrowRight className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel */}
            <div className="overflow-hidden" ref={carouselRef}>
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop + 1.5)}%)`,
                }}
              >
                {TOP_WORKERS.map((worker, index) => (
                  <div
                    key={worker.id}
                    className={cn(
                      "flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] transition-all duration-500",
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10",
                    )}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <WorkerCard worker={worker} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator - Mobile/Tablet */}
            <div className="flex lg:hidden items-center justify-center gap-2 mt-6">
              {Array.from({
                length: Math.ceil(TOP_WORKERS.length / itemsPerView.mobile),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full animation-standard",
                    index === currentIndex ? "bg-tertiary w-8" : "bg-muted",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Link - Mobile */}
          <div className="md:hidden mt-6 text-center">
            <a
              href="/workers"
              className="inline-flex items-center gap-2 text-tertiary hover:text-tertiary-hover animation-standard font-medium"
            >
              View All Workers
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
