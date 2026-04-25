"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Flag, ShieldAlert, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  reviewModerationSeed,
  ReviewModerationItem,
  workerQualitySeed,
} from "@/lib/admin-mock-data";

type FilterMode = "ALL" | "FLAGGED" | "LOW_RATING";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewModerationItem[]>(reviewModerationSeed);
  const [filter, setFilter] = useState<FilterMode>("ALL");

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

  const toggleVisibility = (id: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id
          ? { ...review, status: review.status === "VISIBLE" ? "HIDDEN" : "VISIBLE" }
          : review,
      ),
    );
  };

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
                    <p className="font-semibold text-heading">{review.workerName}</p>
                    <p className="text-xs text-paragraph">
                      by {review.customerName} • {review.createdAt}
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

                <p className="mt-3 text-sm text-paragraph">{review.comment}</p>
                {review.reportReason ? (
                  <p className="mt-1 text-xs text-red-700">Report reason: {review.reportReason}</p>
                ) : null}

                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleVisibility(review.id)}>
                    {review.status === "VISIBLE" ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Unhide
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="text-amber-700">
                    <ShieldAlert className="h-4 w-4" />
                    Mark for Follow-up
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95">
          <h2 className="mb-3 text-lg font-semibold text-heading">Worker Rating Health</h2>
          <div className="space-y-3">
            {workerQualitySeed.map((worker) => (
              <div key={worker.workerId} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-heading">{worker.workerName}</p>
                  <Badge className={worker.averageRating >= 4.5 ? "bg-emerald-100 text-emerald-700" : worker.averageRating >= 4 ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"}>
                    {worker.averageRating.toFixed(1)}
                  </Badge>
                </div>
                <p className="text-xs text-paragraph">{worker.service} • {worker.totalReviews} reviews</p>
                <p className="text-xs text-paragraph">
                  Flagged: {worker.flaggedReviews} • Completion: {worker.completionRate}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
