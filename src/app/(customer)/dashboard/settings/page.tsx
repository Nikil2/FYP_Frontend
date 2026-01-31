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

export default function SettingsPage() {
  const customerProfile = useMemo(() => getCustomerProfile(), []);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: customerProfile.name,
    email: customerProfile.email,
    phone: customerProfile.phone,
  });

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
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Settings</h1>
        <p className="text-paragraph">
          Manage your profile and account preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-bold text-heading">Profile Information</h2>
          {!isEditingProfile && (
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          <form className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-paragraph focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-paragraph focus:outline-none focus:ring-2 focus:ring-tertiary"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-paragraph focus:outline-none focus:ring-2 focus:ring-tertiary"
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
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                variant="tertiary"
                className="flex-1"
                onClick={handleSaveProfile}
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
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
                    }
                  )}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="font-medium text-heading">{formData.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Email Address
                  </p>
                  <p className="font-medium text-heading">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Phone Number
                  </p>
                  <p className="font-medium text-heading">{formData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary">Verified</Badge>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Account Status
                  </p>
                  <p className="font-medium text-heading">Active & Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
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
              description: "Receive notifications about special discounts and offers",
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
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={notification.enabled}
                  className="w-5 h-5 text-tertiary rounded focus:ring-2 focus:ring-tertiary"
                />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Security
        </h2>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            Enable Two-Factor Authentication
          </Button>
        </div>
      </Card>

      {/* Support Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
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

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>

        <div className="space-y-3">
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout from All Devices
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete your account? This action cannot be undone."
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
