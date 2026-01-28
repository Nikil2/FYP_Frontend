"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import logo from "../../../public/icons/mehnati-logo.png";

import { Button } from "@/components/ui/button";

import { Menu, X, ChevronDown, Globe } from "lucide-react";

import { NAV_LINKS } from "@/content/landing/landing-page-content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 animation-standard",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent",
      )}
    >
      <div className="layout-standard">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image src={logo} alt="Logo" width={150} height={40} />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-paragraph hover:text-heading animation-standard font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth & Language */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            {/* <button
              className="p-2 hover:bg-muted rounded-lg animation-standard"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5 text-paragraph" />
            </button> */}

            {/* Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-paragraph hover:text-heading animation-standard"
              >
                Login
                <ChevronDown className="w-4 h-4" />
              </button>

              {isAuthDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <a
                    href="/login/customer"
                    className="block px-4 py-3 hover:bg-muted animation-standard text-paragraph hover:text-heading"
                  >
                    As Customer
                  </a>
                  <a
                    href="/login/worker"
                    className="block px-4 py-3 hover:bg-muted animation-standard text-paragraph hover:text-heading"
                  >
                    As Worker
                  </a>
                </div>
              )}
            </div>

            <Button variant="tertiary" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-heading" />
            ) : (
              <Menu className="w-6 h-6 text-heading" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-paragraph hover:text-heading animation-standard font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full">
                  Login as Customer
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Login as Worker
                </Button>
                <Button variant="tertiary" size="sm" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
