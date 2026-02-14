// ============================================
// Provider / Worker Mock Data
// Returns data for the currently logged-in dummy worker
// ============================================

import type {
  ProviderProfile,
  ProviderVerification,
  ProviderOrder,
  ProviderEarnings,
  ProviderTransaction,
  ProviderStats,
  PreviousWork,
  LanguageContent,
} from "@/types/provider";
import { getCurrentWorker } from "@/app/dummy/dummy-workers";

// ── Language Translations ──────────────────────

export const translations: Record<"en" | "ur", LanguageContent> = {
  en: {
    dashboard: "Dashboard",
    newServices: "New Services",
    orders: "Orders",
    wallet: "Wallet",
    profile: "My Profile",
    settings: "Settings",
    myOrders: "My Orders",
    pastOrders: "Past Orders",
    activeOrders: "Active Orders",
    earnings: "Earnings",
    totalEarnings: "Total Earnings",
    availableBalance: "Available Balance",
    withdraw: "Withdraw Funds",
    online: "Online",
    offline: "Offline",
    viewDetails: "Details",
    viewInvoice: "View Invoice",
    agreedPrice: "Agreed Price",
    serviceId: "Service ID",
    generalSettings: "General Settings",
    personalInfo: "Personal Information",
    businessInfo: "Business Information",
    changePassword: "Change Password",
    previousWorkPhotos: "Previous Work Photos",
    accountVerification: "Account Verification",
    phoneNumber: "Phone Number",
    identityVerification: "Your Identity Verification",
    professionalInfo: "Professional Information",
    verified: "Verified",
    notVerified: "Not Verified",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
    inProgress: "In Progress",
    accepted: "Accepted",
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    newServices: "نئی سروسز",
    orders: "آرڈرز",
    wallet: "والیٹ",
    profile: "میری پروفائل",
    settings: "سیٹنگز",
    myOrders: "میرے آرڈرز",
    pastOrders: "پچھلے آرڈرز",
    activeOrders: "فعال آرڈرز",
    earnings: "آمدنی",
    totalEarnings: "کل آمدنی",
    availableBalance: "دستیاب بیلنس",
    withdraw: "رقم نکالیں",
    online: "آن لائن",
    offline: "آف لائن",
    viewDetails: "تفصیلات",
    viewInvoice: "انوائس دیکھیں",
    agreedPrice: "طے شدہ قیمت",
    serviceId: "سروس آئی ڈی",
    generalSettings: "عمومی سیٹنگز",
    personalInfo: "ذاتی معلومات",
    businessInfo: "کاروباری معلومات",
    changePassword: "پاسورڈ تبدیل کریں",
    previousWorkPhotos: "پچھلے کام کی تصاویر",
    accountVerification: "اکاؤنٹ تصدیق",
    phoneNumber: "فون نمبر",
    identityVerification: "آپ کی شناختی تصدیق",
    professionalInfo: "پیشہ ورانہ معلومات",
    verified: "تصدیق شدہ",
    notVerified: "تصدیق نہیں ہوئی",
    pending: "زیر التوا",
    completed: "مکمل",
    cancelled: "منسوخ",
    inProgress: "جاری ہے",
    accepted: "قبول شدہ",
  },
};

// ── Provider Profile ──────────────────────

export function getProviderProfile(): ProviderProfile {
  const worker = getCurrentWorker();
  if (worker) return worker.profile;

  // Fallback
  return {
    id: "provider-1",
    name: "Hasnain Saeed",
    email: "hasnain@example.com",
    phone: "+92 312 1234567",
    profileImage: null,
    rating: 5.0,
    completedServices: 7,
    profileStatus: "pending",
    isOnline: false,
    cnic: "42101-XXXXXXX-X",
    city: "Multan, Pakistan",
    category: "AC Technician",
    experienceYears: 5,
    bio: "Experienced AC technician specializing in general service, installation, and repair. Providing quality service across Multan.",
    joinedDate: "2023-03-15",
  };
}

// ── Provider Verification ──────────────────

export function getProviderVerification(): ProviderVerification {
  const worker = getCurrentWorker();
  if (worker) return worker.verification;

  return {
    phoneNumber: "verified",
    identityVerification: "verified",
    professionalInfo: "not-verified",
  };
}

