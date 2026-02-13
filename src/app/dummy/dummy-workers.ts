// ============================================
// DUMMY WORKER ACCOUNTS
// Use these credentials to login and see different dashboard states
// ============================================

import type {
  ProviderProfile,
  ProviderStats,
  ProviderOrder,
  ProviderEarnings,
  ProviderTransaction,
  ProviderVerification,
} from "@/types/provider";

// ── Dummy Credentials ──────────────────────
// Worker 1: 03117243792  /  123456  → Approved, Online, Full data
// Worker 2: 03001234567  /  123456  → Pending verification
// Worker 3: 03219876543  /  123456  → Approved, Offline, lots of orders

export interface DummyWorkerAccount {
  id: string;
  phoneNumber: string;
  password: string;
  role: "WORKER";
  profile: ProviderProfile;
  stats: ProviderStats;
  verification: ProviderVerification;
  activeOrders: ProviderOrder[];
  pastOrders: ProviderOrder[];
  earnings: ProviderEarnings;
  transactions: ProviderTransaction[];
}

// ════════════════════════════════════════════
// WORKER 1 — Ahmed Hassan (Approved, Online)
// Phone: 03117243792   Password: 123456
// ════════════════════════════════════════════
const worker1: DummyWorkerAccount = {
  id: "worker-1",
  phoneNumber: "03117243792",
  password: "123456",
  role: "WORKER",
  profile: {
    id: "worker-1",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+92 311 7243792",
    profileImage: null,
    rating: 4.9,
    completedServices: 28,
    profileStatus: "approved",
    isOnline: true,
    cnic: "42101-1234567-1",
    city: "Karachi, Pakistan",
    category: "Electrician",
    experienceYears: 8,
    bio: "Professional electrician with 8 years of experience. Specializing in wiring, AC installation, and electrical repairs across Karachi.",
    joinedDate: "2024-06-10",
  },
  stats: {
    activeOrders: 3,
    completedOrders: 28,
    cancelledOrders: 2,
    totalEarnings: 185000,
    rating: 4.9,
    profileViews: 856,
    responseRate: 96,
  },
  verification: {
    phoneNumber: "verified",
    identityVerification: "verified",
    professionalInfo: "verified",
  },
  activeOrders: [
    {
      id: "30001",
      serviceId: "s-elec-wiring",
      serviceName: "Home Wiring Repair",
      serviceImage: null,
      status: "accepted",
      customerName: "Sara Ahmed",
      customerPhone: "+92 300 1112233",
      customerImage: null,
      location: "Gulshan-e-Iqbal, Karachi",
      scheduledDate: "2026-02-14",
      scheduledTime: "10:00 AM",
      agreedPrice: 3500,
      notes: "Complete bedroom wiring needs replacement",
      createdAt: "2026-02-13T08:00:00Z",
    },
    {
      id: "30002",
      serviceId: "s-elec-fan",
      serviceName: "Fan Installation",
      serviceImage: null,
      status: "in-progress",
      customerName: "Usman Khan",
      customerPhone: "+92 321 5554433",
      customerImage: null,
      location: "DHA Phase 5, Karachi",
      scheduledDate: "2026-02-13",
      scheduledTime: "02:00 PM",
      agreedPrice: 2000,
      notes: "Install 3 ceiling fans in new apartment",
      createdAt: "2026-02-12T15:00:00Z",
    },
    {
      id: "30003",
      serviceId: "s-elec-breaker",
      serviceName: "Circuit Breaker Repair",
      serviceImage: null,
      status: "pending",
      customerName: "Fatima Ali",
      customerPhone: "+92 333 9876543",
      customerImage: null,
      location: "Clifton Block 5, Karachi",
      scheduledDate: "2026-02-15",
      scheduledTime: "11:00 AM",
      agreedPrice: 5000,
      notes: "Main DB board tripping frequently",
      createdAt: "2026-02-13T10:00:00Z",
    },
  ],
  pastOrders: [
    {
      id: "29001",
      serviceId: "s-elec-wiring",
      serviceName: "Full House Wiring",
      serviceImage: null,
      status: "completed",
      customerName: "Bilal Raza",
      customerPhone: "+92 300 5556677",
      customerImage: null,
      location: "North Nazimabad, Karachi",
      scheduledDate: "2026-02-10",
      scheduledTime: "09:00 AM",
      agreedPrice: 15000,
      createdAt: "2026-02-10T09:00:00Z",
      completedAt: "2026-02-10T16:00:00Z",
      invoiceUrl: "#",
    },
    {
      id: "29002",
      serviceId: "s-elec-ups",
      serviceName: "UPS Installation",
      serviceImage: null,
      status: "completed",
      customerName: "Kamran Shah",
      customerPhone: "+92 345 1234567",
      customerImage: null,
      location: "Gulistan-e-Johar, Karachi",
      scheduledDate: "2026-02-08",
      scheduledTime: "03:00 PM",
      agreedPrice: 8000,
      createdAt: "2026-02-08T15:00:00Z",
      completedAt: "2026-02-08T17:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "29003",
      serviceId: "s-elec-light",
      serviceName: "Light Fitting",
      serviceImage: null,
      status: "cancelled",
      customerName: "Zainab Malik",
      customerPhone: "+92 312 8889900",
      customerImage: null,
      location: "Bahadurabad, Karachi",
      scheduledDate: "2026-02-06",
      scheduledTime: "04:00 PM",
      agreedPrice: 1500,
      createdAt: "2026-02-06T16:00:00Z",
    },
    {
      id: "29004",
      serviceId: "s-elec-switch",
      serviceName: "Switch & Socket Repair",
      serviceImage: null,
      status: "completed",
      customerName: "Hassan Javed",
      customerPhone: "+92 300 3332211",
      customerImage: null,
      location: "PECHS, Karachi",
      scheduledDate: "2026-02-04",
      scheduledTime: "11:00 AM",
      agreedPrice: 2500,
      createdAt: "2026-02-04T11:00:00Z",
      completedAt: "2026-02-04T12:30:00Z",
      invoiceUrl: "#",
    },
  ],
  earnings: {
    totalEarnings: 185000,
    thisMonthEarnings: 28500,
    availableBalance: 18500,
    pendingBalance: 10500,
    lastWithdrawal: {
      amount: 25000,
      date: "2026-02-01",
      method: "JazzCash",
    },
  },
  transactions: [
    { id: "t1", type: "credit", amount: 3500, description: "Home Wiring - Sara Ahmed", date: "2026-02-14", orderId: "30001", status: "pending" },
    { id: "t2", type: "credit", amount: 15000, description: "Full House Wiring - Bilal Raza", date: "2026-02-10", orderId: "29001", status: "completed" },
    { id: "t3", type: "credit", amount: 8000, description: "UPS Installation - Kamran Shah", date: "2026-02-08", orderId: "29002", status: "completed" },
    { id: "t4", type: "withdrawal", amount: 25000, description: "Withdrawal to JazzCash", date: "2026-02-01", status: "completed" },
    { id: "t5", type: "credit", amount: 2500, description: "Switch Repair - Hassan Javed", date: "2026-02-04", orderId: "29004", status: "completed" },
  ],
};

