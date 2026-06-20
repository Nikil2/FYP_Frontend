"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import logo from "../../../public/icons/mehnati-logo.png";

import { SearchResultsDropdown } from "@/components/search/search-results-dropdown";

import { Button } from "@/components/ui/button";

import { Menu, X, ChevronDown, Search, LogOut, LayoutDashboard } from "lucide-react";

import { NAV_LINKS } from "@/content/landing/landing-page-content";

import { searchWorkers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getAuthUser, getUserRole, logout } from "@/lib/auth";

import type { WorkerDetail } from "@/types/worker";
import type { User } from "@/interfaces/auth-interfaces";

/** Map a role to its home/dashboard route. */
function dashboardPath(role: string | null): string {
  if (role === "WORKER") return "/worker/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/customer";
}

export function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname.startsWith("/auth");
  
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Auth state — read from localStorage on the client only (avoids SSR
  // hydration mismatch). Re-checks when the route changes.
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    setAuthUser(getAuthUser());
    setUserRole(getUserRole());
  }, [pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

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
        "fixed top-0 left-0 right-0 z-50 animation-standard border-b border-border",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-card",
      )}
    >
      <div className="layout-standard">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image src={logo} alt="Logo" width={150} height={40} />
          </a>

          {/* Desktop Navigation + Search - Hidden on Landing Page & Auth Pages */}
          {!isLandingPage && !isAuthPage && (
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {/* Navigation Links */}
              <div className="flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-heading hover:text-tertiary animation-standard font-medium"
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
          )}

          {/* Desktop Auth & Language */}
          <div className="hidden md:flex items-center gap-4">
            {authUser ? (
              /* Logged-in: user menu */
              <div className="relative">
                <button
                  onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted animation-standard"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary text-tertiary-foreground text-sm font-semibold">
                    {authUser.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span className="font-medium text-heading max-w-[120px] truncate">
                    {authUser.fullName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-paragraph" />
                </button>

                {isAuthDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                    <a
                      href={dashboardPath(userRole)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-muted animation-standard text-paragraph hover:text-heading"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </a>
                    <button
                      onClick={() => logout()}
                      className="flex w-full items-center gap-2 px-4 py-3 hover:bg-muted animation-standard text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Buttons - Always visible except auth pages */}
          {!isAuthPage && (
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Search Toggle - only on non-landing pages */}
              {!isLandingPage && (
                <button
                  className="p-2 hover:bg-muted rounded-lg animation-standard text-heading"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  aria-label="Toggle search"
                >
                  {isMobileSearchOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="p-2 hover:bg-muted rounded-lg animation-standard text-heading"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Search - Collapsible */}
        {!isLandingPage && !isAuthPage && isMobileSearchOpen && (
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
        {!isAuthPage && isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-border bg-card"
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {/* Nav links - only on non-landing pages */}
              {!isLandingPage && (
                <>
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-heading hover:text-tertiary hover:bg-muted animation-standard font-medium px-3 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="border-t border-border my-2" />
                </>
              )}

              {/* Auth section */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
                {authUser ? "Account" : isLandingPage ? "Get Started" : "Account"}
              </p>
              {authUser ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary text-tertiary-foreground text-sm font-semibold">
                      {authUser.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <span className="font-medium text-heading truncate">
                      {authUser.fullName}
                    </span>
                  </div>
                  <a
                    href={dashboardPath(userRole)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-muted animation-standard text-heading font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </a>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-muted animation-standard text-red-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="flex items-center px-3 py-3 rounded-lg hover:bg-muted animation-standard text-heading font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/auth/signup/customer"
                    className="flex items-center px-3 py-3 rounded-lg hover:bg-muted animation-standard text-heading font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up as Customer
                  </a>
                  <a
                    href="/auth/signup/worker"
                    className="flex items-center px-3 py-3 rounded-lg hover:bg-muted animation-standard text-heading font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up as Worker
                  </a>
                </>
              )}

              {/* CTA buttons for landing page */}
              {isLandingPage && (
                <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-border">
                  <a href="/auth/signup/customer" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="tertiary" size="sm" className="w-full">
                      Browse Services
                    </Button>
                  </a>
                  <a href="/auth/signup/worker" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Earning
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
