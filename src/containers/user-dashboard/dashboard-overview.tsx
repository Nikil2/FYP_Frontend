"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  DollarSign,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  getCustomerProfile,
  getDashboardStats,
  getActiveBookings,
  getBookingHistory,
  getChatConversations,
} from "@/lib/mock-bookings";

function DashboardOverview() {
  const customerProfile = useMemo(() => getCustomerProfile(), []);
  const stats = useMemo(() => getDashboardStats(), []);
  const activeBookings = useMemo(() => getActiveBookings(), []);
  const bookingHistory = useMemo(() => getBookingHistory(), []);
  const conversations = useMemo(() => getChatConversations(), []);

  const recentBookings = [
    ...activeBookings,
    ...bookingHistory.slice(0, 3),
  ].slice(0, 5);

  const getStatusColor = (status: string): "default" | "tertiary" => {
    switch (status) {
      case "pending":
        return "default";
      case "confirmed":
        return "default";
      case "in-progress":
        return "tertiary";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <div className="space-y-8">
      {/* ==================== WELCOME SECTION ==================== */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="mb-1 text-2xl font-bold text-heading md:text-3xl">
            Welcome, {customerProfile.name}!
          </h1>
          <p className="text-paragraph">
            Manage your bookings, messages, and preferences in one place
          </p>
        </div>
        <Avatar
          src={customerProfile.profileImage}
          alt={customerProfile.name}
          size="lg"
          className="flex-shrink-0"
        />
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Bookings Stat */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Active Bookings
              </p>
              <p className="text-3xl font-bold text-heading">
                {stats.activeBookings}
              </p>
            </div>
            <Clock className="h-10 w-10 text-tertiary opacity-20" />
          </div>
        </Card>

        {/* Completed Bookings Stat */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Completed
              </p>
              <p className="text-3xl font-bold text-heading">
                {stats.completedBookings}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 opacity-20 text-green-500" />
          </div>
        </Card>

        {/* Total Spent Stat */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Total Spent
              </p>
              <p className="text-3xl font-bold text-heading">
                Rs. {stats.totalSpent.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-10 w-10 opacity-20 text-blue-500" />
          </div>
        </Card>

        {/* Average Rating Stat */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                Avg Rating
              </p>
              <div className="flex items-center gap-1">
                <p className="text-3xl font-bold text-heading">
                  {stats.averageRating.toFixed(1)}
                </p>
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ==================== ACTIVE BOOKINGS SECTION ==================== */}
      {activeBookings.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-heading">Active Bookings</h2>
            <Link href="/dashboard/active-bookings">
              <Button variant="tertiary" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {activeBookings.slice(0, 2).map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 min-w-0 items-center gap-4">
                    <Avatar
                      src={booking.worker.profileImage}
                      alt={booking.worker.name}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-semibold text-heading">
                        {booking.worker.name}
                      </h3>
                      <p className="text-sm text-paragraph">
                        {booking.serviceName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {booking.scheduledDate} at {booking.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== RECENT ACTIVITY SECTION ==================== */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Recent Bookings */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-heading">Recent Bookings</h2>
            <Link href="/dashboard/booking-history">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg bg-secondary-background p-3 transition-colors hover:bg-muted"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-heading">
                    {booking.serviceName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rs. {booking.finalCost || booking.estimatedCost}
                  </p>
                </div>
                <Badge
                  variant={getStatusColor(booking.status)}
                  className="ml-2 flex-shrink-0 text-xs"
                >
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-heading">Recent Messages</h2>
            <Link href="/dashboard/messages">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {conversations.slice(0, 5).map((conversation) => (
              <Link
                key={conversation.id}
                href={`/dashboard/messages?worker=${conversation.workerId}`}
                className="block"
              >
                <div className="flex items-center justify-between rounded-lg bg-secondary-background p-3 transition-colors hover:bg-muted">
                  <div className="flex flex-1 min-w-0 items-center gap-3">
                    <Avatar
                      src={conversation.workerImage}
                      alt={conversation.workerName}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-heading">
                        {conversation.workerName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center justify-center rounded-full bg-tertiary px-2 py-1 text-xs font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
