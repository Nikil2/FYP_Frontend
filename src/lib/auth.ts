import { AuthResponse, LoginFormData, CustomerSignupFormData, WorkerSignupFormData } from "@/interfaces/auth-interfaces";

// ============================================
// API BASE URL
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const signupCustomer = async (data: CustomerSignupFormData): Promise<AuthResponse> => {
  try {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);
    formData.append("role", "CUSTOMER");

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }

    const response = await fetch(`${API_BASE_URL}/auth/signup/customer`, {
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

export const signupWorker = async (data: WorkerSignupFormData): Promise<AuthResponse> => {
  try {
    const formData = new FormData();
    
    // User fields
    formData.append("fullName", data.fullName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);
    formData.append("role", "WORKER");

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }

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
    formData.append("selectedServices", JSON.stringify(data.selectedServices));

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

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" };
  }
  return { valid: true };
};
