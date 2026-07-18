import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/layouts/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service - Mehnati",
  description: "Terms of Service for using the Mehnati marketplace.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="July 18, 2026">
      <LegalSection number={1} title="Acceptance of Terms">
        By creating an account or using Mehnati, you agree to be bound by
        these Terms of Service. If you do not agree with any part of these
        terms, please do not use the platform.
      </LegalSection>

      <LegalSection number={2} title="Who Can Use Mehnati">
        Mehnati is available to customers seeking home services and workers
        who wish to offer skilled labor. Workers must provide a valid CNIC and
        complete our verification process before accepting jobs.
      </LegalSection>

      <LegalSection number={3} title="Bookings & Pricing">
        Mehnati facilitates negotiation between customers and workers but is
        not a party to the final agreement on price or scope of work. Both
        sides are expected to honor the price and terms agreed upon within
        the app before work begins.
      </LegalSection>

      <LegalSection number={4} title="Worker Verification">
        Workers are verified based on the CNIC and information submitted at
        sign-up. While Mehnati reviews this information, customers should
        still exercise reasonable judgment when hiring any worker.
      </LegalSection>

      <LegalSection number={5} title="User Conduct">
        Users agree not to misuse the platform, including submitting false
        information, harassing other users, or attempting to circumvent
        in-app payments or communication for bookings made through Mehnati.
      </LegalSection>

      <LegalSection number={6} title="Complaints & Disputes">
        If a dispute arises from a booking, either party may file a complaint
        through the app. Mehnati&apos;s admin team will review the complaint and
        may take action, including suspending accounts found to violate these
        terms.
      </LegalSection>

      <LegalSection number={7} title="Account Suspension">
        Mehnati reserves the right to suspend or terminate accounts that
        violate these terms, engage in fraudulent activity, or pose a safety
        risk to other users.
      </LegalSection>

      <LegalSection number={8} title="Changes to These Terms">
        We may update these Terms of Service from time to time. Continued use
        of Mehnati after changes are posted constitutes acceptance of the
        updated terms.
      </LegalSection>

      <LegalSection number={9} title="Contact">
        Questions about these terms can be sent to our support team through
        the Contact page.
      </LegalSection>
    </LegalLayout>
  );
}
