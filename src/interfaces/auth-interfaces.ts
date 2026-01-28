// ============================================
// AUTH ENUMS
// ============================================

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  WORKER = "WORKER",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ============================================
// USER INTERFACES
// ============================================

export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  profilePicUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  cnicNumber: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  bio?: string;
  experienceYears: number;
  visitingCharges: number;
  homeAddress: string;
  homeLat: number;
  homeLng: number;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalJobsCompleted: number;
}

// ============================================
// AUTH FORM INTERFACES
// ============================================

export interface LoginFormData {
  phoneNumber: string;
  password: string;
}

export interface CustomerSignupFormData {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  profilePicture?: File;
}

export interface WorkerSignupFormData {
  // Personal Info
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  profilePicture?: File;

  // Worker Specific
  cnicNumber: string;
  cnicFrontImage: File | null;
  cnicBackImage: File | null;
  bio: string;
  experienceYears: number;
  visitingCharges: number;

  // Location
  homeAddress: string;
  homeLat: number;
  homeLng: number;

  // Services
  selectedServices: number[];
}

// ============================================
// AUTH RESPONSE INTERFACES
// ============================================

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    workerProfile?: WorkerProfile;
    token: string;
  };
  error?: string;
}

export interface AuthError {
  field?: string;
  message: string;
}
