# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mehnati Marketplace** - A Next.js platform connecting customers with skilled workers (electricians, plumbers, carpenters, etc.) across Pakistan. Bilingual support (English/Urdu).

## Commands

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS + class-variance-authority for variants
- **Language:** TypeScript (strict mode)
- **Path Alias:** `@/*` → `./src/*`

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login/signup pages
│   ├── customer/          # Customer dashboard & booking flow
│   ├── worker/            # Worker dashboard & profile
│   └── layout.tsx         # Root layout with LayoutShell
├── components/
│   ├── auth/              # Authentication forms (wizard-style)
│   ├── customer/          # Customer-specific components
│   ├── worker-dashboard/  # Worker dashboard components
│   ├── landing/           # Landing page sections
│   ├── layouts/           # LayoutShell, Navbar, Footer
│   ├── modals/            # Reusable modals
│   ├── search/            # Search functionality
│   ├── ui/                # Base UI components (button, card, badge, avatar)
│   └── worker-detail/     # Worker detail page components
├── api/                   # API client layer
│   ├── client.ts          # Base HTTP client (ApiClient class)
│   ├── config.ts          # API_CONFIG with endpoints
│   ├── types.ts           # API types (ApiResponse, ApiError)
│   └── services/          # Service modules (users, workers, services, uploads)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & shared logic
│   ├── auth.ts            # Auth helpers, token management, validation
│   ├── services-data.ts   # SERVICE_CATEGORIES (8 categories with sub-services)
│   ├── constants.ts       # App constants
│   ├── utils.ts           # Utility functions
│   └── mock-*.ts          # Mock data for development
├── types/                 # TypeScript type definitions
│   ├── customer.ts        # Customer booking types
│   ├── worker.ts          # Worker detail types
│   ├── booking.ts         # Booking status & data types
│   └── provider.ts        # Provider dashboard types
└── interfaces/            # Interface definitions
    ├── auth-interfaces.ts # User, WorkerProfile, auth forms
    └── landing-interfaces.ts
```

### Key Patterns

**LayoutShell** (`src/components/layouts/LayoutShell.tsx`):
- Conditionally renders Navbar/Footer
- Hidden on `/worker/dashboard/*`, `/customer/*`, and `/dummy` routes

**API Client** (`src/api/client.ts`):
- Singleton `apiClient` instance with GET/POST/PUT/DELETE/PATCH methods
- `upload()` method for FormData (auto-sets boundary header)
- Request timeout: 30s
- Credentials: include (CORS)
- Base URL from `NEXT_PUBLIC_API_URL` or `REACT_APP_API_URL` env var

**Authentication** (`src/lib/auth.ts`):
- Token stored in localStorage (`authToken`)
- Role stored in localStorage (`userRole`)
- Helper functions: `setAuthToken`, `getAuthToken`, `isAuthenticated`, `logout`
- Validation: Pakistani phone numbers (`/^(\+92|0)?3[0-9]{9}$/`), CNIC (`/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/`)

**Service Categories** (`src/lib/services-data.ts`):
- 8 categories: Electrician, Plumber, Carpenter, Painter, AC Technician, Mason, Mechanic, Home Cleaner
- Each has English + Urdu names and sub-services

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
# or
REACT_APP_API_URL=http://localhost:4000
```

### User Roles

- `CUSTOMER` - Books services
- `WORKER` - Provides services (goes through verification)
- `ADMIN` - Platform management
