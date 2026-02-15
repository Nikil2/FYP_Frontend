"use client";

import Image from "next/image";

export function PromoBanner() {
  return (
    <div className="px-4 py-2 md:px-6 md:py-4">
      {/* Promo Text */}
      <p className="text-center text-tertiary font-semibold text-base mb-3">
        Professional Services at Your Doorstep
      </p>

      {/* Banner Card */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-tertiary/10 via-tertiary/5 to-pink-50 border border-tertiary/20 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-heading leading-tight">
              Quality Services
              <br />
              at Your Doorstep
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Trusted Professionals • Verified Workers
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-muted-foreground">
                Electrician | Plumber | AC Tech | Cleaning
              </span>
            </div>
          </div>
          <div className="w-24 h-20 flex-shrink-0 rounded-lg bg-tertiary/10 flex items-center justify-center">
            <span className="text-3xl">🏠</span>
          </div>
        </div>
      </div>
    </div>
  );
}
