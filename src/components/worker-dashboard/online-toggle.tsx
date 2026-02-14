"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface OnlineToggleProps {
  initialStatus?: boolean;
  showLabel?: boolean;
}

export function OnlineToggle({ initialStatus = true, showLabel = true }: OnlineToggleProps) {
  const [isOnline, setIsOnline] = useState(initialStatus);
  const { t } = useLanguage();

  return (
    <button
      onClick={() => setIsOnline(!isOnline)}
      className={cn(
        "flex items-center gap-2",
        showLabel ? "w-full" : "flex-shrink-0"
      )}
    >
      {/* Toggle switch */}
      <div
        className={cn(
          "relative w-11 h-6 rounded-full animation-standard flex-shrink-0",
          isOnline ? "bg-tertiary" : "bg-gray-300"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md animation-standard",
            isOnline ? "left-[22px]" : "left-0.5"
          )}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-sm font-medium",
            isOnline ? "text-tertiary" : "text-paragraph"
          )}
        >
          {isOnline ? t.online : t.offline}
        </span>
      )}
    </button>
  );
}
