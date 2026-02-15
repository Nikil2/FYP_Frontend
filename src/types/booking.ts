// Booking Types for Customer Dashboard

export type BookingStatusType = "pending" | "confirmed" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";

export interface BookingWorker {
  id: string;
  name: string;
  category: string;
  rating: number;
  profileImage?: string | null;
  isOnline: boolean;
}

export interface BookingLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  workerId: string;
  worker: BookingWorker;
  serviceId: string;
  serviceName: string;
  status: BookingStatusType;
  scheduledDate: string; // ISO date string
  scheduledTime: string; // HH:mm format
  location: BookingLocation;
  jobDescription: string;
  estimatedCost: number;
  finalCost?: number;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string
  rating?: number;
  review?: string;
}

export interface SavedLocation {
  id: string;
  name: string; // e.g., "Home", "Office"
  address: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string; // Either customer ID or worker ID
  senderName: string;
  senderType: "customer" | "worker";
  senderImage?: string | null;
  message: string;
  timestamp: string; // ISO date string
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  workerId: string;
  workerName: string;
  workerImage?: string | null;
  lastMessage: string;
  lastMessageTime: string; // ISO date string
  unreadCount: number;
  messages: ChatMessage[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string | null;
  createdAt: string; // ISO date string
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
}

export interface DashboardStats {
  activeBookings: number;
  completedBookings: number;
  totalSpent: number;
  averageRating: number;
}
