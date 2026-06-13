"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, HelpCircle, MessageCircle, Phone, Mail, BookOpen } from "lucide-react";
import { NotificationBell } from "@/components/customer/notification-bell";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do I book a service?",
    a: "Go to the Home tab, select a service category, browse available workers, pick one you like, and tap 'Book Now'. Fill in the job details, propose a price, and submit. The worker will respond with acceptance or a counter-offer.",
  },
  {
    q: "How does price negotiation work?",
    a: "When you book, you enter your budget. The worker can accept your price or send a counter-offer. You can then accept their price or send another counter. This continues until both parties agree, then the booking is confirmed.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, you can cancel a booking as long as the worker hasn't started the job yet. Open the booking from My Orders and tap 'Cancel Booking'. Cancellations after work starts may require a discussion with the worker.",
  },
  {
    q: "How do I pay the worker?",
    a: "Mehnati currently uses cash payment. Once the job is complete, you pay the worker directly the agreed price. In-app payments will be available in a future update.",
  },
  {
    q: "What if I'm not satisfied with the service?",
    a: "If you're unhappy with the service, you can file a complaint from the booking details page. Our support team will investigate and mediate between you and the worker within 48 hours.",
  },
  {
    q: "How do I know if a worker is verified?",
    a: "All workers on Mehnati go through an identity and skills verification process. Verified workers display a 'Verified' badge on their profile. We verify CNIC and work experience before approving a worker.",
  },
  {
    q: "Can I chat with the worker before they start?",
    a: "Yes! Once your booking is confirmed (Accepted status), you can use the in-app chat on the booking details page to communicate with the worker about job specifics, arrival time, etc.",
  },
  {
    q: "How are ratings and reviews handled?",
    a: "After a job is marked as complete, you can leave a star rating and written review for the worker. Reviews are public and help other customers make better decisions.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-heading pr-3">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
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
        <h1 className="text-lg font-semibold text-heading flex-1">Help &amp; Support</h1>
        <NotificationBell />
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Contact */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href="mailto:support@mehnati.pk"
            className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-2 hover:border-tertiary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[10px] font-medium text-heading text-center">Email Us</span>
          </a>
          <a
            href="tel:+920001234567"
            className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-2 hover:border-tertiary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-[10px] font-medium text-heading text-center">Call Us</span>
          </a>
          <a
            href="https://wa.me/920001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-2 hover:border-tertiary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-medium text-heading text-center">WhatsApp</span>
          </a>
        </div>

        {/* Operating Hours */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-heading">Support Hours</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monday – Saturday: 9:00 AM – 9:00 PM (PKT)
            </p>
            <p className="text-xs text-muted-foreground">Sunday: 10:00 AM – 6:00 PM (PKT)</p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-tertiary" />
            <h2 className="text-sm font-semibold text-heading">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-heading mb-1">Still need help?</p>
          <p className="text-xs text-muted-foreground mb-3">Our team typically responds within 2 hours during business hours.</p>
          <a
            href="mailto:support@mehnati.pk"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline"
          >
            <Mail className="w-3.5 h-3.5" /> support@mehnati.pk
          </a>
        </div>
      </div>
    </div>
  );
}
