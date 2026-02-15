import { CustomerBottomNav } from "@/components/customer/bottom-nav";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar - hidden on mobile */}
        <CustomerSidebar />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 overflow-x-hidden">
          <div className="max-w-5xl mx-auto bg-white min-h-screen relative">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav - hidden on desktop */}
      <CustomerBottomNav />
    </div>
  );
}
