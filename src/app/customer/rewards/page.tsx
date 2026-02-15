"use client";

import { useRouter } from "next/navigation";
import { Award, ChevronLeft } from "lucide-react";
import { FloatingButtons } from "@/components/customer/floating-buttons";

export default function RewardsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading">Rewards</h1>
      </div>

      {/* Rewards Content */}
      <div className="p-4 space-y-4">
        {/* Points Card */}
        <div className="rounded-xl bg-gradient-to-br from-tertiary to-tertiary-hover p-6 text-white">
          <p className="text-sm opacity-90">Total Points</p>
          <p className="text-4xl font-bold mt-1">0</p>
          <p className="text-xs opacity-75 mt-2">
            Earn points with every booking
          </p>
        </div>

        {/* How to earn */}
        <div className="bg-white border border-border rounded-xl p-4">
          <h3 className="text-base font-semibold text-heading mb-3">
            How to earn rewards
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-tertiary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-heading">
                  Book a Service
                </p>
                <p className="text-xs text-muted-foreground">
                  Earn 10 points for every booking
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-tertiary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-heading">
                  Complete the Job
                </p>
                <p className="text-xs text-muted-foreground">
                  Earn bonus points on completion
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-tertiary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-heading">
                  Leave a Review
                </p>
                <p className="text-xs text-muted-foreground">
                  Earn 5 points for each review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* No rewards yet */}
        <div className="flex flex-col items-center justify-center py-8">
          <Award className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            No rewards earned yet. Start booking to earn points!
          </p>
        </div>
      </div>

      <FloatingButtons />
    </div>
  );
}
