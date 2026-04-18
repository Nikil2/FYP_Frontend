/**
 * Users API Functions
 * Handles customer registration, login, and profile management
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';
import {
  ApiResponse,
  User,
  AuthTokens,
  CustomerRegistrationData,
} from '../types';

// ============================================
// CUSTOMER AUTHENTICATION
// ============================================

/**
 * Register a new customer
 * @param userData - Customer registration data
 * @returns Registered customer with tokens
 */
export async function registerCustomer(userData: CustomerRegistrationData): Promise<AuthTokens> {
  try {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      API_CONFIG.ENDPOINTS.USERS_REGISTER,
      userData
    );

    if (!response.data) {
      throw new Error('Failed to register customer');
    }

    // Store tokens if needed
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
}

/**
 * Login customer
 * @param credentials - Phone number and password
 * @returns Authentication tokens
 */
export async function loginCustomer(credentials: {
  phoneNumber: string;
  password: string;
}): Promise<AuthTokens> {
  try {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      API_CONFIG.ENDPOINTS.USERS_LOGIN,
      credentials
    );

    if (!response.data) {
      throw new Error('Login failed');
    }

    // Store tokens if needed
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  } catch (error) {
    console.error('Error logging in customer:', error);
    throw error;
  }
}

// ============================================
// CUSTOMER PROFILE MANAGEMENT
// ============================================

/**
 * Get customer details by ID
 * @param userId - Customer UUID
 * @returns Customer profile
 */
export async function getCustomerDetails(userId: string): Promise<User> {
  try {
    const response = await apiClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS_DETAIL(userId)
    );

    if (!response.data) {
      throw new Error('Customer not found');
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${userId}:`, error);
    throw error;
  }
}

/**
 * Get all customers (paginated)
 * @param limit - Number of records to return
 * @param offset - Number of records to skip
 * @returns Paginated customers list
 */
export async function getAllCustomers(
  limit: number = 10,
  offset: number = 0
): Promise<{ data: User[]; total: number }> {
  try {
    const response = await apiClient.get<
      ApiResponse<{ data: User[]; total: number }>
    >(`${API_CONFIG.ENDPOINTS.USERS_GET_ALL}?limit=${limit}&offset=${offset}`);

    if (!response.data) {
      throw new Error('Failed to fetch customers');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

/**
 * Update customer profile
 * @param userId - Customer UUID
 * @param updateData - Profile data to update
 * @returns Updated customer profile
 */
export async function updateCustomerProfile(
  userId: string,
  updateData: Partial<User>
): Promise<User> {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS_UPDATE(userId),
      updateData
    );

    if (!response.data) {
      throw new Error('Failed to update customer profile');
    }

    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${userId}:`, error);
    throw error;
  }
}

// ============================================
// ADMIN OPERATIONS
// ============================================

/**
 * Verify customer (Admin only)
 * @param userId - Customer UUID
 * @returns Updated customer
 */
export async function verifyCustomer(userId: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS_VERIFY(userId),
      {}
    );

    if (!response.data) {
      throw new Error('Failed to verify customer');
    }

    return response.data;
  } catch (error) {
    console.error(`Error verifying customer ${userId}:`, error);
    throw error;
  }
}

/**
 * Block customer (Admin only)
 * @param userId - Customer UUID
 * @returns Updated customer
 */
export async function blockCustomer(userId: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS_BLOCK(userId),
      {}
    );

    if (!response.data) {
      throw new Error('Failed to block customer');
    }

    return response.data;
  } catch (error) {
    console.error(`Error blocking customer ${userId}:`, error);
    throw error;
  }
}

/**
 * Unblock customer (Admin only)
 * @param userId - Customer UUID
 * @returns Updated customer
 */
export async function unblockCustomer(userId: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS_UNBLOCK(userId),
      {}
    );

    if (!response.data) {
      throw new Error('Failed to unblock customer');
    }

    return response.data;
  } catch (error) {
    console.error(`Error unblocking customer ${userId}:`, error);
    throw error;
  }
}

/**
 * Delete customer (Admin only)
 * @param userId - Customer UUID
 * @returns Deletion confirmation
 */
export async function deleteCustomer(userId: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      API_CONFIG.ENDPOINTS.USERS_DELETE(userId)
    );

    if (!response.data) {
      throw new Error('Failed to delete customer');
    }

    return response.data;
  } catch (error) {
    console.error(`Error deleting customer ${userId}:`, error);
    throw error;
  }
}

export default {
  registerCustomer,
  loginCustomer,
  getCustomerDetails,
  getAllCustomers,
  updateCustomerProfile,
  verifyCustomer,
  blockCustomer,
  unblockCustomer,
  deleteCustomer,
};
