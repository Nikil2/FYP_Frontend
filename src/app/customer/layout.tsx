import { CustomerBottomNav } from "@/components/customer/bottom-nav";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AIChatWidget } from "@/components/ai/AIChatWidget";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["CUSTOMER"]}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Desktop Sidebar - hidden on mobile */}
          <CustomerSidebar />

          {/* Main Content */}
          <div className="flex-1 md:ml-64 overflow-x-hidden">
            <div className="max-w-5xl mx-auto bg-background min-h-screen relative">
              {children}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Nav - hidden on desktop */}
        <CustomerBottomNav />

        {/* Nova — floating AI assistant on every customer page */}
        <AIChatWidget />
      </div>
    </RoleGuard>
  );
}
