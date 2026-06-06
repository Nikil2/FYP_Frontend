"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { NotificationBell } from "./notification-bell";

interface CustomerHeaderProps {
  userName?: string;
  profileImage?: string;
  notificationCount?: number;
}

export function CustomerHeader({ userName = "Guest", profileImage }: CustomerHeaderProps) {
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
            userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
          )}
        </button>
        <div>
          <p className="text-sm text-heading font-semibold">
            Hi {userName.split(" ")[0]},{" "}
            <span className="text-tertiary">Welcome to Mehnati</span>
          </p>
        </div>
      </div>

      <NotificationBell />
    </div>
  );
}
