"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "support@mehnati.pk",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 300 1234567",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Lahore, Pakistan",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Message sent! Our team will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <main>
      <PageHeader
        title="Contact Us"
        description="Have a question or need help? We'd love to hear from you."
      />

      <section className="section-padding-standard">
        <div className="layout-standard grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-4">
            {contactDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <Card key={detail.label} hover>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                      <p className="text-sm text-paragraph">{detail.label}</p>
                      <p className="font-semibold text-heading">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-heading mb-1">
                Send Us a Message
              </h2>
              <p className="text-sm text-paragraph mb-6">
                Fill out the form below and our team will get back to you
                within one business day.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent animation-standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent animation-standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent resize-none animation-standard"
                  />
                </div>
                <Button
                  type="submit"
                  variant="tertiary"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