// ── Provider Stats ──────────────────────

export function getProviderStats(): ProviderStats {
  const worker = getCurrentWorker();
  if (worker) return worker.stats;

  return {
    activeOrders: 0,
    completedOrders: 7,
    cancelledOrders: 1,
    totalEarnings: 15500,
    rating: 5.0,
    profileViews: 342,
    responseRate: 92,
  };
}

// ── Provider Orders ──────────────────────

export function getActiveOrders(): ProviderOrder[] {
  const worker = getCurrentWorker();
  if (worker) return worker.activeOrders;

  return [
    {
      id: "24001",
      serviceId: "s-ac-general",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "accepted",
      customerName: "Ali Raza",
      customerPhone: "+92 300 1234567",
      customerImage: null,
      location: "5G4F+XX Multan, Pakistan",
      customerLat: 30.1975,
      customerLng: 71.4708,
      scheduledDate: "2026-02-14",
      scheduledTime: "10:00 AM",
      agreedPrice: 2500,
      notes: "2 split ACs need general service",
      createdAt: "2026-02-13T08:00:00Z",
    },
  ];
}

export function getPastOrders(): ProviderOrder[] {
  const worker = getCurrentWorker();
  if (worker) return worker.pastOrders;

  return [
    {
      id: "23655",
      serviceId: "s-ac-general",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "completed",
      customerName: "Muhammad Usman",
      customerPhone: "+92 301 9876543",
      customerImage: null,
      location: "5G4F+XX Multan, Pakistan",
      scheduledDate: "2023-10-27",
      scheduledTime: "08:00 PM",
      agreedPrice: 0,
      notes: "testing order",
      createdAt: "2023-10-27T20:00:00Z",
      completedAt: "2023-10-27T21:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "23654",
      serviceId: "s-ac-general",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "cancelled",
      customerName: "Fahad Khan",
      customerPhone: "+92 333 5551234",
      customerImage: null,
      location: "5G4F+XX Multan, Pakistan",
      scheduledDate: "2023-10-27",
      scheduledTime: "08:00 PM",
      agreedPrice: 0,
      notes: "testing order",
      createdAt: "2023-10-27T20:00:00Z",
    },
    {
      id: "21407",
      serviceId: "s-cabinet",
      serviceName: "Cabinet Installation or Repair",
      serviceImage: null,
      status: "completed",
      customerName: "Bilal Ahmed",
      customerPhone: "+92 321 7654321",
      customerImage: null,
      location: "Multan, Pakistan",
      scheduledDate: "2023-09-15",
      scheduledTime: "10:00 PM",
      agreedPrice: 500,
      createdAt: "2023-09-15T22:00:00Z",
      completedAt: "2023-09-15T23:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "21350",
      serviceId: "s-ac-install",
      serviceName: "AC Installation",
      serviceImage: null,
      status: "completed",
      customerName: "Sara Malik",
      customerPhone: "+92 345 1112233",
      customerImage: null,
      location: "DHA Multan, Pakistan",
      scheduledDate: "2023-09-10",
      scheduledTime: "02:00 PM",
      agreedPrice: 3500,
      createdAt: "2023-09-10T14:00:00Z",
      completedAt: "2023-09-10T16:00:00Z",
      invoiceUrl: "#",
    },
    {
      id: "21200",
      serviceId: "s-ac-general",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "completed",
      customerName: "Imran Shah",
      customerPhone: "+92 312 9998877",
      customerImage: null,
      location: "Cantt Multan, Pakistan",
      scheduledDate: "2023-08-20",
      scheduledTime: "11:00 AM",
      agreedPrice: 2000,
      createdAt: "2023-08-20T11:00:00Z",
      completedAt: "2023-08-20T12:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "20980",
      serviceId: "s-ac-repair",
      serviceName: "AC Repair",
      serviceImage: null,
      status: "completed",
      customerName: "Kamran Hussain",
      customerPhone: "+92 300 4445566",
      customerImage: null,
      location: "Bosan Road, Multan",
      scheduledDate: "2023-08-05",
      scheduledTime: "04:00 PM",
      agreedPrice: 4000,
      createdAt: "2023-08-05T16:00:00Z",
      completedAt: "2023-08-05T18:00:00Z",
      invoiceUrl: "#",
    },
    {
      id: "20750",
      serviceId: "s-ac-general",
      serviceName: "AC General Service",
      serviceImage: null,
      status: "completed",
      customerName: "Nadeem Raza",
      customerPhone: "+92 333 2223344",
      customerImage: null,
      location: "Gulgasht Colony, Multan",
      scheduledDate: "2023-07-22",
      scheduledTime: "09:00 AM",
      agreedPrice: 1500,
      createdAt: "2023-07-22T09:00:00Z",
      completedAt: "2023-07-22T10:30:00Z",
      invoiceUrl: "#",
    },
    {
      id: "20500",
      serviceId: "s-cabinet",
      serviceName: "Cabinet Installation or Repair",
      serviceImage: null,
      status: "cancelled",
      customerName: "Zain Ali",
      customerPhone: "+92 345 6667788",
      customerImage: null,
      location: "Shah Rukn-e-Alam, Multan",
      scheduledDate: "2023-07-10",
      scheduledTime: "03:00 PM",
      agreedPrice: 800,
      createdAt: "2023-07-10T15:00:00Z",
    },
  ];
}

