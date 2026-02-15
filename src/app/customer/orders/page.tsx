"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ChevronRight,
  User,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingButtons } from "@/components/customer/floating-buttons";
import {
  getCurrentCustomer,
  type CustomerBooking,
} from "@/app/dummy/dummy-customers";

const TABS = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function getStatusBadge(status: CustomerBooking["status"]) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: Clock,
      };
    case "confirmed":
      return {
        label: "Confirmed",
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: CheckCircle2,
      };
    case "in-progress":
      return {
        label: "In Progress",
        bg: "bg-tertiary/10",
        text: "text-tertiary",
        icon: Clock,
      };
    case "completed":
      return {
        label: "Completed",
        bg: "bg-green-50",
        text: "text-green-700",
        icon: CheckCircle2,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-red-50",
        text: "text-red-600",
        icon: XCircle,
      };
    default:
      return {
        label: status,
        bg: "bg-gray-50",
        text: "text-gray-700",
        icon: Clock,
      };
  }
}

function BookingCard({ booking }: { booking: CustomerBooking }) {
  const router = useRouter();
  const badge = getStatusBadge(booking.status);
  const BadgeIcon = badge.icon;

  return (
    <button
      onClick={() => router.push(`/customer/orders/${booking.id}`)}
      className="w-full text-left bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      {/* Top Row: Service + Status */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-heading leading-tight">
            {booking.serviceName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {booking.categoryName}
          </p>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0",
            badge.bg,
            badge.text
          )}
        >
          <BadgeIcon className="w-3 h-3" />
          {badge.label}
        </span>
      </div>

      {/* Worker Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-tertiary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-heading truncate">
            {booking.workerName}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-muted-foreground">
              {booking.workerRating}
            </span>
          </div>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(booking.scheduledDate).toLocaleDateString("en-PK", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>• {booking.scheduledTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
        <MapPin className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">{booking.location}</span>
      </div>

      {/* Bottom Row: Price + Arrow */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <span className="text-sm font-bold text-heading">
          Rs. {booking.price.toLocaleString()}
        </span>
        <div className="flex items-center gap-1 text-xs text-tertiary font-medium">
          View Details
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Rating if completed */}
      {booking.status === "completed" && booking.rating && (
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] text-muted-foreground">Your rating:</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < booking.rating!
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200"
              )}
            />
          ))}
        </div>
      )}
    </button>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("active");
  const [activeBookings, setActiveBookings] = useState<CustomerBooking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<
    CustomerBooking[]
  >([]);
  const [cancelledBookings, setCancelledBookings] = useState<
    CustomerBooking[]
  >([]);

  useEffect(() => {
    const customer = getCurrentCustomer();
    if (customer) {
      setActiveBookings(customer.activeBookings);
      setCompletedBookings(
        customer.pastBookings.filter((b) => b.status === "completed")
      );
      setCancelledBookings(
        customer.pastBookings.filter((b) => b.status === "cancelled")
      );
    }
  }, []);

  const getBookings = () => {
    switch (activeTab) {
      case "active":
        return activeBookings;
      case "completed":
        return completedBookings;
      case "cancelled":
        return cancelledBookings;
    }
  };

  const currentBookings = getBookings();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/customer")}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors md:hidden"
        >
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <h1 className="text-lg font-semibold text-heading">My Orders</h1>
      </div>

      {/* Tab Bar */}
      <div className="bg-white px-4 pt-2 pb-0 border-b border-border">
        <div className="flex">
          {TABS.map((tab) => {
            const count =
              tab.id === "active"
                ? activeBookings.length
                : tab.id === "completed"
                ? completedBookings.length
                : cancelledBookings.length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 pb-3 text-sm font-medium text-center border-b-2 transition-colors relative",
                  activeTab === tab.id
                    ? "text-tertiary border-tertiary"
                    : "text-muted-foreground border-transparent hover:text-heading"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "ml-1 text-[10px] px-1.5 py-0.5 rounded-full",
                      activeTab === tab.id
                        ? "bg-tertiary text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 space-y-3 md:p-6 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {currentBookings.length > 0 ? (
          currentBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-tertiary" />
            </div>
            <h2 className="text-base font-semibold text-heading mb-1">
              No {activeTab} orders
            </h2>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              {activeTab === "active"
                ? "You don't have any active orders. Browse services to book one!"
                : activeTab === "completed"
                ? "No completed orders yet. Your finished orders will appear here."
                : "No cancelled orders. Great job keeping your bookings!"}
            </p>
            {activeTab === "active" && (
              <a
                href="/customer"
                className="mt-3 text-sm font-medium text-tertiary hover:text-tertiary-hover transition-colors"
              >
                Browse Services →
              </a>
            )}
          </div>
        )}
      </div>

      <FloatingButtons />
    </div>
  );
}
