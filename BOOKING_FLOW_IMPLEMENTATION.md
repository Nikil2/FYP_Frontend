# 📱 Complete Customer Booking Flow Implementation Guide

**Date:** Feb 15, 2026  
**Status:** PLANNING → IMPLEMENTATION  
**Scope:** Frontend-only with localStorage persistence

---

## 🔴 CURRENT STATE (BROKEN)

### Current Booking Flow:
```
Landing Page (@/page.tsx)
   ↓
Customer Home (@/containers/customer/customer-home.tsx)
   ├─ Popular Services
   ├─ Service Categories
   └─ [Click on Service Category]
        ↓
Category Page (@/containers/customer/category-page.tsx)
   ├─ Shows services in that category
   └─ [Click on Service Card]
        ↓
Booking Page (@/containers/customer/booking-page.tsx)
   └─ BookingForm Component (@/components/customer/booking-form.tsx)
        ├─ serviceId + serviceName passed as props
        ├─ Form fields: location, date, time, description
        └─ [Submit Booking]
             ↓
             ❌ GENERATES RANDOM ID
             ❌ NO WORKER ASSIGNMENT
             ❌ NO NOTIFICATION
             ❌ NO DATA PERSISTENCE
             ✅ Redirects to success page (temporary only)
```

### File Breakdown - Current:

| File | Purpose | Status |
|------|---------|--------|
| `src/app/page.tsx` | Home → Landing | ✅ Works |
| `src/app/customer/page.tsx` | Customer Home | ✅ Works |
| `src/containers/customer/customer-home.tsx` | Home Layout | ✅ Works |
| `src/containers/customer/category-page.tsx` | Category View | ✅ Works |
| `src/containers/customer/service-list-page.tsx` | Services in Category | ✅ Works |
| `src/containers/customer/booking-page.tsx` | Booking Entry | ⚠️ Incomplete |
| `src/components/customer/booking-form.tsx` | Form Component | ⚠️ Incomplete |
| `src/components/customer/service-card.tsx` | Links to booking | ✅ Works |
| `src/lib/customer-data.ts` | Service Catalog | ✅ Works |
| `src/types/customer.ts` | Types | ✅ Works |
| `src/types/booking.ts` | Booking Types | ✅ Works |

---

## ❌ WHAT'S MISSING

### Missing 1: Service-to-Worker Mapping
```typescript
// Currently:
- Services exist in isolation
- No connection between Service ↔ Worker
- Workers have hardcoded orders in mock-provider.ts

// Needed:
SERVICE_ID: "s-ac-general"
   ↓
Workers Available: ["worker-1", "worker-2", "worker-5"]
   ↓
Customer See List of Workers
   ↓
Customer Selects One Worker
   ↓
Booking Links Customer ↔ Selected Worker
```

### Missing 2: Worker Selection UI
```typescript
// Currently: Service → Direct Booking Form
// Needed:  Service → Worker List → Worker Selection → Booking Form
```

### Missing 3: Booking Submission Logic
```typescript
// Currently:
const handleSubmit = () => {
  const bookingId = `CB-${Math.random()}`;
  router.push(`/customer/booking-success?id=${bookingId}`);
}

// Needed:
const handleSubmit = () => {
  // 1. Create proper booking object with workerId
  // 2. Save to context/state
  // 3. Update worker's activeOrders
  // 4. Create notification
  // 5. Persist to localStorage
  // 6. Redirect with booking data
}
```

### Missing 4: Data Persistence
```typescript
// Currently: No persistence - all data lost on refresh
// Needed: 
// - Custom Hook: useBookingManager
// - Context Provider: BookingContext
// - localStorage sync
```

### Missing 5: Worker Dashboard Connection
```typescript
// Currently:
Worker Dashboard (mock-provider.ts)
   └─ Hard-coded orders from dummy-workers.ts
   └─ Never updates with customer bookings

// Needed:
Worker Dashboard
   ├─ Reads from BookingManager context
   ├─ Shows NEW bookings from customers
   ├─ Accept/Reject buttons
   └─ Status updates
```

