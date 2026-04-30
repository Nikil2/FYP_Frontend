import { AuthResponse, LoginFormData, CustomerSignupFormData, WorkerSignupFormData, User } from "@/interfaces/auth-interfaces";
import { findWorkerByCredentials, setCurrentWorkerId, clearCurrentWorkerId } from "@/app/dummy/dummy-workers";
import { findCustomerByCredentials, setCurrentCustomerId, clearCurrentCustomerId } from "@/app/dummy/dummy-customers";

// ============================================
// API BASE URL
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const AUTH_USER_KEY = "authUser";
const PK_COUNTRY_CODE = "+92";

const isUserLike = (value: unknown): value is User => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.role === "string";
};

const extractUserPayload = (payload: unknown): User | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const parsed = payload as Record<string, unknown>;

  // 1) Direct user object
  if (isUserLike(parsed)) {
    return parsed;
  }

  // 2) Nest interceptor wrapper: { data: <something>, statusCode, ... }
  if (parsed.data && typeof parsed.data === "object") {
    const nested = parsed.data as Record<string, unknown>;

    // 2a) data is user object
    if (isUserLike(nested)) {
      return nested;
    }

    // 2b) data contains user object: { data: { user: ... } } or { user: ... }
    if (isUserLike(nested.user)) {
      return nested.user;
    }
  }

  // 3) Fallback shape: { user: ... }
  if (isUserLike(parsed.user)) {
    return parsed.user;
  }

  return null;
};

const extractTokenPayload = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const parsed = payload as Record<string, unknown>;

  if (typeof parsed.token === "string" && parsed.token) {
    return parsed.token;
  }

  if (parsed.data && typeof parsed.data === "object") {
    const nested = parsed.data as Record<string, unknown>;
    if (typeof nested.token === "string" && nested.token) {
      return nested.token;
    }
  }

  return null;
};

const normalizePhoneNumber = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.startsWith("92") && digits.length === 12) {
    return `${PK_COUNTRY_CODE}${digits.slice(2)}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `${PK_COUNTRY_CODE}${digits.slice(1)}`;
  }

  if (digits.length === 10 && digits.startsWith("3")) {
    return `${PK_COUNTRY_CODE}${digits}`;
  }

  return phoneNumber.trim();
};

// ============================================
// USER ROLE MANAGEMENT
// ============================================

export const setUserRole = (role: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userRole", role);
  }
};

export const getUserRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRole");
  }
  return null;
};

export const clearUserRole = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userRole");
  }
};

// ============================================
// AUTH TOKEN MANAGEMENT
// ============================================

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

export const setAuthUser = (user: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const getAuthUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ============================================
// AUTH API CALLS
// ============================================

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: normalizedPhoneNumber,
        password: data.password,
      }),
    });

    const result = await response.json();

    // Check if response is successful (200 OK)
    if (response.ok) {
      const user = extractUserPayload(result);
      const token = extractTokenPayload(result);
      if (user?.id && user?.role) {
        if (!token) {
          return {
            success: false,
            message: "Login failed - Missing auth token from server",
          };
        }

        setAuthToken(token);
        setUserRole(user.role);
        setAuthUser(user);

        // Persist current dummy IDs when matching demo credentials,
        // so dashboards retain profile data across navigation/refresh.
        if (user.role === "WORKER") {
          const worker = findWorkerByCredentials(normalizedPhoneNumber, data.password);
          if (worker) {
            setCurrentWorkerId(worker.id);
          }
        }

        if (user.role === "CUSTOMER") {
          const customer = findCustomerByCredentials(normalizedPhoneNumber, data.password);
          if (customer) {
            setCurrentCustomerId(customer.id);
          }
        }
        
        return {
          success: true,
          message: "Login successful",
          data: {
            accessToken: token,
            token: token,
            user,
          },
        };
      }
    }

    // If we reach here, login failed
    return {
      success: false,
      message: result.message || "Login failed - Invalid response from server",
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const signupCustomer = async (data: CustomerSignupFormData): Promise<AuthResponse> => {
  try {
    const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);

    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: data.fullName,
        phoneNumber: normalizedPhoneNumber,
        password: data.password,
      }),
    });

    const result = await response.json();

    const user = extractUserPayload(result);
    const token = extractTokenPayload(result);
    if (response.ok && user?.id && user?.role) {
      if (!token) {
        return {
          success: false,
          message: "Signup failed - Missing auth token from server",
        };
      }

      setAuthToken(token);
      setUserRole(user.role);
      setAuthUser(user);

      if (user.role === "CUSTOMER") {
        const customer = findCustomerByCredentials(normalizedPhoneNumber, data.password);
        if (customer) {
          setCurrentCustomerId(customer.id);
        }
      }

      return {
        success: true,
        message: "Signup successful",
        data: {
          accessToken: token,
          token,
          user,
        },
      };
    }

    return {
      success: false,
      message: result.message || "Signup failed",
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const signupWorker = async (data: WorkerSignupFormData): Promise<AuthResponse> => {
  try {
    const formData = new FormData();
    
    // User fields
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);
    formData.append("role", "WORKER");

    // Worker profile fields
    formData.append("cnicNumber", data.cnicNumber);
    if (data.cnicFrontImage) {
      formData.append("cnicFrontImage", data.cnicFrontImage);
    }
    if (data.cnicBackImage) {
      formData.append("cnicBackImage", data.cnicBackImage);
    }
    formData.append("bio", data.bio);
    formData.append("experienceYears", data.experienceYears.toString());
    formData.append("visitingCharges", data.visitingCharges.toString());
    formData.append("homeAddress", data.homeAddress);
    formData.append("homeLat", data.homeLat.toString());
    formData.append("homeLng", data.homeLng.toString());
    formData.append("selectedServiceIds", JSON.stringify(data.selectedServiceIds));

    // Selfie
    if (data.selfieImage) {
      formData.append("selfieImage", data.selfieImage);
    }

    // Work photos
    if (data.workPhotos && data.workPhotos.length > 0) {
      data.workPhotos.forEach((photo) => {
        formData.append(`workPhotos`, photo);
      });
    }

    const response = await fetch(`${API_BASE_URL}/auth/signup/worker`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.data?.token) {
      setAuthToken(result.data.token);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const logout = () => {
  removeAuthToken();
  clearUserRole();
  clearAuthUser();
  clearCurrentWorkerId();
  clearCurrentCustomerId();
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};

// ============================================
// VALIDATION HELPERS
// ============================================

export const validatePhoneNumber = (phone: string): boolean => {
  // Pakistani phone number validation (03XX-XXXXXXX format)
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ""));
};

export const validateCNIC = (cnic: string): boolean => {
  // Pakistani CNIC format: XXXXX-XXXXXXX-X
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
  return cnicRegex.test(cnic);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" };
  }
  return { valid: true };
};
