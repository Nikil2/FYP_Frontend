"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Shield, Eye, Lock, Bell, Trash2, UserCheck } from "lucide-react";
import { NotificationBell } from "@/components/customer/notification-bell";

const sections = [
  {
    icon: Eye,
    title: "What We Collect",
    content:
      "We collect your full name, phone number, and location data when you use Mehnati. We also collect booking history, service preferences, and app usage data to improve your experience.",
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content:
      "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Passwords are hashed with bcrypt and never stored in plain text. We never share your personal data with third parties without your consent.",
  },
  {
    icon: UserCheck,
    title: "How We Use Your Data",
    content:
      "Your data is used to match you with workers, process bookings, send notifications, improve our service, and resolve disputes. We may use anonymized data for analytics.",
  },
  {
    icon: Bell,
    title: "Notifications",
    content:
      "We send push notifications and SMS for booking updates, price proposals, and important account changes. You can manage notification preferences from the Notifications page.",
  },
  {
    icon: Trash2,
    title: "Data Deletion",
    content:
      "You can request deletion of your account and all associated data at any time. Your data will be permanently deleted within 30 days. Contact support@mehnati.pk to initiate the request.",
  },
  {
    icon: Shield,
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data. You can download a copy of your data or opt out of marketing communications by contacting us.",
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/profile")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading flex-1">Privacy &amp; Security</h1>
        <NotificationBell />
      </div>

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-8 h-8 text-tertiary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-heading">Your Privacy Matters</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Mehnati is committed to protecting your personal data. Last updated: January 2025.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-tertiary" />
              <h3 className="text-sm font-semibold text-heading">{title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Questions about your privacy?{" "}
            <a href="mailto:support@mehnati.pk" className="text-tertiary font-medium hover:underline">
              support@mehnati.pk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
