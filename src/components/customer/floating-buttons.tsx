"use client";

import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 md:bottom-8 md:right-8">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/923001234567"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors"
        aria-label="Contact via WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>

      {/* Phone Button */}
      <a
        href="tel:+923001234567"
        className="w-12 h-12 rounded-full bg-red-400 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors"
        aria-label="Call us"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
