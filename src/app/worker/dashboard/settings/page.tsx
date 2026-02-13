"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "@/components/worker-dashboard/language-toggle";
import { OnlineToggle } from "@/components/worker-dashboard/online-toggle";
import {
  Bell,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
} from "lucide-react";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          label: "Push Notifications",
          icon: Bell,
          type: "toggle" as const,
          value: notificationsEnabled,
          onChange: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          label: "Dark Mode",
          icon: Moon,
          type: "toggle" as const,
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
        {
          label: "App Language",
          icon: Globe,
          type: "custom" as const,
        },
        {
          label: "Availability Status",
          icon: Smartphone,
          type: "availability" as const,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          label: "Help Center",
          icon: HelpCircle,
          type: "link" as const,
        },
        {
          label: "Terms & Conditions",
          icon: FileText,
          type: "link" as const,
        },
        {
          label: "Privacy Policy",
          icon: Shield,
          type: "link" as const,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">
        {t.settings}
      </h1>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-base font-bold text-heading mb-3 px-1">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-tertiary" />
                    <span className="font-medium text-heading">
                      {item.label}
                    </span>
                  </div>

                  {item.type === "toggle" && (
                    <button
                      onClick={item.onChange}
                      className={`relative w-11 h-6 rounded-full animation-standard flex-shrink-0 ${
                        item.value ? "bg-tertiary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md animation-standard ${
                          item.value ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  )}

                  {item.type === "custom" && <LanguageToggle />}

                  {item.type === "availability" && (
                    <OnlineToggle initialStatus={true} />
                  )}

                  {item.type === "link" && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout */}
      <Card className="p-0 overflow-hidden">
        <button
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-50 animation-standard font-medium"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </Card>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground pb-8">
        <p>Mehnati Marketplace v1.0.0</p>
        <p className="mt-1">© 2026 Mehnati. All rights reserved.</p>
      </div>
    </div>
  );
}
