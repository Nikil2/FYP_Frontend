"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import HeroImg from "../../../public/images/hero-img03.png";

import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden">
      <div className="layout-standard">
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
          )}
        >
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight">
              Pakistan's Most Trusted Platform for{" "}
              <span className="text-tertiary">Skilled Workers</span>
            </h1>

            <p className="text-lg md:text-xl text-paragraph max-w-2xl">
              Connect with verified electricians, plumbers, carpenters & more in
              minutes. CNIC-verified, tracked, and trusted.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" onClick={() => scrollTo("browse-services")}>
                Browse Services
              </Button>
              <a href="/auth/signup/worker">
                <Button variant="outline" size="lg">
                  Start Earning
                </Button>
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="rounded-3xl flex-center">
              <Image
                src={HeroImg}
                alt="Hero-Image"
                className="rounded-3xl max-w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
