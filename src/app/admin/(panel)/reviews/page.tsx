"use client";

import { useEffect, useMemo, useState } from "react";
import { EyeOff, Flag, ShieldAlert, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getReviews, hideReview } from "@/api/services/admin";
import type { Review } from "@/api/services/admin";

type FilterMode = "ALL" | "FLAGGED" | "LOW_RATING";
type ReviewStatus = "VISIBLE" | "HIDDEN";

type ReviewRow = Review & {
  status: ReviewStatus;
  isFlagged: boolean;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [filter, setFilter] = useState<FilterMode>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await getReviews(1, 100);
        setReviews(
          response.data.map((review) => ({
            ...review,
            status: "VISIBLE",
            isFlagged: review.rating <= 2,
          })),
        );
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (filter === "FLAGGED") {
      return reviews.filter((review) => review.isFlagged);
    }

    if (filter === "LOW_RATING") {
      return reviews.filter((review) => review.rating <= 2);
    }

    return reviews;
  }, [filter, reviews]);

  const flaggedCount = reviews.filter((review) => review.isFlagged).length;
  const visibleCount = reviews.filter((review) => review.status === "VISIBLE").length;

  const toggleVisibility = async (id: string) => {
    const target = reviews.find((review) => review.id === id);
    if (!target || target.status === "HIDDEN") {
      return;
    }

    try {
      await hideReview(id);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, status: "HIDDEN" } : review,
        ),
      );
    } catch (error) {
      console.error("Failed to hide review:", error);
    }
  };

  const workerHealth = useMemo(() => {
    const map = new Map<string, { totalRating: number; totalReviews: number; flaggedReviews: number }>();

    for (const review of reviews) {
      const workerName = review.booking.worker.user.fullName;
      const current = map.get(workerName) || { totalRating: 0, totalReviews: 0, flaggedReviews: 0 };
      map.set(workerName, {
        totalRating: current.totalRating + review.rating,
        totalReviews: current.totalReviews + 1,
        flaggedReviews: current.flaggedReviews + (review.isFlagged ? 1 : 0),
      });
    }

    return [...map.entries()]
      .map(([workerName, stats]) => ({
        workerName,
        averageRating: stats.totalRating / Math.max(1, stats.totalReviews),
        totalReviews: stats.totalReviews,
        flaggedReviews: stats.flaggedReviews,
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 8);
  }, [reviews]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Reviews & Ratings"
        description="Moderate worker reviews, hide abusive entries, and track quality signals across the marketplace."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Total Reviews In Queue</p>
          <p className="mt-2 text-3xl font-bold text-heading">{reviews.length}</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Flagged Reviews</p>
          <p className="mt-2 text-3xl font-bold text-red-700">{flaggedCount}</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <p className="text-xs uppercase tracking-[0.12em] text-paragraph">Visible Reviews</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{visibleCount}</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border-border/70 bg-card/95 p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-4 py-3">
            <Button size="sm" variant={filter === "ALL" ? "primary" : "outline"} onClick={() => setFilter("ALL")}>
              All
            </Button>
            <Button size="sm" variant={filter === "FLAGGED" ? "primary" : "outline"} onClick={() => setFilter("FLAGGED")}>
              Flagged
            </Button>
            <Button size="sm" variant={filter === "LOW_RATING" ? "primary" : "outline"} onClick={() => setFilter("LOW_RATING")}>
              1-2 Star
            </Button>
          </div>

          <div className="divide-y divide-border/70">
            {filteredReviews.map((review) => (
              <div key={review.id} className="px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-heading">{review.booking.worker.user.fullName}</p>
                    <p className="text-xs text-paragraph">
                      by {review.user.fullName} • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700">
                      <Star className="mr-1 h-3.5 w-3.5" />
                      {review.rating.toFixed(1)}
                    </Badge>
                    <Badge className={review.status === "VISIBLE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}>
                      {review.status}
                    </Badge>
                    {review.isFlagged ? (
                      <Badge className="bg-red-100 text-red-700">
                        <Flag className="mr-1 h-3.5 w-3.5" />
                        Flagged
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 text-sm text-paragraph">{review.comment || "No comment"}</p>

                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleVisibility(review.id)} disabled={review.status === "HIDDEN"}>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </Button>
                  <Button size="sm" variant="outline" className="text-amber-700" disabled>
                    <ShieldAlert className="h-4 w-4" />
                    Follow-up
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-3 text-lg font-semibold text-heading">Worker Rating Health</h2>
          <div className="space-y-3">
            {workerHealth.map((worker) => (
              <div key={worker.workerName} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-heading">{worker.workerName}</p>
                  <Badge className={worker.averageRating >= 4.5 ? "bg-emerald-100 text-emerald-700" : worker.averageRating >= 4 ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"}>
                    {worker.averageRating.toFixed(1)}
                  </Badge>
                </div>
                <p className="text-xs text-paragraph">{worker.totalReviews} reviews</p>
                <p className="text-xs text-paragraph">
                  Flagged: {worker.flaggedReviews}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
