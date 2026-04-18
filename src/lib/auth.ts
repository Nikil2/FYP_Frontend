import { AuthResponse, LoginFormData, CustomerSignupFormData, WorkerSignupFormData, UserRole } from "@/interfaces/auth-interfaces";
import { findWorkerByCredentials, setCurrentWorkerId, clearCurrentWorkerId } from "@/app/dummy/dummy-workers";
import { findCustomerByCredentials, setCurrentCustomerId, clearCurrentCustomerId } from "@/app/dummy/dummy-customers";

// ============================================
// API BASE URL
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ============================================
// AUTH API CALLS
// ============================================

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: data.phoneNumber,
        password: data.password,
      }),
    });

    const result = await response.json();

    // Debug: Log the actual response
    console.log('Login response:', result);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Check if response is successful (200 OK)
    if (response.ok) {
      // Backend returns user object directly, not wrapped in data
      // Check if we got user data with role
      if (result.id && result.role) {
        // Generate a token-like identifier from user data
        const token = `token-${result.id}-${Date.now()}`;
        
        setAuthToken(token);
        setUserRole(result.role);
        
        console.log('Login successful, user role:', result.role);
        
        return {
          success: true,
          message: "Login successful",
          data: {
            accessToken: token,
            token: token,
            user: result,
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
    console.error('Login error:', error);
    return {
      success: false,
      message: "Network error. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const signupCustomer = async (data: CustomerSignupFormData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (response.ok && result.data?.accessToken) {
      setAuthToken(result.data.accessToken);
      return {
        success: true,
        message: "Signup successful",
        data: result.data,
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
      data.workPhotos.forEach((photo, index) => {
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
