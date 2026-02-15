"use client";

import { useEffect } from "react";
import { X, LogIn, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
}

export function LoginPromptModal({
  isOpen,
  onClose,
  serviceName,
}: LoginPromptModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md mx-auto p-6 md:p-8 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-heading"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-8 h-8 text-tertiary" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">
            Login Required
          </h2>
          <p className="text-paragraph">
            {serviceName
              ? `To book "${serviceName}", please login or create an account first.`
              : "To book a service or chat with workers, please login or create an account first."}
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 mb-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-tertiary" />
            Verified Workers
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-tertiary" />
            Secure Booking
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a href="/auth/login" className="block">
            <Button variant="tertiary" size="lg" className="w-full">
              <LogIn className="w-5 h-5 mr-2" />
              Login to Your Account
            </Button>
          </a>
          <a href="/auth/signup/customer" className="block">
            <Button variant="outline" size="lg" className="w-full">
              <UserPlus className="w-5 h-5 mr-2" />
              Create New Account
            </Button>
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-5">
          Are you a worker?{" "}
          <a
            href="/auth/signup/worker"
            className="text-tertiary hover:underline font-medium"
          >
            Register as Worker
          </a>
        </p>
      </div>
    </div>
  );
}
