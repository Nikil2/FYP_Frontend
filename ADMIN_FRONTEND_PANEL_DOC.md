# Admin Panel Frontend Documentation

## Overview

This document describes the admin panel frontend implementation added in `FYP-frontend 2`.

Current status:
- Frontend is implemented and usable.
- Backend integration is not connected yet (UI uses mock data and local session storage).

## Implemented Architecture

### Admin Route Structure

- `/admin` -> redirects to `/admin/login`
- `/admin/login` -> separate admin login page
- `/admin/dashboard` -> dashboard overview
- `/admin/users` -> user management
- `/admin/workers` -> worker overview + quality snapshot
- `/admin/workers/verification` -> worker verification queue
- `/admin/complaints` -> complaint moderation
- `/admin/reviews` -> reviews and ratings moderation
- `/admin/services` -> service category management
- `/admin/analytics` -> analytics view
- `/admin/revenue` -> revenue reports
- `/admin/settings` -> admin settings (frontend-only)

### Route Grouping

Admin panel pages are grouped under:

- `src/app/admin/(panel)/...`

The group uses a dedicated layout:

- `src/app/admin/(panel)/layout.tsx`

## Files Created/Updated

### New App Routes

- `src/app/admin/page.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/(panel)/layout.tsx`
- `src/app/admin/(panel)/dashboard/page.tsx`
- `src/app/admin/(panel)/users/page.tsx`
- `src/app/admin/(panel)/workers/page.tsx`
- `src/app/admin/(panel)/workers/verification/page.tsx`
- `src/app/admin/(panel)/complaints/page.tsx`
- `src/app/admin/(panel)/reviews/page.tsx`
- `src/app/admin/(panel)/services/page.tsx`
- `src/app/admin/(panel)/analytics/page.tsx`
- `src/app/admin/(panel)/revenue/page.tsx`
- `src/app/admin/(panel)/settings/page.tsx`

### New Shared Admin Components

- `src/components/admin/AdminShell.tsx`
- `src/components/admin/AdminPageHeader.tsx`
- `src/components/admin/MetricCard.tsx`

### New Admin Data/Auth Utilities

- `src/lib/admin-auth.ts`
- `src/lib/admin-mock-data.ts`

### Existing File Updated

- `src/components/layouts/LayoutShell.tsx`
  - Global Navbar/Footer are hidden for `/admin/*` routes.

## Authentication (Frontend-Only)

Admin login currently uses local mock credentials and localStorage session.

### Session key

- `adminSession`

### Demo credentials

- `admin@mehnati.pk` / `admin123`
- `moderator@mehnati.pk` / `mod123`

### Session helpers

Implemented in `src/lib/admin-auth.ts`:

- `validateAdminCredentials(...)`
- `setAdminSession(...)`
- `getAdminSession(...)`
- `clearAdminSession(...)`
- `isAdminLoggedIn()`

## Features Implemented by Page

### 1) Login (`/admin/login`)

- Separate admin login UI.
- Password visibility toggle.
- Demo account cards shown on page.
- Redirect to `/admin/dashboard` if session exists.

### 2) Dashboard (`/admin/dashboard`)

- Top-level KPI cards:
  - Total users
  - Verified workers
  - Bookings today
  - Revenue (month)
  - Average worker rating
- Weekly booking trend chart (mock visualization)
- Operational pulse panel:
  - Open complaints
  - Pending verifications
  - Online workers
  - Pending payouts
  - Average resolution time
  - Flagged reviews count
- Recent admin activity list
- Open complaints snapshot
- Worker quality snapshot cards

### 3) Users (`/admin/users`)

- Search by name/phone/ID.
- Role filter (`CUSTOMER`, `WORKER`, `ADMIN`).
- Status filter (`Active`, `Blocked`).
- Block/unblock action in table (frontend state update).

### 4) Workers (`/admin/workers`)

- Worker-level metrics:
  - Total worker records
  - Verified workers
  - Blocked workers
  - Average worker rating
- Worker account cards with status badges.
- Verification snapshot panel.
- Worker ratings health panel:
  - Rating
  - Total reviews
  - Flagged reviews
  - Completion percentage

### 5) Worker Verification (`/admin/workers/verification`)

- Pending queue of worker submissions.
- Approve/reject actions (frontend simulation).
- Recent decision history panel.

### 6) Complaints (`/admin/complaints`)

- List complaint records with severity/status badges.
- Resolve action (frontend state toggle).
- Assign button placeholder for future backend flow.

### 7) Reviews (`/admin/reviews`)

- Dedicated moderation view for ratings/reviews.
- Filters:
  - All
  - Flagged
  - 1-2 star
- Review visibility moderation:
  - Hide/unhide review
- Flag metadata display:
  - Report reason
- Worker rating health sidebar

### 8) Services (`/admin/services`)

- Add service category (English + Urdu).
- Edit service name.
- Enable/disable category status.
- Table view for category management.

### 9) Analytics (`/admin/analytics`)

- Booking completion and dispute ratio cards.
- Daily booking trend bars.
- Service demand split bars.
- Insights notes section.

### 10) Revenue (`/admin/revenue`)

- Financial KPI cards:
  - Gross revenue
  - Platform fee
  - Refunds
  - Net revenue
- Month-wise revenue chart bars.
- Financial snapshot card.

### 11) Settings (`/admin/settings`)

- Frontend toggles for:
  - 2FA requirement
  - Strict moderation mode
  - Auto-assign complaints
  - Session timeout
- Save settings button (currently UI-only).

## Mock Data Coverage

Defined in `src/lib/admin-mock-data.ts`:

- `dashboardStats`
- `adminUsersSeed`
- `pendingVerificationsSeed`
- `complaintsSeed`
- `serviceCategoriesSeed`
- `bookingTrendSeed`
- `revenueBreakdownSeed`
- `adminActivitySeed`
- `workerQualitySeed`
- `reviewModerationSeed`

## UI/UX Behavior

- Admin panel has dedicated sidebar/topbar via `AdminShell`.
- Sidebar collapses via overlay on mobile.
- Main website Navbar/Footer are hidden for all admin routes.
- Styling follows existing Tailwind design tokens and component style.

## Current Limitations (Expected)

- No backend auth/JWT integration yet.
- No API persistence yet (state resets on refresh for local page state actions).
- No server-side role guard yet.
- No real file uploads or export jobs.

## Backend Integration Plan (Next Step)

Map each page to backend endpoints when available:

- Dashboard -> `GET /admin/dashboard` or `GET /admin/statistics`
- Users -> `GET /admin/users`, `POST /admin/users/:id/block`
- Verification -> `GET /admin/workers/pending`, approve/reject endpoints
- Complaints -> `GET /admin/complaints`, resolve endpoint
- Reviews -> review moderation endpoints (to be defined)
- Services -> `POST /admin/services`, `PUT /admin/services/:id`
- Revenue -> `GET /admin/revenue`

## Quick Run

From `FYP-frontend 2`:

```bash
npm run dev
```

Then open:

- `http://localhost:3000/admin/login`

## Notes

This implementation is intentionally frontend-complete first, so you can demo the full admin journey now and connect APIs incrementally in phase 2.
