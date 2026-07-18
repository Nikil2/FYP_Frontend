import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Press - Mehnati",
  description:
    "Media resources and press contact information for Mehnati, Pakistan's marketplace for skilled workers.",
};

export default function PressPage() {
  return (
    <main>
      <PageHeader
        title="Press & Media"
        description="News, brand resources, and media contact information for Mehnati."
      />

      <section className="section-padding-standard">
        <div className="layout-standard grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-heading mb-3">
              Media Inquiries
            </h2>
            <p className="text-paragraph mb-4">
              For interview requests, press releases, or any other media
              inquiries, please reach out to our press team and we&apos;ll get
              back to you as soon as possible.
            </p>
            <Link href="/contact">
              <Button variant="tertiary">Contact Press Team</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-heading mb-3">
              Brand Assets
            </h2>
            <p className="text-paragraph">
              Looking for the Mehnati logo or brand guidelines for an article
              or feature? Get in touch with our team and we&apos;ll share the
              latest assets with you directly.
            </p>
          </Card>
        </div>

        <div className="layout-standard mt-12">
          <h2 className="text-xl font-semibold text-heading mb-6">
            In the News
          </h2>
          <Card>
            <p className="text-paragraph">
              Mehnati is currently building out its presence across Pakistan.
              Check back soon for press coverage and media mentions.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}
