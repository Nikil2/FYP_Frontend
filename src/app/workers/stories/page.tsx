import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Worker Success Stories - Mehnati",
  description:
    "Real stories from skilled workers who grew their business on Mehnati.",
};

const stories = [
  {
    name: "Ahmed Hassan",
    category: "Electrician",
    location: "Lahore",
    rating: 4.9,
    quote:
      "Before Mehnati, most of my work came from word of mouth. Now I get steady job requests every week and my customers trust me because of the verified badge.",
  },
  {
    name: "Muhammad Ali",
    category: "Plumber",
    location: "Karachi",
    rating: 4.8,
    quote:
      "The in-app negotiation makes pricing fair for everyone. I no longer have to haggle in person — customers see my rate and we agree before I even leave home.",
  },
  {
    name: "Bilal Ahmed",
    category: "Mason",
    location: "Islamabad",
    rating: 4.7,
    quote:
      "I went from taking on odd jobs to running a full schedule every month. Being able to build a rating has brought me repeat customers.",
  },
];

export default function WorkerStoriesPage() {
  return (
    <main>
      <PageHeader
        title="Worker Success Stories"
        description="Hear from skilled workers who've grown their business with Mehnati."
      />

      <section className="section-padding-standard">
        <div className="layout-standard grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.name} hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center font-bold text-tertiary">
                  {story.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-heading">{story.name}</h3>
                  <p className="text-sm text-paragraph">{story.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="tertiary">{story.category}</Badge>
                <span className="flex items-center gap-1 text-sm text-heading">
                  <Star className="w-4 h-4 fill-tertiary text-tertiary" />
                  {story.rating}
                </span>
              </div>

              <p className="text-paragraph italic">&ldquo;{story.quote}&rdquo;</p>
            </Card>
          ))}
        </div>

        <div className="layout-standard text-center mt-12">
          <p className="text-paragraph mb-4">
            Ready to write your own success story?
          </p>
          <Link href="/auth/signup/worker">
            <Button variant="tertiary" size="lg">
              Join as a Worker
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
