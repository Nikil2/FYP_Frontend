import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

function LandingPage() {
  return (
    <section>
      <HeroSection />

      <StatsSection />

      <ServicesGrid />

      <HowItWorks />

      <FeaturesSection />

      <TestimonialsSection />

      <FinalCTA />
    </section>
  );
}

export default LandingPage;
