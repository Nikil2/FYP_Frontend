import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import "../styles/globals.css";

// FONT CONFIGURATIONS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mehnati - Pakistan's Trusted Marketplace for Skilled Workers",
  description:
    "Connect with verified electricians, plumbers, carpenters, painters, AC technicians, and masons across Pakistan. CNIC-verified workers, real-time tracking, transparent pricing.",
  keywords: [
    "skilled workers pakistan",
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "AC technician",
    "mason",
    "home services pakistan",
  ],
  openGraph: {
    title: "Mehnati - Pakistan's Trusted Marketplace for Skilled Workers",
    description:
      "Connect with verified skilled workers in minutes. Trusted by thousands across Pakistan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-background text-foreground font-body antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
