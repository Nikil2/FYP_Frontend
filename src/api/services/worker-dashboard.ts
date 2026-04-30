import { apiClient } from '../client';
import { getAuthUser } from '@/lib/auth';
const WORKER_PROFILE_CACHE_KEY = 'worker-dashboard-profile:v1';

export interface WorkerDashboardProfile {
  userId: string;
  workerId: string;
  fullName: string;
  phoneNumber: string;
  profilePicUrl?: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isOnline: boolean;
  averageRating: number;
  totalJobsCompleted: number;
}

export interface WorkerDashboardOrder {
  id: string;
  serviceName: string;
  status: string;
  location: string;
  scheduledTime: string;
  scheduledDate: string;
  agreedPrice: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
}

export interface WorkerWalletSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  thisMonthEarnings: number;
}

export interface WorkerWalletTransaction {
  id: string;
  type: 'credit' | 'withdrawal' | 'debit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  orderId?: string;
}

interface WorkerProfileResponse {
  id: string;
  workerId: string;
  fullName: string;
  phoneNumber: string;
  profilePicUrl?: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isOnline: boolean;
  averageRating: number;
  totalJobsCompleted: number;
}
interface OnlineStatusResponse {
  workerId: string;
  isOnline: boolean;
  updatedAt: string;
}

function extractPayload<T>(response: T | { data?: T }): T {
  if (response && typeof response === 'object' && 'data' in (response as Record<string, unknown>)) {
    const wrapped = response as { data?: T };
    if (typeof wrapped.data !== 'undefined') {
      return wrapped.data as T;
    }
  }

  return response as T;
}

export function resolveWorkerUserId(): string | null {
  const envUserId = process.env.NEXT_PUBLIC_WORKER_USER_ID;
  if (envUserId) return envUserId;

  const authUser = getAuthUser();
  if (authUser?.id) return authUser.id;

  return null;
}

export async function getWorkerDashboardProfileByUserId(userId: string): Promise<WorkerDashboardProfile> {
  let profile: WorkerProfileResponse;
  try {
    const response = await apiClient.get<WorkerProfileResponse | { data?: WorkerProfileResponse }>(
      `/workers/me/${userId}`
    );
    profile = extractPayload(response);
  } catch {
    const fallback = await apiClient.get<WorkerProfileResponse | { data?: WorkerProfileResponse }>(
      `/workers/user/${userId}`
    );
    profile = extractPayload(fallback);
  }

  const mapped = {
    userId: profile.id,
    workerId: profile.workerId,
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber,
    profilePicUrl: profile.profilePicUrl,
    verificationStatus: profile.verificationStatus,
    isOnline: profile.isOnline,
    averageRating: profile.averageRating,
    totalJobsCompleted: profile.totalJobsCompleted,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(WORKER_PROFILE_CACHE_KEY, JSON.stringify(mapped));
  }

  return mapped;
}

export function getCachedWorkerDashboardProfile(): WorkerDashboardProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(WORKER_PROFILE_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WorkerDashboardProfile;
  } catch {
    return null;
  }
}

function mapOrderStatus(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === 'IN_PROGRESS') return 'in-progress';
  return normalized.toLowerCase();
}

export async function getWorkerDashboardOrders(
  workerId: string,
  status: 'active' | 'past',
): Promise<WorkerDashboardOrder[]> {
  const response = await apiClient.get<Array<Record<string, unknown>> | { data?: Array<Record<string, unknown>> }>(
    `/workers/${workerId}/orders?status=${status}&skip=0&take=50`
  );

  const orders = extractPayload(response) || [];

  return orders.map((order) => {
    const scheduledAtRaw = (order.scheduledAt as string | null) || null;
    const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw) : null;

    return {
      id: String(order.id || ''),
      serviceName: String(order.serviceName || 'Service'),
      status: mapOrderStatus(String(order.status || 'pending')),
      location: String(order.location || ''),
      scheduledTime: scheduledAt
        ? scheduledAt.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
        : 'TBD',
      scheduledDate: scheduledAt
        ? scheduledAt.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'TBD',
      agreedPrice: Number(order.agreedPrice || 0),
      customerName: String((order.customer as Record<string, unknown>)?.fullName || 'Customer'),
      customerPhone: String((order.customer as Record<string, unknown>)?.phoneNumber || ''),
      notes: String(order.description || ''),
      createdAt: String(order.createdAt || new Date().toISOString()),
    };
  });
}

export async function setWorkerOnlineStatus(workerId: string, isOnline: boolean): Promise<WorkerDashboardProfile> {
  const response = await apiClient.put<OnlineStatusResponse | { data?: OnlineStatusResponse }>(
    `/workers/${workerId}/online-status`,
    { isOnline }
  );

  const updated = extractPayload(response);
  const cached = getCachedWorkerDashboardProfile();
  if (!cached) {
    throw new Error('Worker profile cache is missing');
  }

  const mapped = {
    ...cached,
    workerId: updated.workerId,
    isOnline: updated.isOnline,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(WORKER_PROFILE_CACHE_KEY, JSON.stringify(mapped));
  }

  return mapped;
}

export async function getWorkerWalletSummary(workerId: string): Promise<WorkerWalletSummary> {
  const response = await apiClient.get<WorkerWalletSummary | { data?: WorkerWalletSummary }>(
    `/workers/${workerId}/wallet/summary`
  );
  return extractPayload(response);
}

export async function getWorkerWalletTransactions(workerId: string): Promise<WorkerWalletTransaction[]> {
  const response = await apiClient.get<WorkerWalletTransaction[] | { data?: WorkerWalletTransaction[] }>(
    `/workers/${workerId}/wallet/transactions`
  );
  return extractPayload(response) || [];
}
