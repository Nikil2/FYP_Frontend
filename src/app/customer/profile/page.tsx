"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Bell,
  Heart,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCurrentCustomer,
  type DummyCustomerAccount,
} from "@/app/dummy/dummy-customers";
import { logout } from "@/lib/auth";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  color?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<DummyCustomerAccount | null>(null);

  useEffect(() => {
    const c = getCurrentCustomer();
    setCustomer(c);
  }, []);

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: "My Activity",
      items: [
        {
          icon: ClipboardList,
          label: "My Orders",
          href: "/customer/orders",
          badge:
            customer && customer.activeBookings.length > 0
              ? `${customer.activeBookings.length} active`
              : undefined,
        },
        {
          icon: Award,
          label: "Rewards",
          href: "/customer/rewards",
          badge: customer ? `${customer.profile.rewardPoints} pts` : undefined,
        },
        {
          icon: Heart,
          label: "Saved Workers",
          href: "/customer/saved",
        },
        {
          icon: Bell,
          label: "Notifications",
          href: "/customer/notifications",
          badge:
            customer &&
            customer.notifications.filter((n) => !n.read).length > 0
              ? `${customer.notifications.filter((n) => !n.read).length} new`
              : undefined,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Settings,
          label: "Account Settings",
          href: "/customer/settings",
        },
        {
          icon: MapPin,
          label: "Saved Addresses",
          href: "/customer/addresses",
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          href: "/customer/privacy",
        },
        {
          icon: FileText,
          label: "Terms & Conditions",
          href: "/customer/terms",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          href: "/customer/help",
        },
        {
          icon: LogOut,
          label: "Logout",
          onClick: () => logout(),
          color: "text-red-600",
        },
      ],
    },
  ];

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
        <h1 className="text-lg font-semibold text-heading">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-tertiary/20 flex items-center justify-center border-2 border-tertiary">
            {customer?.profile.profileImage ? (
              <img
                src={customer.profile.profileImage}
                alt={customer.profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-tertiary">
                {customer?.profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "G"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-heading">
              {customer?.profile.name || "Guest User"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {customer?.profile.phone || "Not logged in"}
            </p>
            <p className="text-xs text-muted-foreground">
              {customer?.profile.city || ""}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {customer && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-heading">
                {customer.profile.totalBookings}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Total Bookings
              </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-tertiary">
                {customer.profile.rewardPoints}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Reward Points
              </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-heading">
                {customer.activeBookings.length}
              </p>
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
          </div>
        )}
      </div>

      {/* Personal Info */}
      {customer && (
        <div className="bg-white mt-3 p-4 border-y border-border">
          <h3 className="text-sm font-semibold text-heading mb-3">
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Full Name</p>
                <p className="text-sm text-heading">{customer.profile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Phone</p>
                <p className="text-sm text-heading">
                  {customer.profile.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Email</p>
                <p className="text-sm text-heading">
                  {customer.profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Address</p>
                <p className="text-sm text-heading">
                  {customer.profile.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-tertiary" />
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Member Since
                </p>
                <p className="text-sm text-heading">
                  {new Date(customer.profile.joinedDate).toLocaleDateString(
                    "en-PK",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div
          key={section.title}
          className="bg-white mt-3 border-y border-border"
        >
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">
            {section.title}
          </p>
          {section.items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.href) router.push(item.href);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                  idx < section.items.length - 1 &&
                    "border-b border-border"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    item.color || "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "flex-1 text-sm font-medium text-left",
                    item.color || "text-heading"
                  )}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-semibold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {!item.onClick && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* App version */}
      <div className="text-center py-6">
        <p className="text-[10px] text-muted-foreground">Mehnati v1.0.0</p>
      </div>
    </div>
  );
}
