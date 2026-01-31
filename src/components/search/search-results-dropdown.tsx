"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Shield } from "lucide-react";
import type { WorkerDetail } from "@/types/worker";
import { cn } from "@/lib/utils";

interface SearchResultsDropdownProps {
  results: WorkerDetail[];
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export function SearchResultsDropdown({
  results,
  isOpen,
  onClose,
  query,
}: SearchResultsDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside only for non-mobile to avoid interference with navigation
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // md breakpoint

    const handleClickOutside = (e: MouseEvent) => {
      // Only apply click-outside on desktop
      if (
        !isMobile &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Handle worker result click
  const handleWorkerClick = (workerId: string) => {
    // Close dropdown first
    onClose();
    // Then navigate - use setTimeout to ensure state updates complete
    setTimeout(() => {
      router.push(`/worker/${workerId}`);
    }, 50);
  };

  if (!isOpen || !query || results.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="md:absolute md:top-full md:left-0 md:right-0 md:mt-2 bg-white border border-border rounded-lg shadow-lg z-40 max-h-64 overflow-y-auto mt-2"
    >
      {/* Results List */}
      <div className="divide-y divide-border">
        {results.map((worker) => (
          <div key={worker.id}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleWorkerClick(worker.id);
              }}
              className="p-3 hover:bg-secondary-background animation-standard cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleWorkerClick(worker.id);
                }
              }}
            >
              <div className="flex items-center gap-2">
                {/* Avatar - Smaller */}
                <Avatar src={worker.profileImage} alt={worker.name} size="sm" />

                {/* Worker Info */}
                <div className="flex-1 min-w-0">
                  {/* Name + Verification + Category */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <h4 className="font-semibold text-heading text-sm truncate">
                      {worker.name}
                    </h4>
                    {worker.isVerified && (
                      <Shield className="w-3 h-3 text-tertiary flex-shrink-0" />
                    )}
                  </div>

                  {/* Category + Rating in one line */}
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <Badge variant="tertiary" className="text-xs py-0 px-2">
                      {worker.category}
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-paragraph">
                        {worker.rating}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {worker.distance}km
                    </span>
                  </div>

                  {/* Visiting Fee */}
                  <p className="text-xs font-semibold text-tertiary mt-0.5">
                    Rs. {worker.visitingFee}
                  </p>
                </div>

                {/* Online Status */}
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    worker.isOnline ? "bg-green-500" : "bg-muted-foreground",
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Result Count */}
      <div className="px-4 py-3 bg-secondary-background text-center text-xs text-muted-foreground border-t border-border">
        {results.length} of many results for "{query}"
      </div>
    </div>
  );
}
