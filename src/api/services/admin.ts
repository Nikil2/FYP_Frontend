/**
 * Admin API Functions
 * Handles admin panel operations: login, dashboard stats, user/worker management,
 * complaints, reviews, services, revenue, and analytics
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  adminLevel: string;
  phoneNumber: string;
  fullName: string;
  profilePicUrl?: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalWorkers: number;
  verifiedWorkers: number;
  pendingVerifications: number;
  totalBookings: number;
  bookingsToday: number;
  activeComplaints: number;
  monthlyRevenue: number;
  averageWorkerRating: number;
  onlineWorkers: number;
  blockedWorkers: number;
  flaggedReviews: number;
}

export interface DashboardActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface WorkerQuality {
  workerId: string;
  workerName: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  verificationStatus: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  workerQuality: WorkerQuality[];
  openComplaints: number;
  pendingPayouts: number;
  averageResolutionTime: string;
}

export interface UserProfile {
  id: string;
  phoneNumber: string;
  fullName: string;
  profilePicUrl?: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  workerProfile?: {
    verificationStatus: string;
    averageRating: number;
    totalJobsCompleted: number;
  };
}

export interface WorkerProfile {
  id: string;
  userId: string;
  cnicNumber: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  selfieImageUrl?: string;
  bio?: string;
  experienceYears: number;
  visitingCharges: number;
  homeAddress: string;
  homeLat?: number;
  homeLng?: number;
  verificationStatus: string;
  averageRating: number;
  totalJobsCompleted: number;
  isOnline: boolean;
  submittedAt?: string;
  user: {
    fullName: string;
    phoneNumber: string;
    profilePicUrl?: string;
    isBlocked: boolean;
  };
  portfolio?: Array<{
    id: string;
    imageUrl: string;
    description?: string;
    workerName?: string;
  }>;
  services: Array<{
    id: number;
    name: string;
    iconUrl?: string;
  }>;
}

export interface Complaint {
  id: string;
  bookingId: string;
  description: string;
  isResolved: boolean;
  evidenceUrls: string[];
  createdAt: string;
  booking: {
    id: string;
    description: string;
    customer: {
      fullName: string;
      phoneNumber: string;
    };
    worker: {
      id: string;
      user: {
        fullName: string;
        phoneNumber: string;
      };
    };
    service: {
      name: string;
    };
  };
  admin?: {
    adminLevel: string;
    user: {
      fullName: string;
    };
  };
}

export interface AdminJob {
  id: string;
  status: string;
  description: string;
  jobAddress: string;
  finalPrice: number | null;
  scheduledAt?: string | null;
  createdAt: string;
  customerId: string;
  workerId: string;
  serviceId: number;
  customer: {
    id: string;
    fullName: string;
    phoneNumber: string;
    profilePicUrl?: string;
  };
  worker: {
    id: string;
    verificationStatus: string;
    averageRating: number;
    totalJobsCompleted: number;
    isOnline: boolean;
    user: {
      id: string;
      fullName: string;
      phoneNumber: string;
      profilePicUrl?: string;
      isBlocked: boolean;
    };
  };
  service: {
    id: number;
    name: string;
    iconUrl?: string;
  };
  counts: {
    messages: number;
    proposals: number;
    complaints: number;
  };
}

export interface AdminJobDetail extends AdminJob {
  jobLat: number;
  jobLng: number;
  worker: AdminJob["worker"] & {
    cnicNumber: string;
    experienceYears: number;
    visitingCharges: number;
    homeAddress: string;
    services: Array<{
      id: number;
      name: string;
      iconUrl?: string;
    }>;
    user: AdminJob["worker"]["user"] & {
      isVerified: boolean;
    };
  };
  proposals: Array<{
    id: string;
    bookingId: string;
    proposedBy: string;
    amount: number;
    status: string;
    parentId?: string | null;
    createdAt: string;
  }>;
  messages: Array<{
    id: string;
    senderId: string;
    content: string;
    type: string;
    createdAt: string;
    sender: {
      id: string;
      fullName: string;
      phoneNumber: string;
    };
  }>;
  complaints: Array<{
    id: string;
    description: string;
    isResolved: boolean;
    evidenceUrls: string[];
    createdAt: string;
    admin?: {
      id: string;
      adminLevel: string;
      user: {
        fullName: string;
      };
    } | null;
  }>;
  feedback?: {
    id: string;
    bookingId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
      id: string;
      fullName: string;
      phoneNumber: string;
    };
  } | null;
  summary: {
    totalMessages: number;
    totalProposals: number;
    totalComplaints: number;
    hasFeedback: boolean;
  };
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    fullName: string;
    phoneNumber: string;
    profilePicUrl?: string;
  };
  booking: {
    id: string;
    description: string;
    worker: {
      id: string;
      user: {
        fullName: string;
      };
    };
    service: {
      name: string;
    };
  };
}

export interface ServiceCategory {
  id: number;
  name: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface RevenueStats {
  grossRevenue: number;
  platformFee: number;
  refunds: number;
  netRevenue: number;
  revenueByWeek: Array<{ week: string; amount: number }>;
  totalTransactions: number;
}

export interface AnalyticsData {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  disputedBookings: number;
  completionRate: number;
  disputeRate: number;
  dailyBookings: Array<{ day: string; count: number }>;
  serviceDemand: Array<{
    serviceId: number;
    serviceName: string;
    count: number;
  }>;
}

type WrappedResponse<T> = {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
};

function unwrapResponse<T>(response: WrappedResponse<T> | T): T {
  if (
    response &&
    typeof response === 'object' &&
    'statusCode' in (response as Record<string, unknown>) &&
    'timestamp' in (response as Record<string, unknown>) &&
    'data' in (response as Record<string, unknown>)
  ) {
    return (response as WrappedResponse<T>).data;
  }

  return response as T;
}

export async function adminLogin(credentials: AdminLoginData): Promise<{ data: AdminProfile; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: AdminProfile; message: string }> | { data: AdminProfile; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_LOGIN,
    credentials,
  );

  const response = unwrapResponse(raw);
  if (!response?.data) {
    throw new Error('Admin login failed');
  }

  return response;
}

export async function getDashboardStats(): Promise<{ data: DashboardResponse }> {
  const raw = await apiClient.get<WrappedResponse<{ data: DashboardResponse }> | { data: DashboardResponse }>(
    API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD,
  );

  const response = unwrapResponse(raw);
  if (!response?.data) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return response;
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  role?: string,
  status?: string,
): Promise<{ data: UserProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(role && { role }),
    ...(status && { status }),
  });

  const raw = await apiClient.get<
    WrappedResponse<{ data: UserProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }> |
    { data: UserProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }
  >(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}?${params.toString()}`);

  return unwrapResponse(raw);
}

export async function blockUser(userId: string): Promise<{ data: UserProfile; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: UserProfile; message: string }> | { data: UserProfile; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_BLOCK_USER(userId),
    {},
  );

  return unwrapResponse(raw);
}

export async function unblockUser(userId: string): Promise<{ data: UserProfile; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: UserProfile; message: string }> | { data: UserProfile; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_UNBLOCK_USER(userId),
    {},
  );

  return unwrapResponse(raw);
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  const raw = await apiClient.delete<WrappedResponse<{ message: string }> | { message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_DELETE_USER(userId),
  );

  return unwrapResponse(raw);
}

export async function getAllWorkers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
): Promise<{ data: WorkerProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && { status }),
  });

  const raw = await apiClient.get<
    WrappedResponse<{ data: WorkerProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }> |
    { data: WorkerProfile[]; meta: { total: number; page: number; limit: number; totalPages: number } }
  >(`${API_CONFIG.ENDPOINTS.ADMIN_WORKERS}?${params.toString()}`);

  return unwrapResponse(raw);
}

export async function getPendingVerifications(): Promise<{ data: WorkerProfile[]; total: number }> {
  const raw = await apiClient.get<WrappedResponse<{ data: WorkerProfile[]; total: number }> | { data: WorkerProfile[]; total: number }>(
    API_CONFIG.ENDPOINTS.ADMIN_VERIFICATION,
  );

  return unwrapResponse(raw);
}

export async function approveWorkerVerification(workerId: string): Promise<{ data: WorkerProfile; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: WorkerProfile; message: string }> | { data: WorkerProfile; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_APPROVE_WORKER(workerId),
    {},
  );

  return unwrapResponse(raw);
}

export async function rejectWorkerVerification(
  workerId: string,
  reason: string = 'Verification rejected',
): Promise<{ data: WorkerProfile; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: WorkerProfile; message: string }> | { data: WorkerProfile; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_REJECT_WORKER(workerId),
    { reason },
  );

  return unwrapResponse(raw);
}

export async function getComplaints(
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<{ data: Complaint[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
  });

  const raw = await apiClient.get<
    WrappedResponse<{ data: Complaint[]; meta: { total: number; page: number; limit: number; totalPages: number } }> |
    { data: Complaint[]; meta: { total: number; page: number; limit: number; totalPages: number } }
  >(`${API_CONFIG.ENDPOINTS.ADMIN_COMPLAINTS}?${params.toString()}`);

  return unwrapResponse(raw);
}

export async function getAdminJobs(
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
): Promise<{ data: AdminJob[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(search && { search }),
  });

  const raw = await apiClient.get<
    WrappedResponse<{ data: AdminJob[]; meta: { total: number; page: number; limit: number; totalPages: number } }> |
    { data: AdminJob[]; meta: { total: number; page: number; limit: number; totalPages: number } }
  >(`${API_CONFIG.ENDPOINTS.ADMIN_JOBS}?${params.toString()}`);

  return unwrapResponse(raw);
}

export async function getAdminJobById(jobId: string): Promise<{ data: AdminJobDetail }> {
  const raw = await apiClient.get<WrappedResponse<{ data: AdminJobDetail }> | { data: AdminJobDetail }>(
    API_CONFIG.ENDPOINTS.ADMIN_JOB_DETAIL(jobId),
  );

  return unwrapResponse(raw);
}

export async function resolveComplaint(complaintId: string): Promise<{ data: Complaint; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: Complaint; message: string }> | { data: Complaint; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_RESOLVE_COMPLAINT(complaintId),
    {},
  );

  return unwrapResponse(raw);
}

export async function assignComplaint(
  complaintId: string,
  adminId: string,
): Promise<{ data: Complaint; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: Complaint; message: string }> | { data: Complaint; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_ASSIGN_COMPLAINT(complaintId),
    { adminId },
  );

  return unwrapResponse(raw);
}

export async function getReviews(
  page: number = 1,
  limit: number = 10,
  filter?: string,
  minRating?: number,
): Promise<{ data: Review[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filter && { filter }),
    ...(minRating && { minRating: minRating.toString() }),
  });

  const raw = await apiClient.get<
    WrappedResponse<{ data: Review[]; meta: { total: number; page: number; limit: number; totalPages: number } }> |
    { data: Review[]; meta: { total: number; page: number; limit: number; totalPages: number } }
  >(`${API_CONFIG.ENDPOINTS.ADMIN_REVIEWS}?${params.toString()}`);

  return unwrapResponse(raw);
}

export async function hideReview(reviewId: string): Promise<{ message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ message: string }> | { message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_HIDE_REVIEW(reviewId),
    {},
  );

  return unwrapResponse(raw);
}

export async function getAllServices(): Promise<{ data: ServiceCategory[]; total: number }> {
  const raw = await apiClient.get<WrappedResponse<{ data: ServiceCategory[]; total: number }> | { data: ServiceCategory[]; total: number }>(
    API_CONFIG.ENDPOINTS.ADMIN_SERVICES,
  );

  return unwrapResponse(raw);
}

export async function createService(
  name: string,
  iconUrl?: string,
): Promise<{ data: ServiceCategory; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: ServiceCategory; message: string }> | { data: ServiceCategory; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_SERVICES,
    { name, iconUrl },
  );

  return unwrapResponse(raw);
}

export async function updateService(
  id: number,
  updateData: { name?: string; iconUrl?: string; isActive?: boolean },
): Promise<{ data: ServiceCategory; message: string }> {
  const raw = await apiClient.put<WrappedResponse<{ data: ServiceCategory; message: string }> | { data: ServiceCategory; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_UPDATE_SERVICE(id),
    updateData,
  );

  return unwrapResponse(raw);
}

export async function deactivateService(id: number): Promise<{ data: ServiceCategory; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: ServiceCategory; message: string }> | { data: ServiceCategory; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_DEACTIVATE_SERVICE(id),
    {},
  );

  return unwrapResponse(raw);
}

export async function activateService(id: number): Promise<{ data: ServiceCategory; message: string }> {
  const raw = await apiClient.post<WrappedResponse<{ data: ServiceCategory; message: string }> | { data: ServiceCategory; message: string }>(
    API_CONFIG.ENDPOINTS.ADMIN_ACTIVATE_SERVICE(id),
    {},
  );

  return unwrapResponse(raw);
}

export async function getRevenueStats(): Promise<{ data: RevenueStats }> {
  const raw = await apiClient.get<WrappedResponse<{ data: RevenueStats }> | { data: RevenueStats }>(
    API_CONFIG.ENDPOINTS.ADMIN_REVENUE,
  );

  return unwrapResponse(raw);
}

export async function getAnalytics(): Promise<{ data: AnalyticsData }> {
  const raw = await apiClient.get<WrappedResponse<{ data: AnalyticsData }> | { data: AnalyticsData }>(
    API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS,
  );

  return unwrapResponse(raw);
}

export default {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getAllWorkers,
  getPendingVerifications,
  approveWorkerVerification,
  rejectWorkerVerification,
  getAdminJobs,
  getAdminJobById,
  getComplaints,
  resolveComplaint,
  assignComplaint,
  getReviews,
  hideReview,
  getAllServices,
  createService,
  updateService,
  deactivateService,
  activateService,
  getRevenueStats,
  getAnalytics,
};
