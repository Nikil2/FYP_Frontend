// ============================================
// DUMMY CUSTOMER ACCOUNTS
// Use these credentials to login and see the customer dashboard
// ============================================

// ── Dummy Credentials ──────────────────────
// Customer 1: 03331234567  /  123456  → Active customer with bookings
// Customer 2: 03451112233  /  123456  → New customer, no bookings

export interface CustomerBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  workerName: string;
  workerPhone: string;
  workerImage: string | null;
  workerRating: number;
  workerCategory: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  price: number;
  description: string;
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  rating?: number;
  review?: string;
  images?: string[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  profileImage: string | null;
  city: string;
  address: string;
  joinedDate: string;
  totalBookings: number;
  rewardPoints: number;
}

export interface DummyCustomerAccount {
  id: string;
  phoneNumber: string;
  password: string;
  role: "CUSTOMER";
  profile: CustomerProfile;
  activeBookings: CustomerBooking[];
  pastBookings: CustomerBooking[];
  notifications: CustomerNotification[];
}

export interface CustomerNotification {
  id: string;
  type: "booking" | "system" | "promo" | "review";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

// ════════════════════════════════════════════
// CUSTOMER 1 — Sara Ahmed (Active, Multiple Bookings)
// Phone: 03331234567   Password: 123456
// ════════════════════════════════════════════
const customer1: DummyCustomerAccount = {
  id: "customer-1",
  phoneNumber: "03331234567",
  password: "123456",
  role: "CUSTOMER",
  profile: {
    id: "customer-1",
    name: "Sara Ahmed",
    phone: "+92 333 1234567",
    email: "sara.ahmed@example.com",
    profileImage: null,
    city: "Karachi",
    address: "Gulshan-e-Iqbal, Block 13-D, Karachi",
    joinedDate: "2025-06-15",
    totalBookings: 12,
    rewardPoints: 240,
  },
  activeBookings: [
    {
      id: "CB-1001",
      serviceId: "s-elec-wiring",
      serviceName: "Home Wiring Repair",
      categoryName: "Electrician",
      status: "confirmed",
      workerName: "Ahmed Hassan",
      workerPhone: "+92 311 7243792",
      workerImage: null,
      workerRating: 4.9,
      workerCategory: "Electrician",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-02-15",
      scheduledTime: "10:00 AM",
      price: 3500,
      description: "Complete bedroom wiring needs replacement. Old wiring is causing short circuits.",
      createdAt: "2026-02-13T08:00:00Z",
    },
    {
      id: "CB-1002",
      serviceId: "s-plumb-leak",
      serviceName: "Pipe Leak Repair",
      categoryName: "Plumber",
      status: "in-progress",
      workerName: "Zubair Khan",
      workerPhone: "+92 300 9998877",
      workerImage: null,
      workerRating: 4.7,
      workerCategory: "Plumber",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-02-14",
      scheduledTime: "02:00 PM",
      price: 2500,
      description: "Kitchen pipe leaking near the sink. Water is dripping continuously.",
      createdAt: "2026-02-12T15:00:00Z",
    },
    {
      id: "CB-1003",
      serviceId: "s-ac-service",
      serviceName: "AC General Service",
      categoryName: "AC Technician",
      status: "pending",
      workerName: "Usman Khan",
      workerPhone: "+92 321 9876543",
      workerImage: null,
      workerRating: 4.7,
      workerCategory: "AC Technician",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-02-16",
      scheduledTime: "11:00 AM",
      price: 3000,
      description: "Annual AC servicing for 2 split units. Need gas check and filter cleaning.",
      createdAt: "2026-02-14T10:00:00Z",
    },
  ],
  pastBookings: [
    {
      id: "CB-0901",
      serviceId: "s-paint-room",
      serviceName: "Room Painting",
      categoryName: "Painter",
      status: "completed",
      workerName: "Farhan Malik",
      workerPhone: "+92 345 6543210",
      workerImage: null,
      workerRating: 4.8,
      workerCategory: "Painter",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-02-10",
      scheduledTime: "09:00 AM",
      price: 12000,
      description: "Repaint master bedroom and living room. Walls need 2 coats",
      createdAt: "2026-02-08T09:00:00Z",
      completedAt: "2026-02-10T17:00:00Z",
      rating: 5,
      review: "Excellent work! Very professional and clean. Highly recommend.",
    },
    {
      id: "CB-0902",
      serviceId: "s-elec-fan",
      serviceName: "Fan Installation",
      categoryName: "Electrician",
      status: "completed",
      workerName: "Ahmed Hassan",
      workerPhone: "+92 311 7243792",
      workerImage: null,
      workerRating: 4.9,
      workerCategory: "Electrician",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-02-06",
      scheduledTime: "03:00 PM",
      price: 2000,
      description: "Install new ceiling fan in guest room",
      createdAt: "2026-02-05T10:00:00Z",
      completedAt: "2026-02-06T16:00:00Z",
      rating: 5,
      review: "Quick and efficient! Fan works perfectly.",
    },
    {
      id: "CB-0903",
      serviceId: "s-carp-door",
      serviceName: "Door Repair",
      categoryName: "Carpenter",
      status: "completed",
      workerName: "Asif Raza",
      workerPhone: "+92 312 3334455",
      workerImage: null,
      workerRating: 4.5,
      workerCategory: "Carpenter",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-02-02",
      scheduledTime: "10:00 AM",
      price: 4500,
      description: "Bathroom door hinges broken and lock not working",
      createdAt: "2026-02-01T11:00:00Z",
      completedAt: "2026-02-02T13:00:00Z",
      rating: 4,
      review: "Good work. Door works well now. Took a bit longer than expected.",
    },
    {
      id: "CB-0904",
      serviceId: "s-clean-deep",
      serviceName: "Deep House Cleaning",
      categoryName: "Cleaning",
      status: "cancelled",
      workerName: "Nazia Bibi",
      workerPhone: "+92 300 2221100",
      workerImage: null,
      workerRating: 4.6,
      workerCategory: "Cleaning",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-01-28",
      scheduledTime: "08:00 AM",
      price: 8000,
      description: "Full house deep clean - 4 bedrooms, kitchen and bathrooms",
      createdAt: "2026-01-26T08:00:00Z",
      cancelledAt: "2026-01-27T20:00:00Z",
      cancelReason: "Schedule conflict - need to reschedule",
    },
    {
      id: "CB-0905",
      serviceId: "s-elec-wiring",
      serviceName: "Switch & Socket Repair",
      categoryName: "Electrician",
      status: "completed",
      workerName: "Ahmed Hassan",
      workerPhone: "+92 311 7243792",
      workerImage: null,
      workerRating: 4.9,
      workerCategory: "Electrician",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-01-22",
      scheduledTime: "02:00 PM",
      price: 1500,
      description: "Multiple switches not working in hall and guest room",
      createdAt: "2026-01-21T14:00:00Z",
      completedAt: "2026-01-22T15:30:00Z",
      rating: 5,
      review: "As always, Ahmed does great work!",
    },
    {
      id: "CB-0906",
      serviceId: "s-ac-gas",
      serviceName: "AC Gas Refilling",
      categoryName: "AC Technician",
      status: "completed",
      workerName: "Usman Khan",
      workerPhone: "+92 321 9876543",
      workerImage: null,
      workerRating: 4.7,
      workerCategory: "AC Technician",
      location: "Gulshan-e-Iqbal, Block 13-D, Karachi",
      scheduledDate: "2026-01-18",
      scheduledTime: "11:00 AM",
      price: 4500,
      description: "AC not cooling enough - might need gas refilling",
      createdAt: "2026-01-17T11:00:00Z",
      completedAt: "2026-01-18T13:00:00Z",
      rating: 4,
      review: "AC cooling well again. Service was good.",
    },
  ],
  notifications: [
    {
      id: "n1",
      type: "booking",
      title: "Booking Confirmed",
      message: "Your Home Wiring Repair booking (CB-1001) has been confirmed by Ahmed Hassan. Scheduled for Feb 15, 10:00 AM.",
      read: false,
      createdAt: "2026-02-13T09:00:00Z",
      bookingId: "CB-1001",
    },
    {
      id: "n2",
      type: "booking",
      title: "Worker En Route",
      message: "Zubair Khan is on the way for your Pipe Leak Repair (CB-1002). He will arrive shortly.",
      read: false,
      createdAt: "2026-02-14T13:45:00Z",
      bookingId: "CB-1002",
    },
    {
      id: "n3",
      type: "promo",
      title: "Weekend Offer! 🎉",
      message: "Get 20% off on all AC services this weekend. Book now and save!",
      read: true,
      createdAt: "2026-02-12T10:00:00Z",
    },
    {
      id: "n4",
      type: "review",
      title: "Rate Your Experience",
      message: "How was your Room Painting experience with Farhan Malik? Leave a review!",
      read: true,
      createdAt: "2026-02-10T18:00:00Z",
      bookingId: "CB-0901",
    },
    {
      id: "n5",
      type: "system",
      title: "Welcome to Mehnati!",
      message: "Thank you for joining Mehnati. Browse services and book your first worker today!",
      read: true,
      createdAt: "2025-06-15T12:00:00Z",
    },
    {
      id: "n6",
      type: "booking",
      title: "Booking Completed",
      message: "Your Fan Installation (CB-0902) has been completed. Don't forget to rate your experience!",
      read: true,
      createdAt: "2026-02-06T16:00:00Z",
      bookingId: "CB-0902",
    },
  ],
};

// ════════════════════════════════════════════
// CUSTOMER 2 — Ali Raza (New Customer, No Bookings)
// Phone: 03451112233   Password: 123456
// ════════════════════════════════════════════
const customer2: DummyCustomerAccount = {
  id: "customer-2",
  phoneNumber: "03451112233",
  password: "123456",
  role: "CUSTOMER",
  profile: {
    id: "customer-2",
    name: "Ali Raza",
    phone: "+92 345 1112233",
    email: "ali.raza@example.com",
    profileImage: null,
    city: "Lahore",
    address: "DHA Phase 5, Lahore",
    joinedDate: "2026-02-10",
    totalBookings: 0,
    rewardPoints: 0,
  },
  activeBookings: [],
  pastBookings: [],
  notifications: [
    {
      id: "n1",
      type: "system",
      title: "Welcome to Mehnati!",
      message: "Thank you for joining Mehnati. Browse services and book your first worker today!",
      read: false,
      createdAt: "2026-02-10T12:00:00Z",
    },
    {
      id: "n2",
      type: "promo",
      title: "First Booking Offer! 🎉",
      message: "Get 30% off on your first booking! Use code WELCOME30 at checkout.",
      read: false,
      createdAt: "2026-02-10T12:05:00Z",
    },
  ],
};

// ── All Dummy Customers ──────────────────────

export const DUMMY_CUSTOMERS: DummyCustomerAccount[] = [customer1, customer2];

// ── Auth Helpers ──────────────────────

export function findCustomerByCredentials(
  phone: string,
  password: string
): DummyCustomerAccount | null {
  const cleanPhone = phone.replace(/\s|-|\+92/g, "").replace(/^0/, "0");
  return (
    DUMMY_CUSTOMERS.find(
      (c) =>
        c.phoneNumber.replace(/\s|-/g, "") === cleanPhone &&
        c.password === password
    ) || null
  );
}

export function findCustomerById(id: string): DummyCustomerAccount | null {
  return DUMMY_CUSTOMERS.find((c) => c.id === id) || null;
}

// ── LocalStorage helpers for current logged-in customer ──

export function setCurrentCustomerId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentCustomerId", id);
  }
}

export function getCurrentCustomerId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentCustomerId");
  }
  return null;
}

export function clearCurrentCustomerId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentCustomerId");
  }
}

// ── Get current logged-in customer data ──

export function getCurrentCustomer(): DummyCustomerAccount | null {
  const id = getCurrentCustomerId();
  if (!id) return null;
  return findCustomerById(id);
}
