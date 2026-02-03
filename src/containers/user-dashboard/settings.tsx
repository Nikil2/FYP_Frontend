"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { getCustomerProfile } from "@/lib/mock-bookings";

function Settings() {
  const customerProfile = useMemo(() => getCustomerProfile(), []);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: customerProfile.name,
    email: customerProfile.email,
    phone: customerProfile.phone,
  });

  /* ==================== HANDLERS ==================== */
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // In a real app, this would update the backend
  };

  const handleCancel = () => {
    setFormData({
      name: customerProfile.name,
      email: customerProfile.email,
      phone: customerProfile.phone,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ==================== PAGE HEADER ==================== */}
      <div>
        <h1 className="mb-1 text-3xl font-bold text-heading">Settings</h1>
        <p className="text-paragraph">
          Manage your profile and account preferences
        </p>
      </div>

      {/* ==================== PROFILE SECTION ==================== */}
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-heading">
            Profile Information
          </h2>
          {!isEditingProfile && (
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          /* ==================== EDIT PROFILE FORM ==================== */
          <form className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-paragraph focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-paragraph focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-paragraph focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="button"
                variant="tertiary"
                className="flex-1"
                onClick={handleSaveProfile}
              >
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          /* ==================== PROFILE DISPLAY ==================== */
          <div className="space-y-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <Avatar
                src={customerProfile.profileImage}
                alt={customerProfile.name}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-bold text-heading">
                  {customerProfile.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Member since{" "}
                  {new Date(customerProfile.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                    },
                  )}
                </p>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Full Name */}
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-tertiary" />
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Full Name
                  </p>
                  <p className="font-medium text-heading">{formData.name}</p>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-tertiary" />
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Email Address
                  </p>
                  <p className="font-medium text-heading">{formData.email}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-tertiary" />
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="font-medium text-heading">{formData.phone}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-start gap-3">
                <Badge variant="tertiary">Verified</Badge>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Account Status
                  </p>
                  <p className="font-medium text-heading">Active & Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ==================== NOTIFICATION PREFERENCES ==================== */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-heading">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {[
            {
              title: "Booking Updates",
              description: "Get notified when your booking status changes",
              enabled: true,
            },
            {
              title: "Worker Messages",
              description: "Get notified when workers send you messages",
              enabled: true,
            },
            {
              title: "Special Offers",
              description:
                "Receive notifications about special discounts and offers",
              enabled: false,
            },
          ].map((notification, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-heading">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <label className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={notification.enabled}
                  className="h-5 w-5 rounded text-tertiary focus:ring-2 focus:ring-tertiary"
                />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* ==================== SECURITY SECTION ==================== */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-heading">
          <Lock className="h-5 w-5" />
          Security
        </h2>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Enable Two-Factor Authentication
          </Button>
        </div>
      </Card>

      {/* ==================== SUPPORT SECTION ==================== */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-heading">
          <HelpCircle className="h-5 w-5" />
          Support & Help
        </h2>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            View FAQ
          </Button>
          <Button variant="outline" className="w-full">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full">
            Report an Issue
          </Button>
        </div>
      </Card>

      {/* ==================== DANGER ZONE ==================== */}
      <Card className="border-red-200 bg-red-50 p-6">
        <h2 className="mb-4 text-xl font-bold text-red-700">Danger Zone</h2>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout from All Devices
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete your account? This action cannot be undone.",
                )
              ) {
                // Handle account deletion
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;
