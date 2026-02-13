"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* ==================== DESKTOP LAYOUT ==================== */}
      <div className="hidden md:flex min-h-screen bg-background pt-20">
        {/* Desktop Sidebar - Sticky */}
        <div className="w-1/5 sticky top-20 h-screen border-r border-border overflow-y-auto bg-card">
          <DashboardSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="md:hidden flex min-h-screen flex-col bg-background relative overflow-hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 py-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 text-tertiary transition-colors hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-lg font-bold text-heading">Dashboard</h1>
        </div>

        {/* Mobile Sidebar - Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
              role="presentation"
            />
            <div className="fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-border bg-card">
              <DashboardSidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </>
  );
}
