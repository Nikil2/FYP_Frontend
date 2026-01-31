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
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import {
  getCustomerProfile,
  getDashboardStats,
  getActiveBookings,
  getBookingHistory,
  getChatConversations,
} from "@/lib/mock-bookings";

export default function DashboardOverviewPage() {
  const customerProfile = useMemo(() => getCustomerProfile(), []);
  const stats = useMemo(() => getDashboardStats(), []);
  const activeBookings = useMemo(() => getActiveBookings(), []);
  const bookingHistory = useMemo(() => getBookingHistory(), []);
  const conversations = useMemo(() => getChatConversations(), []);

  const recentBookings = [
    ...activeBookings,
    ...bookingHistory.slice(0, 3),
  ].slice(0, 5);

  const getStatusColor = (
    status: string,
  ): "default" | "tertiary" => {
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
      {/* Welcome Section with Profile */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading mb-1">
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
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Active Bookings
              </p>
              <p className="text-3xl font-bold text-heading">
                {stats.activeBookings}
              </p>
            </div>
            <Clock className="w-10 h-10 text-tertiary opacity-20" />
          </div>
        </Card>

        {/* Completed Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Completed
              </p>
              <p className="text-3xl font-bold text-heading">
                {stats.completedBookings}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>

        {/* Total Spent */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Total Spent
              </p>
              <p className="text-3xl font-bold text-heading">
                Rs. {stats.totalSpent.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        {/* Average Rating */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Avg Rating
              </p>
              <div className="flex items-center gap-1">
                <p className="text-3xl font-bold text-heading">
                  {stats.averageRating.toFixed(1)}
                </p>
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-heading">Active Bookings</h2>
            <Link href="/dashboard/active-bookings">
              <Button variant="tertiary" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {activeBookings.slice(0, 2).map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar
                      src={booking.worker.profileImage}
                      alt={booking.worker.name}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-heading truncate">
                        {booking.worker.name}
                      </h3>
                      <p className="text-sm text-paragraph">
                        {booking.serviceName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
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

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
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
                className="flex items-center justify-between p-3 bg-secondary-background rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-heading truncate">
                    {booking.serviceName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rs. {booking.finalCost || booking.estimatedCost}
                  </p>
                </div>
                <Badge
                  variant={getStatusColor(booking.status)}
                  className="text-xs flex-shrink-0 ml-2"
                >
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
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
                <div className="flex items-center justify-between p-3 bg-secondary-background rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar
                      src={conversation.workerImage}
                      alt={conversation.workerName}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">
                        {conversation.workerName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-tertiary rounded-full">
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
