"use client";

import { useRouter } from "next/navigation";
import type { WorkerDetail } from "@/types/worker";

/**
 * Compact booking card for the worker profile. Replaces the inline booking
 * form — picking a service/date/time happens on the dedicated booking page.
 * "Book Now" routes to /customer/book/:serviceId?workerId=:workerId.
 */
export function BookingCTA({ worker }: { worker: WorkerDetail }) {
  const router = useRouter();
  const serviceId = worker.services[0]?.id;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm text-paragraph">Visiting Fee</p>
      <p className="text-3xl font-bold text-tertiary">
        Rs. {Number(worker.visitingFee).toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Additional charges may apply based on service
      </p>

      <button
        onClick={() =>
          router.push(`/customer/book/${serviceId}?workerId=${worker.id}`)
        }
        disabled={!serviceId}
        className="mt-5 w-full rounded-lg bg-tertiary py-3 font-semibold text-white transition hover:bg-tertiary-hover disabled:opacity-50"
      >
        Book Now
      </button>
    </div>
  );
}
