import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/layouts/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy - Mehnati",
  description: "How Mehnati collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 18, 2026">
      <LegalSection number={1} title="Information We Collect">
        We collect information you provide directly, such as your name, phone
        number, CNIC (for workers), profile photo, and booking details, as
        well as information generated while using the app, like messages and
        location for job matching.
      </LegalSection>

      <LegalSection number={2} title="How We Use Your Information">
        Your information is used to verify identities, match customers with
        nearby workers, facilitate bookings and payments negotiation, and
        improve the overall Mehnati experience.
      </LegalSection>

      <LegalSection number={3} title="CNIC & Verification Data">
        CNIC information submitted by workers is used solely for identity
        verification by our admin team and is not shared with customers or
        third parties beyond what is required for that verification.
      </LegalSection>

      <LegalSection number={4} title="Location Data">
        Location is used to match customers with nearby workers and to
        support real-time job tracking. You can control location sharing
        through your device settings.
      </LegalSection>

      <LegalSection number={5} title="Sharing of Information">
        We do not sell your personal information. Limited profile details
        (such as name, rating, and verification status) are shared between
        customers and workers to facilitate a booking.
      </LegalSection>

      <LegalSection number={6} title="Data Security">
        We take reasonable technical and organizational measures to protect
        your data from unauthorized access, loss, or misuse.
      </LegalSection>

      <LegalSection number={7} title="Your Choices">
        You can update your profile information at any time from your
        account settings, and may request account deletion by contacting our
        support team.
      </LegalSection>

      <LegalSection number={8} title="Changes to This Policy">
        We may update this Privacy Policy periodically. We encourage you to
        review it occasionally to stay informed about how we protect your
        information.
      </LegalSection>

      <LegalSection number={9} title="Contact Us">
        If you have questions about this Privacy Policy, please reach out
        through our Contact page.
      </LegalSection>
    </LegalLayout>
  );
}
