"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/customer/notification-bell";

export default function SavedWorkersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/profile")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading flex-1">Saved Workers</h1>
        <NotificationBell />
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <Heart className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-heading mb-2">No Saved Workers Yet</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
          When you find a worker you love, tap the heart icon on their profile to save them here for quick access.
        </p>
        <Button
          variant="tertiary"
          onClick={() => router.push("/customer")}
          className="gap-2"
        >
          <Search className="w-4 h-4" />
          Browse Workers
        </Button>
      </div>
    </div>
  );
}
