"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";

interface CustomerHeaderProps {
  userName?: string;
  profileImage?: string;
  notificationCount?: number;
}

export function CustomerHeader({
  userName = "Guest",
  profileImage,
  notificationCount = 0,
}: CustomerHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
      {/* Left - Avatar + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/profile")}
          className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary font-bold text-sm overflow-hidden border-2 border-tertiary"
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt={userName}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          )}
        </button>
        <div>
          <p className="text-sm text-heading font-semibold">
            Hi {userName.split(" ")[0]},{" "}
            <span className="text-tertiary">Welcome to Mehnati</span>
          </p>
        </div>
      </div>

      {/* Right - Notification */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/customer/notifications")}
          className="relative"
        >
          <Bell className="w-6 h-6 text-heading" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
