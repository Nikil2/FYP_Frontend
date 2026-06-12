"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import {
  getCachedWorkerDashboardProfile,
  getWorkerDashboardOrders,
  getWorkerDashboardProfileByUserId,
  resolveWorkerUserId,
} from "@/api/services/worker-dashboard";
import { cn } from "@/lib/utils";
import { MapPin, Clock, FileText, MessageCircle } from "lucide-react";
import type { ProviderOrder, OrderStatus } from "@/types/provider";
import { OrderDetailModal } from "@/components/worker-dashboard/order-detail-modal";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { getAuthUser } from "@/lib/auth";

export default function OrdersPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [selectedOrder, setSelectedOrder] = useState<ProviderOrder | null>(null);
  const [activeOrders, setActiveOrders] = useState<ProviderOrder[]>([]);
  const [pastOrders, setPastOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastLoading, setPastLoading] = useState(false);
  const [pastLoaded, setPastLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOrder, setChatOrder] = useState<ProviderOrder | null>(null);
  const currentUser = getAuthUser();

  // Load only active orders on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = resolveWorkerUserId();
        if (!userId) {
          setError("Worker user ID missing. Set NEXT_PUBLIC_WORKER_USER_ID or login first.");
          return;
        }
        const profile = getCachedWorkerDashboardProfile() || await getWorkerDashboardProfileByUserId(userId);
        const active = await getWorkerDashboardOrders(profile.workerId, "active");
        setActiveOrders(active as ProviderOrder[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Lazy-load past orders only when that tab is first opened
  useEffect(() => {
    if (activeTab !== "past" || pastLoaded || pastLoading) return;
    const loadPast = async () => {
      setPastLoading(true);
      try {
        const profile = getCachedWorkerDashboardProfile();
        if (!profile) return;
        const past = await getWorkerDashboardOrders(profile.workerId, "past");
        setPastOrders(past as ProviderOrder[]);
        setPastLoaded(true);
      } catch { /* silent */ } finally {
        setPastLoading(false);
      }
    };
    loadPast();
  }, [activeTab, pastLoaded, pastLoading]);

  const currentOrders = activeTab === "active" ? activeOrders : pastOrders;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-500";
      case "in-progress":
        return "text-blue-600";
      case "negotiation":
        return "text-purple-600";
      case "accepted":
        return "text-tertiary";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-paragraph";
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case "completed":
        return t.completed;
      case "cancelled":
        return t.cancelled;
      case "in-progress":
        return t.inProgress;
      case "negotiation":
        return t.negotiation;
      case "accepted":
        return t.accepted;
      case "pending":
        return t.pending;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4 p-4 lg:p-8">
      {/* Page Header */}
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">
        {t.myOrders}
      </h1>

      {/* Toggle Tabs */}
      <div className="flex items-center bg-muted rounded-full p-1 max-w-sm">
        <button
          onClick={() => setActiveTab("active")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-full text-sm font-medium animation-standard text-center",
            activeTab === "active"
              ? "bg-white text-heading shadow-sm"
              : "text-paragraph hover:text-heading"
          )}
        >
          {t.myOrders} ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-full text-sm font-medium animation-standard text-center",
            activeTab === "past"
              ? "bg-white text-heading shadow-sm"
              : "text-paragraph hover:text-heading"
          )}
        >
          {t.pastOrders} ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {(loading || pastLoading) && (
          <Card className="p-4">
            <p className="text-sm text-paragraph">Loading orders...</p>
          </Card>
        )}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <Card key={order.id} className="p-4 lg:p-5">
              <div className="space-y-3">
                {/* Top Row: Service Name + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Service Image Placeholder */}
                    <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-tertiary">
                        {order.serviceName}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        getStatusColor(order.status)
                      )}
                    >
                      {getStatusLabel(order.status)}
                      {order.status === "completed" && order.invoiceUrl && (
                        <span className="block text-xs text-muted-foreground">
                          {t.viewInvoice}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Service ID + Date */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-paragraph">
                    {t.serviceId}: {order.id}
                  </span>
                  <span className="text-tertiary font-medium">
                    {order.scheduledTime} {order.scheduledDate}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-paragraph">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{order.location}</span>
                </div>

                {/* Bottom Row: Agreed Price + Chat + Details */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-paragraph">
                      {order.status === "negotiation" ? "Proposed" : t.agreedPrice}
                    </span>
                    <span className={cn("ml-4 font-bold", order.agreedPrice > 0 ? "text-tertiary" : "text-purple-600")}>
                      {order.agreedPrice > 0
                        ? `Rs. ${order.agreedPrice.toLocaleString()}`
                        : order.status === "negotiation"
                        ? "Negotiating..."
                        : "TBD"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {["negotiation", "accepted", "in-progress"].includes(order.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-1.5"
                        onClick={() => setChatOrder(order)}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat
                      </Button>
                    )}
                    <Button
                      variant="tertiary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {t.viewDetails}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-heading mb-1">
              No {activeTab === "active" ? "active" : "past"} orders
            </h3>
            <p className="text-sm text-paragraph">
              {activeTab === "active"
                ? "New service requests will appear here"
                : "Your completed orders will show here"}
            </p>
          </Card>
        )}
      </div>

      {/* Chat Drawer */}
      {chatOrder && currentUser && (
        <ChatDrawer
          bookingId={chatOrder.id}
          currentUserId={currentUser.id}
          title={chatOrder.serviceName}
          subtitle={chatOrder.customerName}
          onClose={() => setChatOrder(null)}
        />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={async () => {
            const userId = resolveWorkerUserId();
            if (userId) {
              try {
                const profile = getCachedWorkerDashboardProfile() || await getWorkerDashboardProfileByUserId(userId);
                const active = await getWorkerDashboardOrders(profile.workerId, "active");
                setActiveOrders(active as ProviderOrder[]);
                setPastLoaded(false); // invalidate so past reloads next time tab is opened
              } catch (err) {
                console.error("Failed to refresh orders list:", err);
              }
            }
          }}
        />
      )}
    </div>
  );
}
