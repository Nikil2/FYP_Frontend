"use client";

import { useState } from "react";
import { LanguageProvider } from "@/lib/language-context";
import { WorkerSidebar } from "@/components/worker-dashboard/worker-sidebar";
import { WorkerTopBar } from "@/components/worker-dashboard/worker-topbar";
import { BottomNav } from "@/components/worker-dashboard/bottom-nav";

export default function WorkerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Top Bar with logo, notifications, profile */}
        <WorkerTopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Content */}
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">
            {children}
          </main>

          {/* Sidebar - slide-in from right (desktop only) */}
          {sidebarOpen && (
            <>
              {/* Backdrop - desktop only */}
              <div
                className="fixed inset-0 bg-black/40 z-40 hidden lg:block"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Drawer - right side (desktop only) */}
              <div className="fixed top-0 right-0 bottom-0 w-[280px] z-50 animate-slide-in-right shadow-2xl hidden lg:block">
                <WorkerSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </>
          )}
        </div>

        {/* Bottom Nav - Mobile only */}
        <BottomNav />
      </div>
    </LanguageProvider>
  );
}