// ── Provider Earnings ──────────────────────

export function getProviderEarnings(): ProviderEarnings {
  const worker = getCurrentWorker();
  if (worker) return worker.earnings;

  return {
    totalEarnings: 15500,
    thisMonthEarnings: 2500,
    availableBalance: 5230,
    pendingBalance: 2500,
    lastWithdrawal: {
      amount: 8000,
      date: "2023-10-20",
      method: "JazzCash",
    },
  };
}

// ── Provider Transactions ──────────────────

export function getProviderTransactions(): ProviderTransaction[] {
  const worker = getCurrentWorker();
  if (worker) return worker.transactions;

  return [
    {
      id: "t1",
      type: "credit",
      amount: 2500,
      description: "AC General Service - Ali Raza",
      date: "2026-02-13",
      orderId: "24001",
      status: "pending",
    },
    {
      id: "t2",
      type: "withdrawal",
      amount: 8000,
      description: "Withdrawal to JazzCash",
      date: "2023-10-20",
      status: "completed",
    },
    {
      id: "t3",
      type: "credit",
      amount: 0,
      description: "AC General Service - Muhammad Usman",
      date: "2023-10-27",
      orderId: "23655",
      status: "completed",
    },
    {
      id: "t4",
      type: "credit",
      amount: 500,
      description: "Cabinet Installation - Bilal Ahmed",
      date: "2023-09-15",
      orderId: "21407",
      status: "completed",
    },
    {
      id: "t5",
      type: "credit",
      amount: 3500,
      description: "AC Installation - Sara Malik",
      date: "2023-09-10",
      orderId: "21350",
      status: "completed",
    },
    {
      id: "t6",
      type: "credit",
      amount: 2000,
      description: "AC General Service - Imran Shah",
      date: "2023-08-20",
      orderId: "21200",
      status: "completed",
    },
    {
      id: "t7",
      type: "credit",
      amount: 4000,
      description: "AC Repair - Kamran Hussain",
      date: "2023-08-05",
      orderId: "20980",
      status: "completed",
    },
    {
      id: "t8",
      type: "credit",
      amount: 1500,
      description: "AC General Service - Nadeem Raza",
      date: "2023-07-22",
      orderId: "20750",
      status: "completed",
    },
  ];
}

// ── Previous Work Photos ──────────────────

export function getPreviousWorkPhotos(): PreviousWork[] {
  return [
    {
      id: "pw1",
      title: "AC Installation - Split Unit",
      image: "/images/work-1.jpg",
      description: "Installed 1.5 ton split AC in bedroom",
      date: "2023-10-15",
    },
    {
      id: "pw2",
      title: "AC General Service",
      image: "/images/work-2.jpg",
      description: "Full service of 2 units",
      date: "2023-09-20",
    },
    {
      id: "pw3",
      title: "Cabinet Repair",
      image: "/images/work-3.jpg",
      description: "Kitchen cabinet door repair",
      date: "2023-09-10",
    },
  ];
}