// ════════════════════════════════════════════
// WORKER 2 — Imran Ali (Pending Verification)
// Phone: 03001234567   Password: 123456
// ════════════════════════════════════════════
const worker2: DummyWorkerAccount = {
  id: "worker-2",
  phoneNumber: "03001234567",
  password: "123456",
  role: "WORKER",
  profile: {
    id: "worker-2",
    name: "Imran Ali",
    email: "imran.ali@example.com",
    phone: "+92 300 1234567",
    profileImage: null,
    rating: 0,
    completedServices: 0,
    profileStatus: "pending",
    isOnline: false,
    cnic: "36302-7654321-1",
    city: "Lahore, Pakistan",
    category: "Plumber",
    experienceYears: 3,
    bio: "Plumber with 3 years of experience in pipe fitting, leak repair, and bathroom installation work in Lahore.",
    joinedDate: "2026-02-13",
  },
  stats: {
    activeOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalEarnings: 0,
    rating: 0,
    profileViews: 0,
    responseRate: 0,
  },
  verification: {
    phoneNumber: "verified",
    identityVerification: "pending",
    professionalInfo: "not-verified",
  },
  activeOrders: [],
  pastOrders: [],
  earnings: {
    totalEarnings: 0,
    thisMonthEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
  },
  transactions: [],
};