---

## ✅ SOLUTION ARCHITECTURE

### New Booking Flow:
```
Landing Page
   ↓
Customer Home
   ├─ Popular Services (unchanged)
   ├─ Service Categories (unchanged)
   └─ [Click Category]
        ↓
Category Page (unchanged)
   └─ [Click Service]
        ↓
WORKER SELECTION PAGE (NEW)
   ├─ Show workers for this service
   ├─ Filter by: Rating, Distance, Online Status
   ├─ Sort by: Rating, Distance
   └─ [Select Worker]
        ↓
Booking Form (MODIFIED)
   ├─ Pre-filled with workerId
   ├─ Fill: Date, Time, Location, Description
   └─ [Submit]
        ↓
SERVICE HANDLER (NEW - useBookingManager hook)
   ├─ Create Booking object
   ├─ Add to worker's activeOrders
   ├─ Create notification
   ├─ Save to localStorage
   └─ Update context state
        ↓
Success Page (MODIFIED)
   ├─ Show booking details
   ├─ Show assigned worker
   └─ Show next steps
        ↓
Worker Dashboard (MODIFIED)
   ├─ Show new bookings
   ├─ Accept/Reject
   └─ Update status
```

---

## 📋 IMPLEMENTATION STEPS

### PHASE 1: Data Structure Setup (1 hour)

#### Step 1.1: Create Service-to-Worker Mapping
**File:** `src/lib/services-with-workers.ts` (NEW)

```typescript
// Maps each service to available workers
type ServiceWithWorkers = {
  serviceId: string;
  serviceName: string;
  price: number;
  workerIds: string[];  // ← CRITICAL
}

// Example:
SERVICES_WITH_WORKERS: ServiceWithWorkers[] = [
  {
    serviceId: "s-ac-service",
    serviceName: "AC General Service",
    price: 1500,
    workerIds: ["worker-1", "worker-5"]  // Hasnain & Ahmed
  },
  {
    serviceId: "s-pipe-repair",
    serviceName: "Pipe Repair",
    price: 2500,
    workerIds: ["worker-3", "worker-4"]  // Hassan & Khan
  }
]
```

**Helper Functions:**
```typescript
export function getWorkersForService(serviceId: string): Worker[] {
  // Get worker IDs from mapping
  // Fetch worker objects from dummy-workers.ts
  // Return worker list with details
}

export function getWorkerById(workerId: string): Worker {
  // Return worker object
}
```

#### Step 1.2: Extend Booking Type
**File:** `src/types/booking.ts` (MODIFY)

```typescript
export interface Booking {
  id: string;
  customerId: string;        // ← ADD: Who booked
  workerId: string;          // ← ADD: Which worker
  worker: BookingWorker;     // ← Already exists
  serviceId: string;
  serviceName: string;
  status: BookingStatusType;
  scheduledDate: string;
  scheduledTime: string;
  location: BookingLocation;
  jobDescription: string;
  estimatedCost: number;
  finalCost?: number;
  createdAt: string;
  completedAt?: string;
  rating?: number;
  review?: string;
}
```

#### Step 1.3: Create Booking Manager Hook
**File:** `src/lib/useBookingManager.ts` (NEW)

```typescript
interface BookingManager {
  // Get all bookings
  getAllBookings(): Booking[];
  
  // Get bookings for a worker
  getWorkerBookings(workerId: string): Booking[];
  
  // Get bookings for a customer
  getCustomerBookings(customerId: string): Booking[];
  
  // Create new booking
  createBooking(data: BookingInput): Booking;
  
  // Update booking status
  updateBookingStatus(bookingId: string, status: BookingStatusType): void;
  
  // Accept booking (worker)
  acceptBooking(bookingId: string, workerId: string): void;
  
  // Reject booking (worker)
  rejectBooking(bookingId: string, workerId: string): void;
}
```

