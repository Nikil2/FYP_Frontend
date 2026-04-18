/**
 * TypeScript Types & Interfaces
 * All API request/response types
 */

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: unknown;
}

// ============================================
// SERVICES
// ============================================

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceCategory {
  [key: string]: Service[];
}

// ============================================
// WORKER TYPES
// ============================================

export interface PortfolioImage {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface WorkerService {
  id: number;
  name: string;
  category: string;
  icon: string;
}

export interface WorkerProfile {
  id: string;
  profilePicture: string | null;
  bio: string | null;
  rating: number;
  totalBookings: number;
  isOnline: boolean;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  services: WorkerService[];
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cnicNumber: string;
  address: string;
  role: 'WORKER';
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  hourlyRate?: number;
  workerProfile: WorkerProfile;
  portfolio: PortfolioImage[];
  createdAt: string;
}

// ============================================
// WORKER REGISTRATION REQUEST
// ============================================

export interface PortfolioImageInput {
  imageUrl: string;
  description?: string;
}

export interface WorkerRegistrationData {
  fullName: string;
  phoneNumber: string;
  password: string;
  cnicNumber: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  selfieUrl?: string;
  workPhotosUrls?: string[];
  homeAddress: string;
  homeLat: number;
  homeLng: number;
  experienceYears: number;
  visitingCharges: number;
  serviceIds: number[];
  portfolioImages?: PortfolioImageInput[];
}

export interface WorkerRegistrationResponse extends Worker {
  message?: string;
}

// ============================================
// CUSTOMER REGISTRATION REQUEST
// ============================================

export interface CustomerRegistrationData {
  fullName: string;
  phoneNumber: string;
  password: string;
}

// ============================================
// PORTFOLIO REQUEST/RESPONSE
// ============================================

export interface PortfolioUpdateData {
  description: string;
}

export interface PortfolioDeleteResponse {
  id: string;
  message: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'WORKER' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// ERROR HANDLING
// ============================================

export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// ============================================
// HELPER TYPES
// ============================================

export type RequestInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
};
