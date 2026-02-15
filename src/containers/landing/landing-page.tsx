import { HeroSection } from "@/components/landing/HeroSection";
import { ServiceHub } from "@/components/landing/ServiceHub";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FinalCTA } from "@/components/landing/FinalCTA";

function LandingPage() {
  return (
    <section>
      <HeroSection />

      {/* Core app content: offers, services, categories, workers */}
      <ServiceHub />

      <HowItWorks />

      <FinalCTA />
    </section>
  );
}

export default LandingPage;
