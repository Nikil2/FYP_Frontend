"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden section-padding-standard py-16">
      {/* Sidebar - 20% width */}
      <div className="w-1/5 border-r border-border ">
        <DashboardSidebar />
      </div>

      {/* Main Content - 80% width */}
      <main className="flex-1 pt-6">
        <div className="layout-standard">{children}</div>
      </main>
    </div>
  );
}
