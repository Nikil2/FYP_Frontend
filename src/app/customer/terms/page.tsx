"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";
import { NotificationBell } from "@/components/customer/notification-bell";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the Mehnati platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.",
  },
  {
    title: "2. Platform Role",
    content:
      "Mehnati is a marketplace that connects customers with independent service providers (workers). We do not employ workers and are not responsible for the quality of services rendered. Workers are independent contractors.",
  },
  {
    title: "3. User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. Each user may hold only one account. You must be 18 years or older to use this platform.",
  },
  {
    title: "4. Booking & Payments",
    content:
      "All bookings are subject to worker availability and acceptance. Prices are agreed between the customer and worker through the in-app negotiation system. Mehnati does not process payments — all transactions are handled directly between the parties.",
  },
  {
    title: "5. Cancellations",
    content:
      "Customers may cancel a booking before the worker starts the job. Cancellations after work has commenced may be subject to a partial charge as agreed with the worker. Mehnati reserves the right to penalize excessive cancellations.",
  },
  {
    title: "6. Reviews & Feedback",
    content:
      "Reviews must be honest and based on your genuine experience. We reserve the right to remove reviews that are fraudulent, abusive, or violate our community guidelines.",
  },
  {
    title: "7. Prohibited Conduct",
    content:
      "You may not use Mehnati to engage in fraudulent activities, harass other users, post false information, or circumvent the platform to make off-platform arrangements to avoid fees.",
  },
  {
    title: "8. Dispute Resolution",
    content:
      "In case of a dispute, both parties should first attempt resolution through the in-app chat. If unresolved, either party may file a complaint through Mehnati's dispute resolution process. Mehnati's decision is final.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "Mehnati is not liable for any direct, indirect, or incidental damages arising from use of the platform, including loss of data, property damage, or personal injury resulting from a service.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We may update these terms at any time. Continued use of the platform after changes constitutes acceptance. We will notify users of significant changes via the app.",
  },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/profile")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading flex-1">Terms &amp; Conditions</h1>
        <NotificationBell />
      </div>

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <FileText className="w-8 h-8 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-heading">Mehnati Terms of Service</p>
            <p className="text-xs text-muted-foreground mt-0.5">Effective date: January 1, 2025 · Governing law: Pakistan</p>
          </div>
        </div>

        {sections.map(({ title, content }) => (
          <div key={title} className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-heading mb-2">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
          </div>
        ))}

        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Questions?{" "}
            <a href="mailto:legal@mehnati.pk" className="text-tertiary font-medium hover:underline">
              legal@mehnati.pk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