---

### PHASE 2: Frontend Components (3-4 hours)

#### Step 2.1: Create Worker Selection Page
**File:** `src/containers/customer/worker-selection-page.tsx` (NEW)

```typescript
// Shows list of available workers for a service
// Props: serviceId
// Features:
//   - Worker cards with rating, distance, price
//   - Filter/Sort options
//   - [Select Worker] button
//   - Redirects to booking form with workerId
```

#### Step 2.2: Create Worker Card Component
**File:** `src/components/customer/worker-card.tsx` (NEW)

```typescript
// Individual worker display
// Props: worker, service, onSelect
// Shows:
//   - Worker profile pic
//   - Name, rating, reviews count
//   - Distance
//   - Online status
//   - [Select] button
```

#### Step 2.3: Modify Booking Form
**File:** `src/components/customer/booking-form.tsx` (MODIFY)

```typescript
// Changes:
// Props: serviceId, serviceName, workerId (NEW)
// On submit:
//   - Create booking object
//   - Call useBookingManager.createBooking()
//   - Save to localStorage
//   - Redirect with booking data
```

#### Step 2.4: Modify Service Card
**File:** `src/components/customer/service-card.tsx` (MODIFY)

```typescript
// Change link from:
// href={`/customer/book/${service.id}`}
// To:
// href={`/customer/book/${service.id}/select-worker`}
```

#### Step 2.5: Update Booking Page Container
**File:** `src/containers/customer/booking-page.tsx` (MODIFY)

```typescript
// Current: Shows BookingForm directly
// New: Show based on route
//   - If ?step=select-worker → Show WorkerSelectionPage
//   - If ?step=booking → Show BookingForm with workerId
//   - Or use new routing structure:
//     /customer/book/[serviceId]/select-worker
//     /customer/book/[serviceId]/form
```

---

### PHASE 3: Data Management (2-3 hours)

#### Step 3.1: Create Booking Context
**File:** `src/lib/booking-context.tsx` (NEW)

```typescript
// Global state management for bookings
// Provides:
//   - useBooking() hook
//   - BookingProvider wrapper
//   - Sync with localStorage
//   - Methods to CRUD bookings
```

#### Step 3.2: Implement localStorage Sync
**File:** `src/lib/useBookingManager.ts` (COMPLETE)

```typescript
// Create custom hook that:
// - Reads bookings from localStorage on mount
// - Syncs to localStorage on change
// - Updates context state
// - Persists across page refreshes
```

#### Step 3.3: Modify Worker Dashboard
**File:** `src/app/worker/dashboard/page.tsx` (MODIFY)

```typescript
// Changes:
// Instead of:
// const activeOrders = useMemo(() => getActiveOrders(), []);
// 
// Use:
// const { getWorkerBookings } = useBookingManager();
// const activeOrders = getWorkerBookings(currentWorkerId);
```

---

### PHASE 4: Booking Success & Notifications (2 hours)

#### Step 4.1: Update Success Page
**File:** `src/app/customer/booking-success/page.tsx` (MODIFY)

```typescript
// Show:
// - Booking ID
// - Assigned worker details
// - Service details
// - Scheduled date/time
// - Next steps
```

#### Step 4.2: Create Notification Component
**File:** `src/components/worker-dashboard/new-booking-notification.tsx` (NEW)

```typescript
// Toast/Modal showing new booking request
// Actions:
//   - Accept Booking
//   - Reject Booking
//   - View Details
```

#### Step 4.3: Worker Accept/Reject Flow
**File:** `src/components/worker-dashboard/order-detail-modal.tsx` (MODIFY)

```typescript
// Add buttons:
//   - [Accept] → Updates status to "accepted"
//   - [Reject] → Updates status to "rejected"
//   - Triggers notification to customer
```

---

## 📊 Data Structure Details