// ════════════════════════════════════════════
// WORKER 3 — Usman Khan (Approved, Offline, Experienced)
// Phone: 03219876543   Password: 123456
// ════════════════════════════════════════════
const worker3: DummyWorkerAccount = {
  id: "worker-3",
  phoneNumber: "03219876543",
  password: "123456",
  role: "WORKER",
  profile: {
    id: "worker-3",
    name: "Usman Khan",
    email: "usman.khan@example.com",
    phone: "+92 321 9876543",
    profileImage: null,
    rating: 4.7,
    completedServices: 45,
    profileStatus: "approved",
    isOnline: false,
    cnic: "17301-9988776-5",
    city: "Islamabad, Pakistan",
    category: "AC Technician",
    experienceYears: 10,
    bio: "Senior AC technician with 10+ years of experience. Expert in split, window, and central AC systems. Serving Islamabad and Rawalpindi.",
    joinedDate: "2023-01-20",
  },
  stats: {
    activeOrders: 1,
    completedOrders: 45,
    cancelledOrders: 5,
    totalEarnings: 425000,
    rating: 4.7,
    profileViews: 1240,
    responseRate: 88,
  },
  verification: {
    phoneNumber: "verified",
    identityVerification: "verified",
    professionalInfo: "verified",
  },
  activeOrders: [
    {
      id: "40001",
      serviceId: "s-ac-repair",
      serviceName: "AC Repair",
      serviceImage: null,
      status: "accepted",
      customerName: "Tariq Mehmood",
      customerPhone: "+92 345 8765432",
      customerImage: null,
      location: "F-10 Markaz, Islamabad",
      scheduledDate: "2026-02-14",
      scheduledTime: "03:00 PM",
      agreedPrice: 6000,
      notes: "Compressor not working, gas might need refilling",
      createdAt: "2026-02-13T12:00:00Z",
    },
  ],
  pastOrders: [
    {
      id: "39001",
      serviceId: "s-ac-install",
      serviceName: "AC Installation",
      serviceImage: null,
      status: "completed",
      customerName: "Dr. Aisha Siddiqui",
      customerPhone: "+92 300 7776655",
      customerImage: null,
      location: "G-11/3, Islamabad",
      scheduledDate: "2026-02-11",
      scheduledTime: "10:00 AM",
      agreedPrice: 12000,
      createdAt: "2026-02-11T10:00:00Z",
      completedAt: "2026-02-11T14:00:00Z",
      invoiceUrl: "#",
    },
    {
      id: "39002",
      serviceId: "s-ac-service",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "completed",
      customerName: "Naveed Akhtar",
      customerPhone: "+92 333 1112244",
      customerImage: null,
      location: "I-8/2, Islamabad",
      scheduledDate: "2026-02-09",
      scheduledTime: "11:00 AM",
      agreedPrice: 3000,
      createdAt: "2026-02-09T11:00:00Z",
      completedAt: "2026-02-09T12:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "39003",
      serviceId: "s-ac-gas",
      serviceName: "Gas Refilling",
      serviceImage: null,
      status: "completed",
      customerName: "Rashid Mahmood",
      customerPhone: "+92 345 2223344",
      customerImage: null,
      location: "Bahria Town Phase 4, Rawalpindi",
      scheduledDate: "2026-02-07",
      scheduledTime: "02:00 PM",
      agreedPrice: 4500,
      createdAt: "2026-02-07T14:00:00Z",
      completedAt: "2026-02-07T15:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "39004",
      serviceId: "s-ac-clean",
      serviceName: "AC Deep Cleaning",
      serviceImage: null,
      status: "cancelled",
      customerName: "Waqas Butt",
      customerPhone: "+92 312 4445566",
      customerImage: null,
      location: "E-11/4, Islamabad",
      scheduledDate: "2026-02-05",
      scheduledTime: "09:00 AM",
      agreedPrice: 2500,
      createdAt: "2026-02-05T09:00:00Z",
    },
    {
      id: "39005",
      serviceId: "s-ac-install",
      serviceName: "AC Installation (3 units)",
      serviceImage: null,
      status: "completed",
      customerName: "Col. Asif Pervaiz",
      customerPhone: "+92 300 9990011",
      customerImage: null,
      location: "DHA Phase 2, Islamabad",
      scheduledDate: "2026-02-02",
      scheduledTime: "09:00 AM",
      agreedPrice: 35000,
      createdAt: "2026-02-02T09:00:00Z",
      completedAt: "2026-02-02T17:00:00Z",
      invoiceUrl: "#",
    },
    {
      id: "39006",
      serviceId: "s-ac-service",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "completed",
      customerName: "Saima Noor",
      customerPhone: "+92 321 6667788",
      customerImage: null,
      location: "F-6/2, Islamabad",
      scheduledDate: "2026-01-28",
      scheduledTime: "11:00 AM",
      agreedPrice: 5000,
      createdAt: "2026-01-28T11:00:00Z",
      completedAt: "2026-01-28T13:00:00Z",
      invoiceUrl: "#",
    },
  ],
  earnings: {
    totalEarnings: 425000,
    thisMonthEarnings: 60500,
    availableBalance: 48000,
    pendingBalance: 6000,
    lastWithdrawal: {
      amount: 50000,
      date: "2026-01-30",
      method: "EasyPaisa",
    },
  },
  transactions: [
    { id: "t1", type: "credit", amount: 6000, description: "AC Repair - Tariq Mehmood", date: "2026-02-14", orderId: "40001", status: "pending" },
    { id: "t2", type: "credit", amount: 12000, description: "AC Installation - Dr. Aisha Siddiqui", date: "2026-02-11", orderId: "39001", status: "completed" },
    { id: "t3", type: "credit", amount: 3000, description: "AC Service - Naveed Akhtar", date: "2026-02-09", orderId: "39002", status: "completed" },
    { id: "t4", type: "credit", amount: 4500, description: "Gas Refilling - Rashid Mahmood", date: "2026-02-07", orderId: "39003", status: "completed" },
    { id: "t5", type: "credit", amount: 35000, description: "AC Installation (3 units) - Col. Asif", date: "2026-02-02", orderId: "39005", status: "completed" },
    { id: "t6", type: "withdrawal", amount: 50000, description: "Withdrawal to EasyPaisa", date: "2026-01-30", status: "completed" },
  ],
};

// ── All Dummy Workers ──────────────────────

export const DUMMY_WORKERS: DummyWorkerAccount[] = [worker1, worker2, worker3];

// ── Auth Helpers ──────────────────────

export function findWorkerByCredentials(
  phone: string,
  password: string
): DummyWorkerAccount | null {
  const cleanPhone = phone.replace(/\s|-|\+92/g, "").replace(/^0/, "0");
  return (
    DUMMY_WORKERS.find(
      (w) =>
        w.phoneNumber.replace(/\s|-/g, "") === cleanPhone &&
        w.password === password
    ) || null
  );
}

export function findWorkerById(id: string): DummyWorkerAccount | null {
  return DUMMY_WORKERS.find((w) => w.id === id) || null;
}

// ── LocalStorage helpers for current logged-in worker ──

export function setCurrentWorkerId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentWorkerId", id);
  }
}

export function getCurrentWorkerId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentWorkerId");
  }
  return null;
}

export function clearCurrentWorkerId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentWorkerId");
  }
}

// ── Get current logged-in worker data ──

export function getCurrentWorker(): DummyWorkerAccount | null {
  const id = getCurrentWorkerId();
  if (!id) return null;
  return findWorkerById(id);
}
