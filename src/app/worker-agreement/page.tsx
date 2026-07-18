import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/layouts/LegalLayout";

export const metadata: Metadata = {
  title: "Worker Agreement - Mehnati",
  description:
    "Terms and responsibilities for skilled workers offering services on Mehnati.",
};

export default function WorkerAgreementPage() {
  return (
    <LegalLayout title="Worker Agreement" lastUpdated="July 18, 2026">
      <LegalSection number={1} title="Independent Worker Status">
        Workers on Mehnati operate as independent service providers, not
        employees of Mehnati. You are responsible for how you perform your
        work, subject to the quality and conduct standards below.
      </LegalSection>

      <LegalSection number={2} title="Verification Requirements">
        To go online and accept jobs, you must submit a valid CNIC and
        accurate profile information. Providing false or misleading
        verification information may result in permanent suspension.
      </LegalSection>

      <LegalSection number={3} title="Accepting & Completing Jobs">
        Once you accept a job and agree on a price with a customer, you are
        expected to complete the work as described, within the agreed
        timeframe, and at the agreed price.
      </LegalSection>

      <LegalSection number={4} title="Pricing & Payments">
        All pricing must be negotiated and confirmed within the app before
        work begins. Workers should not pressure customers into paying
        outside of the agreed price or scope of the job.
      </LegalSection>

      <LegalSection number={5} title="Conduct Standards">
        Workers must treat customers professionally and respectfully, arrive
        as scheduled, and communicate any delays or issues promptly through
        in-app messaging.
      </LegalSection>

      <LegalSection number={6} title="Ratings & Feedback">
        Customers may rate and review your work after each completed job.
        Consistently low ratings or verified complaints may affect your
        ability to receive new job requests.
      </LegalSection>

      <LegalSection number={7} title="Complaints & Investigations">
        If a complaint is filed against you, Mehnati&apos;s admin team may review
        the booking history and communications related to that job as part
        of the investigation.
      </LegalSection>

      <LegalSection number={8} title="Suspension & Termination">
        Mehnati may suspend or remove a worker profile for verified
        misconduct, repeated cancellations, fraudulent activity, or failure
        to meet the standards outlined in this agreement.
      </LegalSection>

      <LegalSection number={9} title="Changes to This Agreement">
        This agreement may be updated from time to time. Continuing to accept
        jobs on Mehnati after changes are posted constitutes acceptance of the
        updated terms.
      </LegalSection>
    </LegalLayout>
  );
}