### Service-to-Worker Mapping:
```typescript
// src/lib/services-with-workers.ts

interface ServiceWithWorkers {
  serviceId: string;
  serviceName: string;
  categoryId: string;
  price: number;
  workerIds: string[];
}

const MAPPING: ServiceWithWorkers[] = [
  // AC Services Category
  {
    serviceId: "s-ac-service",
    serviceName: "AC General Service",
    categoryId: "ac-services",
    price: 1500,
    workerIds: ["worker-1", "worker-5"]  // Hasnain, Ahmed
  },
  {
    serviceId: "s-ac-gas-refill",
    serviceName: "AC Gas Refill",
    categoryId: "ac-services",
    price: 2000,
    workerIds: ["worker-5"]  // Ahmed only
  },
  {
    serviceId: "s-ac-install",
    serviceName: "AC Installation",
    categoryId: "ac-services",
    price: 8000,
    workerIds: ["worker-1"]  // Hasnain only
  },
  
  // Electrician Services Category
  {
    serviceId: "s-wiring-install",
    serviceName: "Electrical Wiring Installation",
    categoryId: "electrician-services",
    price: 3000,
    workerIds: ["worker-3", "worker-4"]  // Hassan, Khan
  },
  {
    serviceId: "s-fan-install",
    serviceName: "Fan Installation",
    categoryId: "electrician-services",
    price: 1200,
    workerIds: ["worker-3", "worker-4"]
  },
  
  // Plumber Services Category
  {
    serviceId: "s-pipe-repair",
    serviceName: "Pipe Repair & Fixing",
    categoryId: "plumber-services",
    price: 2500,
    workerIds: ["worker-3", "worker-4"]  // Hassan, Khan
  },
  {
    serviceId: "s-water-tank",
    serviceName: "Water Tank Cleaning",
    categoryId: "plumber-services",
    price: 3000,
    workerIds: ["worker-3"]  // Hassan only
  }
];
```

### Booking Creation Flow:
```typescript
// When customer submits booking with selected worker

const newBooking: Booking = {
  id: "BK-" + Date.now(),           // Generate unique ID
  customerId: "customer-1",           // From context/session
  workerId: "worker-1",               // From selection
  worker: {                           // Get from worker object
    id: "worker-1",
    name: "Hasnain Saeed",
    category: "AC Technician",
    rating: 5.0,
    profileImage: null,
    isOnline: true
  },
  serviceId: "s-ac-service",
  serviceName: "AC General Service",
  status: "pending",                  // Initial status
  scheduledDate: "2026-02-18",
  scheduledTime: "10:00 AM",
  location: {
    address: "Gulshan-e-Iqbal, Karachi",
    lat: 24.8,
    lng: 67.0
  },
  jobDescription: "AC stopped cooling",
  estimatedCost: 1500,
  createdAt: new Date().toISOString()
};

// Save to:
// 1. Context state
// 2. localStorage under key: "bookings"
// 3. Add to worker's activeOrders (read from context)
```

---

## 📁 File Structure After Implementation

```
src/
├─ lib/
│  ├─ customer-data.ts          (EXISTING - unchanged)
│  ├─ services-with-workers.ts  (NEW - Service↔Worker mapping)
│  ├─ useBookingManager.ts      (NEW - Hook for booking CRUD)
│  ├─ booking-context.tsx       (NEW - Global context)
│  └─ mock-bookings.ts          (EXISTING - keep for testing)
│
├─ types/
│  ├─ customer.ts               (EXISTING - unchanged)
│  ├─ booking.ts                (MODIFY - add customerId)
│  └─ worker.ts                 (EXISTING - unchanged)
│
├─ components/
│  ├─ customer/
│  │  ├─ booking-form.tsx           (MODIFY - add workerId handling)
│  │  ├─ service-card.tsx           (MODIFY - link to worker selection)
│  │  ├─ worker-card.tsx            (NEW - show worker details)
│  │  └─ worker-list.tsx            (NEW - list of workers)
│  │
│  └─ worker-dashboard/
│     ├─ order-detail-modal.tsx     (MODIFY - add accept/reject)
│     └─ new-booking-notification.tsx (NEW - notify worker)
│
├─ containers/
│  └─ customer/
│     ├─ customer-home.tsx          (EXISTING - unchanged)
│     ├─ category-page.tsx          (EXISTING - unchanged)
│     ├─ booking-page.tsx           (MODIFY - two-step flow)
│     ├─ worker-selection-page.tsx  (NEW - select worker)
│     └─ service-list-page.tsx      (EXISTING - unchanged)
│
└─ app/
   ├─ customer/
   │  ├─ book/[serviceId]/page.tsx       (MODIFY - 2022)
   │  ├─ book/[serviceId]/workers/page.tsx (NEW)
   │  └─ booking-success/page.tsx         (MODIFY - show worker)
   │
   └─ worker/
      └─ dashboard/page.tsx          (MODIFY - read from context)
```

