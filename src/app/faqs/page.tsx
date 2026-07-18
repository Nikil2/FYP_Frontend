"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I book a worker on Mehnati?",
    answer:
      "Sign up as a customer, choose a service category, and describe the job you need done. You'll get offers from nearby verified workers and can chat and negotiate directly before confirming a booking.",
  },
  {
    question: "How are workers verified?",
    answer:
      "Every worker submits their CNIC during sign-up. Our admin team reviews and approves each profile before the worker can go online and accept jobs.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Prices are negotiated per job. A worker can propose a price and a customer can counter-offer until both sides agree, so there are never any hidden fees.",
  },
  {
    question: "What if I have a problem with a booking?",
    answer:
      "You can raise a complaint directly from your booking, and our admin team will step in to help resolve the issue.",
  },
  {
    question: "Can I track my worker in real time?",
    answer:
      "Yes. Once a booking is accepted, you can follow the job status from accepted to in-progress to completed right from your dashboard.",
  },
  {
    question: "Is Mehnati available in Urdu?",
    answer:
      "Yes, Mehnati supports both English and Urdu so customers and workers can use the platform in the language they're most comfortable with.",
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main>
      <PageHeader
        title="Frequently Asked Questions"
        description="Answers to the most common questions about booking and working on Mehnati."
      />

      <section className="section-padding-standard">
        <div className="layout-standard max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card key={faq.question} className="p-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-heading">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 flex-shrink-0 text-tertiary animation-standard",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid animation-standard",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-paragraph px-6 pb-5">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
