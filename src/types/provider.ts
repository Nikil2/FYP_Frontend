// ============================================
// Provider / Worker Dashboard Types
// ============================================

export type OrderStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type VerificationStatus = "verified" | "not-verified" | "pending";

export interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string | null;
  rating: number;
  completedServices: number;
  profileStatus: "approved" | "pending" | "rejected";
  isOnline: boolean;
  cnic: string;
  city: string;
  category: string;
  experienceYears: number;
  bio: string;
  joinedDate: string;
}

export interface ProviderVerification {
  phoneNumber: VerificationStatus;
  identityVerification: VerificationStatus;
  professionalInfo: VerificationStatus;
}

export interface ProviderOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string | null;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerImage?: string | null;
  location: string;
  customerLat?: number;
  customerLng?: number;
  scheduledDate: string;
  scheduledTime: string;
  agreedPrice: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  invoiceUrl?: string;
}

export interface ProviderEarnings {
  totalEarnings: number;
  thisMonthEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  lastWithdrawal?: {
    amount: number;
    date: string;
    method: string;
  };
}

export interface ProviderTransaction {
  id: string;
  type: "credit" | "debit" | "withdrawal";
  amount: number;
  description: string;
  date: string;
  orderId?: string;
  status: "completed" | "pending" | "failed";
}

export interface ProviderStats {
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalEarnings: number;
  rating: number;
  profileViews: number;
  responseRate: number;
}

export interface PreviousWork {
  id: string;
  title: string;
  image: string;
  description?: string;
  date: string;
}

export type Language = "en" | "ur";

export interface LanguageContent {
  dashboard: string;
  newServices: string;
  orders: string;
  wallet: string;
  profile: string;
  settings: string;
  myOrders: string;
  pastOrders: string;
  activeOrders: string;
  earnings: string;
  totalEarnings: string;
  availableBalance: string;
  withdraw: string;
  online: string;
  offline: string;
  viewDetails: string;
  viewInvoice: string;
  agreedPrice: string;
  serviceId: string;
  generalSettings: string;
  personalInfo: string;
  businessInfo: string;
  changePassword: string;
  previousWorkPhotos: string;
  accountVerification: string;
  phoneNumber: string;
  identityVerification: string;
  professionalInfo: string;
  verified: string;
  notVerified: string;
  pending: string;
  completed: string;
  cancelled: string;
  inProgress: string;
  accepted: string;
}
