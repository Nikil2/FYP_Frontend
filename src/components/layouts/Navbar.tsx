"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import logo from "../../../public/icons/mehnati-logo.png";

import { Button } from "@/components/ui/button";

import { Menu, X, ChevronDown, Search } from "lucide-react";

import { NAV_LINKS } from "@/content/landing/landing-page-content";
import { SearchResultsDropdown } from "@/components/search/search-results-dropdown";
import { searchWorkers } from "@/lib/mock-data";
import type { WorkerDetail } from "@/types/worker";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WorkerDetail[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search with debouncing (300ms)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Only search if query has at least 2 characters
    if (value.length >= 2) {
      const timer = setTimeout(() => {
        const results = searchWorkers(value);
        setSearchResults(results);
        setIsSearchOpen(true);
      }, 300);
      setDebounceTimer(timer);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

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

          {/* Desktop Navigation + Search */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {/* Navigation Links */}
            <div className="flex items-center gap-8">
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

            {/* Search Bar - Desktop */}
            <div className="relative w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-paragraph pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() =>
                    searchResults.length > 0 && setIsSearchOpen(true)
                  }
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary animation-standard"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-heading animation-standard"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              <SearchResultsDropdown
                results={searchResults}
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                query={searchQuery}
              />
            </div>
          </div>

          {/* Desktop Auth & Language */}
          <div className="hidden md:flex items-center gap-4">
            {/* Login Button */}
            <a href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </a>

            {/* Signup Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover rounded-lg animation-standard font-medium"
              >
                Sign Up
                <ChevronDown className="w-4 h-4" />
              </button>

              {isAuthDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <a
                    href="/auth/signup/customer"
                    className="block px-4 py-3 hover:bg-muted animation-standard text-paragraph hover:text-heading"
                  >
                    As Customer
                  </a>
                  <a
                    href="/auth/signup/worker"
                    className="block px-4 py-3 hover:bg-muted animation-standard text-paragraph hover:text-heading"
                  >
                    As Worker
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Buttons - Search + Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              className="p-2 hover:bg-muted rounded-lg animation-standard"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? (
                <X className="w-6 h-6 text-heading" />
              ) : (
                <Search className="w-6 h-6 text-heading" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 hover:bg-muted rounded-lg animation-standard"
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
        </div>

        {/* Mobile Search - Collapsible */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-3 py-3 border-t border-border bg-secondary-background relative z-40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-paragraph pointer-events-none" />
              <input
                type="text"
                placeholder="Search workers..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchResults.length > 0 && setIsSearchOpen(true)
                }
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary animation-standard"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-heading animation-standard"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <SearchResultsDropdown
                results={searchResults}
                isOpen={isSearchOpen}
                onClose={() => {
                  setIsSearchOpen(false);
                  setIsMobileSearchOpen(false);
                }}
                query={searchQuery}
              />
            )}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No workers found for "{searchQuery}"
              </p>
            )}
          </div>
        )}

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
                <a href="/auth/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </a>
                <a href="/auth/signup/customer" className="w-full">
                  <Button variant="tertiary" size="sm" className="w-full">
                    Sign Up as Customer
                  </Button>
                </a>
                <a href="/auth/signup/worker" className="w-full">
                  <Button variant="tertiary" size="sm" className="w-full">
                    Sign Up as Worker
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
