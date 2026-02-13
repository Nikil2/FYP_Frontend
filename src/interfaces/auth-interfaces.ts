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

// Sub-service inside a main service
export interface SubService {
  id: string;
  name: string;
  nameUrdu: string;
}

// Main service category with sub-services
export interface ServiceCategory {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string;
  subServices: SubService[];
}

// A service the worker selected with chosen sub-services
export interface SelectedServiceEntry {
  serviceId: string;
  serviceName: string;
  subServiceIds: string[];
}

export interface WorkerSignupFormData {
  // Step 1: Basic Info
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;

  // Step 2: OTP
  otpCode: string;

  // Step 3: Services
  selectedServices: SelectedServiceEntry[];

  // Step 4: Location
  homeAddress: string;
  homeLat: number;
  homeLng: number;

  // Step 5: Experience
  experienceYears: number;
  visitingCharges: number;
  bio: string;

  // Step 6: Previous Work Photos (min 2)
  workPhotos: File[];

  // Step 7: Selfie Verification
  selfieImage: File | null;

  // Step 8: CNIC Identity
  cnicNumber: string;
  cnicFrontImage: File | null;
  cnicBackImage: File | null;
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
