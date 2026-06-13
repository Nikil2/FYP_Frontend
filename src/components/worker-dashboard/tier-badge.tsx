"use client";

import { cn } from "@/lib/utils";
import { TIER_META, type WorkerTier } from "@/api/services/bonus";

interface TierBadgeProps {
  tier: WorkerTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Tier badge (Bronze / Silver / Gold / Platinum) — shown on the worker dashboard
 * and on public profiles / search cards as a customer trust signal (US-007).
 */
export function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  className,
}: TierBadgeProps) {
  if (tier === "NONE" && !showLabel) return null;

  const meta = TIER_META[tier];
  const sizes = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        sizes[size],
        className,
      )}
      style={{
        color: meta.color,
        borderColor: meta.color,
        backgroundColor: `${meta.color}1A`, // ~10% opacity
      }}
      title={`${meta.label} worker`}
    >
      <span>{meta.emoji}</span>
      {showLabel && <span>{meta.label}</span>}
    </span>
  );
}
