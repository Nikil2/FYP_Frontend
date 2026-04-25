import { AdminLevel } from "@/lib/admin-auth";

export interface AdminDashboardStats {
  totalUsers: number;
  newUsersToday: number;
  blockedUsers: number;
  totalWorkers: number;
  verifiedWorkers: number;
  pendingVerifications: number;
  onlineWorkers: number;
  totalBookings: number;
  bookingsToday: number;
  activeBookings: number;
  disputedBookings: number;
  revenueToday: number;
  revenueMonth: number;
  pendingPayouts: number;
  openComplaints: number;
  avgResolutionTime: string;
}

export type AdminUserRole = "CUSTOMER" | "WORKER" | "ADMIN";

export interface AdminUserRow {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: AdminUserRole;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  lastActive: string;
}

export interface WorkerVerificationItem {
  workerId: string;
  fullName: string;
  phoneNumber: string;
  cnicNumber: string;
  experienceYears: number;
  visitingCharges: number;
  services: string[];
  submittedAt: string;
}

export interface ComplaintItem {
  id: string;
  bookingId: string;
  customerName: string;
  workerName: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  isResolved: boolean;
  createdAt: string;
}

export interface AdminServiceCategory {
  id: number;
  name: string;
  nameUrdu: string;
  isActive: boolean;
  workersCount: number;
}

export interface RevenuePoint {
  period: string;
  revenue: number;
  bookings: number;
}

export interface BookingTrendPoint {
  day: string;
  total: number;
}

export interface AdminActivity {
  id: string;
  actor: string;
  adminLevel: AdminLevel;
  action: string;
  target: string;
  timeAgo: string;
}

export interface WorkerQualityItem {
  workerId: string;
  workerName: string;
  service: string;
  averageRating: number;
  totalReviews: number;
  flaggedReviews: number;
  completionRate: number;
}

export interface ReviewModerationItem {
  id: string;
  workerId: string;
  workerName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isFlagged: boolean;
  status: "VISIBLE" | "HIDDEN";
  reportReason?: string;
}


export const dashboardStats: AdminDashboardStats = {
  totalUsers: 1482,
  newUsersToday: 34,
  blockedUsers: 19,
  totalWorkers: 496,
  verifiedWorkers: 411,
  pendingVerifications: 23,
  onlineWorkers: 178,
  totalBookings: 5823,
  bookingsToday: 92,
  activeBookings: 311,
  disputedBookings: 14,
  revenueToday: 145000,
  revenueMonth: 3742000,
  pendingPayouts: 264000,
  openComplaints: 17,
  avgResolutionTime: "11h 20m",
};

export const adminUsersSeed: AdminUserRow[] = [
  {
    id: "U-1001",
    fullName: "Ali Raza",
    phoneNumber: "03001234567",
    role: "CUSTOMER",
    isVerified: true,
    isBlocked: false,
    createdAt: "2026-03-12",
    lastActive: "2m ago",
  },
  {
    id: "U-1002",
    fullName: "Ayesha Malik",
    phoneNumber: "03112223344",
    role: "WORKER",
    isVerified: true,
    isBlocked: false,
    createdAt: "2026-02-10",
    lastActive: "8m ago",
  },
  {
    id: "U-1003",
    fullName: "Hamza Khan",
    phoneNumber: "03221110000",
    role: "CUSTOMER",
    isVerified: false,
    isBlocked: false,
    createdAt: "2026-04-02",
    lastActive: "1h ago",
  },
  {
    id: "U-1004",
    fullName: "Rabia Tahir",
    phoneNumber: "03335554444",
    role: "WORKER",
    isVerified: true,
    isBlocked: true,
    createdAt: "2025-12-23",
    lastActive: "3d ago",
  },
  {
    id: "U-1005",
    fullName: "Usman Farooq",
    phoneNumber: "03446667777",
    role: "CUSTOMER",
    isVerified: true,
    isBlocked: false,
    createdAt: "2026-01-15",
    lastActive: "27m ago",
  },
  {
    id: "U-1006",
    fullName: "Platform Moderator",
    phoneNumber: "03009998888",
    role: "ADMIN",
    isVerified: true,
    isBlocked: false,
    createdAt: "2025-10-01",
    lastActive: "now",
  },
];

export const pendingVerificationsSeed: WorkerVerificationItem[] = [
  {
    workerId: "W-203",
    fullName: "Shahzaib Ahmed",
    phoneNumber: "03070001122",
    cnicNumber: "4210112345671",
    experienceYears: 6,
    visitingCharges: 1200,
    services: ["Electrician", "AC Technician"],
    submittedAt: "2026-04-24 11:42",
  },
  {
    workerId: "W-204",
    fullName: "Mariam Yousuf",
    phoneNumber: "03014445566",
    cnicNumber: "3740512345673",
    experienceYears: 4,
    visitingCharges: 900,
    services: ["Painter", "Home Cleaner"],
    submittedAt: "2026-04-24 18:09",
  },
  {
    workerId: "W-205",
    fullName: "Bilal Mehmood",
    phoneNumber: "03211119999",
    cnicNumber: "6110198765432",
    experienceYears: 8,
    visitingCharges: 1500,
    services: ["Plumber", "Mason"],
    submittedAt: "2026-04-25 08:25",
  },
];

