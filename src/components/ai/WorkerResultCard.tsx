'use client';

import { useRouter } from 'next/navigation';
import { Star, Briefcase, MapPin } from 'lucide-react';
import type { AiWorker } from '@/types/ai';

/**
 * A real DB worker rendered inside the chat — the agentic payoff. Customer can
 * jump straight to the worker's profile or the pre-filled booking form.
 */
export function WorkerResultCard({ worker }: { worker: AiWorker }) {
  const router = useRouter();
  const serviceId = worker.services[0]?.id;

  const initials = worker.fullName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        {worker.profilePicUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={worker.profilePicUrl}
            alt={worker.fullName}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
            {initials || 'W'}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">{worker.fullName}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-0.5">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {worker.averageRating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Briefcase size={12} /> {worker.totalJobsCompleted} jobs
            </span>
            {worker.city && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin size={12} /> {worker.city}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-gray-400">from</p>
          <p className="font-semibold text-emerald-700">PKR {worker.visitingCharges}</p>
        </div>
      </div>

      {worker.reason && (
        <p className="mt-2 rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
          {worker.reason}
        </p>
      )}

      <div className="mt-2.5 flex gap-2">
        <button
          onClick={() => router.push(`/worker/${worker.workerId}`)}
          className="flex-1 rounded-lg border border-gray-300 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
        >
          View Profile
        </button>
        <button
          onClick={() =>
            router.push(`/customer/book/${serviceId}?workerId=${worker.workerId}`)
          }
          disabled={!serviceId}
          className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
