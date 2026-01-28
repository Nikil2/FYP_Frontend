"use client";
import Image from "next/image";

import { Search, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

import HeroImg from "../../../public/images/hero-img03.png";

import { useScrollReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";

import { SERVICES } from "@/content/landing/landing-page-content";

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal();

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

            {/* Search Bar */}
            <div className="bg-card border border-border rounded-lg p-2 shadow-lg flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r lg:border-r-0 lg:border-b xl:border-b-0 xl:border-r border-border">
                <Search className="w-5 h-5 text-paragraph flex-shrink-0" />
                <select className="flex-1 bg-transparent outline-none text-paragraph">
                  <option>Select Service</option>
                  {SERVICES.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2 px-3 py-2">
                <MapPin className="w-5 h-5 text-paragraph flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="flex-1 bg-transparent outline-none text-paragraph placeholder:text-muted-foreground"
                />
              </div>

              <Button variant="tertiary" size="md" className="sm:w-auto">
                Search
              </Button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg">
                Find a Worker
              </Button>
              <Button variant="outline" size="lg">
                Start Earning
              </Button>
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
