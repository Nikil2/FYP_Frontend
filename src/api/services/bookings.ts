/**
 * Bookings API Service
 * Handles booking CRUD, price proposals, and status management
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

// ============================================
// TYPES
// ============================================

export interface CreateBookingData {
  customerId: string;
  workerId: string;
  serviceId: number;
  description: string;
  jobAddress: string;
  jobLat: number;
  jobLng: number;
  scheduledAt?: string;
  initialPrice?: number;
  imageUrls?: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  serviceId: string;
  description: string;
  jobAddress: string;
  jobLat: number;
  jobLng: number;
  imageUrls: string[];
  scheduledAt: string | null;
  status: 'PENDING' | 'NEGOTIATION' | 'ACCEPTED' | 'IN_PROGRESS' | 'PENDING_CONFIRMATION' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  finalPrice: string | null;
  customer: { id: string; fullName: string; phoneNumber: string; profilePicUrl?: string };
  worker: {
    id: string;
    user: { id: string; fullName: string; phoneNumber: string; profilePicUrl?: string };
    averageRating: number;
  };
  service: { id: string; name: string };
  proposals?: PriceProposal[];
  messages?: Message[];
  feedback?: Feedback | null;
  createdAt: string;
  updatedAt: string;
}

export interface PriceProposal {
  id: string;
  bookingId: string;
  proposedBy: string;
  amount: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
  sender: { id: string; fullName: string; profilePicUrl?: string; role: string };
  createdAt: string;
}

export interface Feedback {
  id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ============================================
// BOOKING CRUD
// ============================================

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  return apiClient.post<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS_CREATE, data);
}

export async function getMyBookings(
  skip: number = 0,
  take: number = 20,
  status?: string
): Promise<{ data: Booking[]; total: number }> {
  let url = `${API_CONFIG.ENDPOINTS.BOOKINGS_MY}?skip=${skip}&take=${take}`;
  if (status) url += `&status=${status}`;
  return apiClient.get<{ data: Booking[]; total: number }>(url);
}

export async function getBookingById(bookingId: string): Promise<Booking> {
  return apiClient.get<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS_DETAIL(bookingId));
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
  return apiClient.patch<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS_UPDATE_STATUS(bookingId), { status });
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  return apiClient.post<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS_CANCEL(bookingId), {});
}

/** Worker marks an in-progress job as done → awaits customer confirmation. */
export async function markJobDone(bookingId: string): Promise<Booking> {
  return apiClient.patch<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS_MARK_DONE(bookingId), {});
}

/** Customer confirms completion → job counts + commission is collected. */
export async function confirmCompletion(bookingId: string): Promise<Booking> {
  return apiClient.patch<Booking>(
    API_CONFIG.ENDPOINTS.BOOKINGS_CONFIRM_COMPLETION(bookingId),
    {}
  );
}

// ============================================
// PRICE PROPOSALS
// ============================================

export async function createProposal(bookingId: string, amount: number): Promise<PriceProposal> {
  return apiClient.post<PriceProposal>(
    API_CONFIG.ENDPOINTS.BOOKINGS_PROPOSALS(bookingId),
    { amount }
  );
}

export async function acceptProposal(bookingId: string, proposalId: string): Promise<Booking> {
  return apiClient.post<Booking>(
    API_CONFIG.ENDPOINTS.BOOKINGS_ACCEPT_PROPOSAL(bookingId, proposalId),
    {}
  );
}

export async function getProposals(bookingId: string): Promise<PriceProposal[]> {
  return apiClient.get<PriceProposal[]>(
    `${API_CONFIG.ENDPOINTS.BOOKINGS_PROPOSALS(bookingId)}`
  );
}

export default {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  markJobDone,
  confirmCompletion,
  createProposal,
  acceptProposal,
};