---

## 🔄 Complete User Journey

### CUSTOMER JOURNEY:
```
1. Open App
   └─ Landing Page → Click "Get Service"

2. Browse Services
   └─ Customer Home
      └─ Click Service Category
         └─ Category Page (shows subcategories)
            └─ Click Subcategory
               └─ Service List Page (shows services)
                  └─ Click Service Card
                     └─ [REDIRECT: /customer/book/[serviceId]/workers]

3. Select Worker [NEW]
   └─ Worker Selection Page
      ├─ Shows: All workers for this service
      ├─ Filter by: Rating, Distance, Online Status
      └─ Click [Select Worker]
         └─ [REDIRECT: /customer/book/[serviceId]/form?workerId=worker-1]

4. Book Service
   └─ Booking Form
      ├─ Pre-filled: Service, Worker, Price
      ├─ Form: Date, Time, Location, Description
      └─ Click [Submit Booking]
         └─ [HANDLER: useBookingManager.createBooking()]
            ├─ Save to context
            ├─ Save to localStorage
            ├─ Notify worker
            └─ [REDIRECT: /customer/booking-success?id=BK-123]

5. Confirmation
   └─ Booking Success Page
      ├─ Show: Booking ID, Worker Details
      ├─ Show: Service, Date/Time, Cost
      └─ Actions: Chat, Track, View Orders

6. Worker Accepts (on worker side)
   └─ Worker sees new booking
      ├─ Notification badge
      ├─ Dashboard update
      └─ Actions: Accept/Reject
         └─ Status changes → Customer notified
```

### WORKER JOURNEY:
```
1. Open Dashboard
   └─ Worker Dashboard
      ├─ Shows: Active Orders (from context/localStorage)
      └─ NEW BOOKING NOTIFICATION BADGE

2. Receive Notification [NEW]
   └─ Toast: "New booking request for AC Service"
      ├─ Customer: Ali Ahmed
      ├─ Service: AC General Service
      └─ Actions: [Accept] [Reject] [View Details]

3. Accept Booking
   └─ Click [Accept]
      ├─ Update booking.status = "accepted"
      ├─ Save to localStorage
      ├─ Update context
      └─ Customer gets notification

4. View Bookings
   └─ Active Orders list (updated from context)
      ├─ Shows: Customer, Service, Date/Time
      ├─ Shows: Location with map
      └─ Actions: Navigate, Chat, Complete

5. Complete Booking
   └─ Click [Complete]
      ├─ Update status = "completed"
      ├─ Move to Past Orders
      └─ Customer can rate
```

---

## 🗂️ localStorage Schema

### Key Structure:
```javascript
// localStorage keys:

"bookings" → [
  {
    id: "BK-1708090000000",
    customerId: "customer-1",
    workerId: "worker-1",
    serviceId: "s-ac-service",
    status: "pending",
    // ... all booking fields
  },
  {
    id: "BK-1708091000000",
    customerId: "customer-1",
    workerId: "worker-5",
    serviceId: "s-ac-gas-refill",
    status: "accepted",
    // ... all booking fields
  }
]

"worker-1-bookings" → [BK-1708090000000]  // Quick lookup
"customer-1-bookings" → [BK-1708090000000, BK-1708091000000]

"notifications" → [
  {
    id: "notif-1",
    type: "new-booking",
    workerId: "worker-1",
    bookingId: "BK-1708090000000",
    read: false
  }
]
```