export const complaintsSeed: ComplaintItem[] = [
  {
    id: "C-9001",
    bookingId: "B-5601",
    customerName: "Komal Abbas",
    workerName: "Nadeem Akhtar",
    description: "Worker arrived 2 hours late and job remained incomplete.",
    severity: "MEDIUM",
    isResolved: false,
    createdAt: "2026-04-24 16:30",
  },
  {
    id: "C-9002",
    bookingId: "B-5602",
    customerName: "Abdullah Waheed",
    workerName: "Shah Nawaz",
    description: "Payment dispute after extra charges not agreed in chat.",
    severity: "HIGH",
    isResolved: false,
    createdAt: "2026-04-25 09:40",
  },
  {
    id: "C-9003",
    bookingId: "B-5603",
    customerName: "Hina Noor",
    workerName: "Tariq Butt",
    description: "Issue was solved but app still shows complaint open.",
    severity: "LOW",
    isResolved: true,
    createdAt: "2026-04-22 13:10",
  },
];

export const serviceCategoriesSeed: AdminServiceCategory[] = [
  { id: 1, name: "Electrician", nameUrdu: "الیکٹریشن", isActive: true, workersCount: 89 },
  { id: 2, name: "Plumber", nameUrdu: "پلمبر", isActive: true, workersCount: 74 },
  { id: 3, name: "Carpenter", nameUrdu: "بڑھئی", isActive: true, workersCount: 63 },
  { id: 4, name: "Painter", nameUrdu: "پینٹر", isActive: true, workersCount: 52 },
  { id: 5, name: "AC Technician", nameUrdu: "اے سی ٹیکنیشن", isActive: true, workersCount: 44 },
  { id: 6, name: "Pest Control", nameUrdu: "کیڑے مار", isActive: false, workersCount: 11 },
];

export const bookingTrendSeed: BookingTrendPoint[] = [
  { day: "Mon", total: 75 },
  { day: "Tue", total: 86 },
  { day: "Wed", total: 92 },
  { day: "Thu", total: 88 },
  { day: "Fri", total: 103 },
  { day: "Sat", total: 125 },
  { day: "Sun", total: 111 },
];

export const revenueBreakdownSeed: RevenuePoint[] = [
  { period: "Jan", revenue: 2890000, bookings: 821 },
  { period: "Feb", revenue: 3100000, bookings: 862 },
  { period: "Mar", revenue: 3440000, bookings: 918 },
  { period: "Apr", revenue: 3742000, bookings: 992 },
];

export const adminActivitySeed: AdminActivity[] = [
  {
    id: "A-1",
    actor: "Noman Siddiqui",
    adminLevel: "SUPER_ADMIN",
    action: "Approved worker verification",
    target: "Shahzaib Ahmed (W-203)",
    timeAgo: "5m ago",
  },
  {
    id: "A-2",
    actor: "Fatima Aslam",
    adminLevel: "MODERATOR",
    action: "Blocked user for abusive language",
    target: "Rabia Tahir (U-1004)",
    timeAgo: "18m ago",
  },
  {
    id: "A-3",
    actor: "Noman Siddiqui",
    adminLevel: "SUPER_ADMIN",
    action: "Resolved complaint with partial refund",
    target: "Complaint C-9002",
    timeAgo: "42m ago",
  },
];

export const workerQualitySeed: WorkerQualityItem[] = [
  {
    workerId: "W-101",
    workerName: "Ayesha Malik",
    service: "Electrician",
    averageRating: 4.8,
    totalReviews: 126,
    flaggedReviews: 1,
    completionRate: 96,
  },
  {
    workerId: "W-102",
    workerName: "Rabia Tahir",
    service: "Painter",
    averageRating: 4.1,
    totalReviews: 48,
    flaggedReviews: 4,
    completionRate: 89,
  },
  {
    workerId: "W-103",
    workerName: "Bilal Mehmood",
    service: "Plumber",
    averageRating: 4.6,
    totalReviews: 83,
    flaggedReviews: 0,
    completionRate: 94,
  },
  {
    workerId: "W-104",
    workerName: "Shah Nawaz",
    service: "AC Technician",
    averageRating: 3.9,
    totalReviews: 37,
    flaggedReviews: 5,
    completionRate: 82,
  },
];

export const reviewModerationSeed: ReviewModerationItem[] = [
  {
    id: "R-7001",
    workerId: "W-101",
    workerName: "Ayesha Malik",
    customerName: "Hina Noor",
    rating: 5,
    comment: "Excellent wiring work, arrived on time and completed safely.",
    createdAt: "2026-04-24 12:10",
    isFlagged: false,
    status: "VISIBLE",
  },
  {
    id: "R-7002",
    workerId: "W-104",
    workerName: "Shah Nawaz",
    customerName: "Abdullah Waheed",
    rating: 1,
    comment: "Used inappropriate language in chat and demanded extra cash.",
    createdAt: "2026-04-25 09:05",
    isFlagged: true,
    status: "VISIBLE",
    reportReason: "Abusive language",
  },
  {
    id: "R-7003",
    workerId: "W-102",
    workerName: "Rabia Tahir",
    customerName: "Komal Abbas",
    rating: 2,
    comment: "Job was incomplete but worker marked it as finished.",
    createdAt: "2026-04-23 17:52",
    isFlagged: true,
    status: "HIDDEN",
    reportReason: "Misleading claim",
  },
  {
    id: "R-7004",
    workerId: "W-103",
    workerName: "Bilal Mehmood",
    customerName: "Ali Raza",
    rating: 4,
    comment: "Good service overall, minor delay but quality was solid.",
    createdAt: "2026-04-22 15:40",
    isFlagged: false,
    status: "VISIBLE",
  },
];

