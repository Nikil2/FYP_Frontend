"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";

/**
 * Conditionally renders Navbar & Footer.
 * Hidden on all /worker/dashboard/* and /dummy routes.
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarFooter =
    pathname.startsWith("/worker/dashboard") ||
    pathname.startsWith("/dummy");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