---

## ⚠️ Potential Issues & Solutions

### Issue 1: Data Loss on Refresh
**Problem:** Data in context lost when page refreshes  
**Solution:** Sync context with localStorage on mount and every change

### Issue 2: Multiple Tabs/Devices
**Problem:** Changes in one tab don't reflect in another  
**Solution:** Currently not fixable in frontend-only. Will need backend later.

### Issue 3: Service-Worker Mapping
**Problem:** Manual mapping can get out of sync  
**Solution:** Use a helper function that validates all mappings

### Issue 4: Worker Dashboard Shows Wrong Orders
**Problem:** Currently reads hardcoded orders  
**Solution:** Switch to reading from useBookingManager hook

### Issue 5: No Real Notifications
**Problem:** Can't send actual notifications to workers  
**Solution:** Use toast/modal for now. Will need backend socket.io later.

---

## 📅 Implementation Timeline

| Phase | Task | Duration | Difficulty |
|-------|------|----------|------------|
| 1 | Create services-with-workers.ts | 30 min | Easy |
| 1 | Extend Booking types | 15 min | Easy |
| 1 | Create useBookingManager hook | 1 hour | Medium |
| 2 | Create Worker Selection Page | 1 hour | Medium |
| 2 | Create Worker Card Component | 45 min | Easy |
| 2 | Modify Booking Form | 45 min | Medium |
| 3 | Create Booking Context | 1 hour | Medium |
| 3 | Implement localStorage sync | 1 hour | Medium |
| 3 | Update Worker Dashboard | 45 min | Easy |
| 4 | Update Success Page | 30 min | Easy |
| 4 | Add Accept/Reject Flow | 1 hour | Medium |
| **TOTAL** | | **~9 hours** | **Medium** |

---

## ✅ Verification Checklist

- [ ] Service-to-Worker mapping file created
- [ ] Worker Selection page shows workers for service
- [ ] Customer can select a worker
- [ ] Booking form receives workerId
- [ ] Booking submission creates proper object
- [ ] Booking saved to localStorage
- [ ] Booking saved to context
- [ ] Worker dashboard shows new bookings
- [ ] Worker can accept booking
- [ ] Worker can reject booking
- [ ] Status updates reflect in both sides
- [ ] Page refresh persists data
- [ ] Success page shows worker details
- [ ] No console errors
- [ ] Mobile responsive

---

## 🎯 Success Criteria

1. **Customer Flow Works:**
   - Service → Select Worker → Fill Form → Submit → Shows assigned worker ✅

2. **Worker Receives Booking:**
   - New booking appears in dashboard ✅
   - Worker can accept/reject ✅
   - Status updates in real-time (same session) ✅

3. **Data Persists:**
   - Refresh page → Data still there ✅
   - Check localStorage → Booking exists ✅

4. **No Hardcoded Orders:**
   - Worker dashboard reads from context, not mock data ✅

5. **Mobile Responsive:**
   - Works on mobile screens ✅

---

## 🚀 Next Steps After Implementation

1. **Add Real-time Updates:**
   - Replace localStorage with Supabase/Firebase
   - Add real-time listeners
   - Multiple users sync instantly

2. **Add Notifications:**
   - FCM push notifications
   - Email notifications
   - SMS alerts

3. **Add Payment:**
   - Payment gateway integration
   - Invoice generation
   - Refund handling

4. **Add Tracking:**
   - Real-time location tracking
   - ETA calculations
   - Route optimization

5. **Add Reviews & Ratings:**
   - Customer review system
   - Worker response system
   - Rating algorithm

---

**Ready to start implementation? Let me know which part to code first! 🚀**
