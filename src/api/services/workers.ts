/**
 * Workers API Functions
 * Handles worker registration and portfolio management
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';
import {
  ApiResponse,
  Worker,
  WorkerRegistrationData,
  WorkerRegistrationResponse,
  PortfolioImage,
  PortfolioImageInput,
  PortfolioUpdateData,
  PortfolioDeleteResponse,
} from '../types';

function normalizePhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');

  if (digits.startsWith('92') && digits.length === 12) {
    return `+92${digits.slice(2)}`;
  }

  if (digits.startsWith('0') && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  }

  if (digits.length === 10 && digits.startsWith('3')) {
    return `+92${digits}`;
  }

  return phoneNumber.trim();
}

function extractPayload<T>(response: ApiResponse<T> | T): T {
  // Some backend routes return wrapped responses ({ data: ... }) while others return raw payloads.
  if (response && typeof response === 'object' && 'data' in (response as Record<string, unknown>)) {
    const wrapped = response as ApiResponse<T>;
    if (typeof wrapped.data !== 'undefined') {
      return wrapped.data;
    }
  }

  return response as T;
}

type WorkerWithOptionalUserId = Worker & { userId?: string };

// ============================================
// WORKER REGISTRATION
// ============================================

/**
 * Register a new worker
 * @param workerData - Worker registration data
 * @returns Registered worker with profile
 */
export async function registerWorker(
  workerData: WorkerRegistrationData
): Promise<WorkerRegistrationResponse> {
  try {
    // Validate required fields
    if (
      !workerData.fullName ||
      !workerData.phoneNumber ||
      !workerData.password ||
      !workerData.cnicNumber ||
      !workerData.cnicFrontUrl ||
      !workerData.cnicBackUrl ||
      !workerData.homeAddress ||
      !workerData.homeLat ||
      !workerData.homeLng ||
      workerData.experienceYears < 0 ||
      workerData.visitingCharges < 0 ||
      !workerData.serviceIds.length
    ) {
      throw new Error('Missing required fields');
    }

    // Validate password length
    if (workerData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Make API call
    const response = await apiClient.post<
      ApiResponse<WorkerRegistrationResponse> | WorkerRegistrationResponse
    >(
      API_CONFIG.ENDPOINTS.WORKERS_REGISTER,
      {
        ...workerData,
        phoneNumber: normalizePhoneNumber(workerData.phoneNumber),
        cnicNumber: workerData.cnicNumber.replace(/\D/g, ''),
      }
    );

    const worker = extractPayload(response);

    if (!worker) {
      throw new Error('Failed to register worker');
    }

    return worker;
  } catch (error) {
    console.error('Error registering worker:', error);
    throw error;
  }
}

/**
 * Get all workers (paginated)
 * @param skip - Number of records to skip
 * @param take - Number of records to return
 * @returns Array of workers
 */
export async function getAllWorkers(
  skip: number = 0,
  take: number = 10
): Promise<Worker[]> {
  try {
    const response = await apiClient.get<ApiResponse<Worker[]> | Worker[]>(
      `${API_CONFIG.ENDPOINTS.WORKERS_GET_ALL}?skip=${skip}&take=${take}`
    );

    return extractPayload(response) || [];
  } catch (error) {
    console.error('Error fetching all workers:', error);
    throw error;
  }
}

/**
 * Get verified workers only (paginated)
 * @param skip - Number of records to skip
 * @param take - Number of records to return
 * @returns Array of verified workers
 */
export async function getVerifiedWorkers(
  skip: number = 0,
  take: number = 10
): Promise<Worker[]> {
  try {
    const response = await apiClient.get<ApiResponse<Worker[]> | Worker[]>(
      `${API_CONFIG.ENDPOINTS.WORKERS_GET_VERIFIED}?skip=${skip}&take=${take}`
    );

    return extractPayload(response) || [];
  } catch (error) {
    console.error('Error fetching verified workers:', error);
    throw error;
  }
}

/**
 * Get worker details by ID
 * @param workerId - Worker UUID
 * @returns Worker profile
 */
export async function getWorkerDetails(workerId: string): Promise<Worker> {
  try {
    const response = await apiClient.get<ApiResponse<Worker> | Worker>(
      API_CONFIG.ENDPOINTS.WORKERS_DETAIL(workerId)
    );

    const worker = extractPayload(response);

    if (!worker) {
      throw new Error('Worker not found');
    }

    return worker;
  } catch (error) {
    console.error(`Error fetching worker ${workerId}:`, error);
    throw error;
  }
}

/**
 * Get worker details by user ID
 * @param userId - User UUID
 * @returns Worker profile
 */
export async function getWorkerByUserId(userId: string): Promise<Worker> {
  try {
    const response = await apiClient.get<ApiResponse<Worker> | Worker>(
      API_CONFIG.ENDPOINTS.WORKERS_BY_USER(userId)
    );

    const worker = extractPayload(response);

    if (!worker) {
      throw new Error('Worker not found');
    }

    return worker;
  } catch (error) {
    // Fallback for environments where /workers/user/:userId route is not available yet.
    try {
      const listResponse = await apiClient.get<ApiResponse<Worker[]> | Worker[]>(
        `${API_CONFIG.ENDPOINTS.WORKERS_GET_ALL}?skip=0&take=200`
      );
      const workers = (extractPayload(listResponse) || []) as WorkerWithOptionalUserId[];
      const matched = workers.find(
        (w) => w.id === userId || w.userId === userId
      );

      if (matched) {
        return matched as Worker;
      }
    } catch (fallbackError) {
      console.error(`Fallback lookup failed for user ${userId}:`, fallbackError);
    }

    console.error(`Error fetching worker by user ${userId}:`, error);
    throw error;
  }
}

/**
 * Update worker profile
 * @param workerId - Worker UUID
 * @param updateData - Profile data to update
 * @returns Updated worker profile
 */
export async function updateWorkerProfile(
  workerId: string,
  updateData: Partial<Worker>
): Promise<Worker> {
  try {
    const response = await apiClient.put<ApiResponse<Worker> | Worker>(
      API_CONFIG.ENDPOINTS.WORKERS_UPDATE(workerId),
      updateData
    );

    const worker = extractPayload(response);

    if (!worker) {
      throw new Error('Failed to update worker profile');
    }

    return worker;
  } catch (error) {
    console.error(`Error updating worker ${workerId}:`, error);
    throw error;
  }
}

// ============================================
// PORTFOLIO MANAGEMENT
// ============================================

/**
 * Add a new portfolio image
 * @param workerId - Worker UUID
 * @param portfolioData - Portfolio image data
 * @returns Created portfolio image
 */
export async function addPortfolioImage(
  workerId: string,
  portfolioData: PortfolioImageInput
): Promise<PortfolioImage> {
  try {
    if (!portfolioData.imageUrl) {
      throw new Error('Image URL is required');
    }

    const response = await apiClient.post<
      ApiResponse<PortfolioImage> | PortfolioImage
    >(
      API_CONFIG.ENDPOINTS.WORKERS_PORTFOLIO(workerId),
      portfolioData
    );

    const portfolioImage = extractPayload(response);

    if (!portfolioImage) {
      throw new Error('Failed to add portfolio image');
    }

    return portfolioImage;
  } catch (error) {
    console.error(`Error adding portfolio image for worker ${workerId}:`, error);
    throw error;
  }
}

/**
 * Get all portfolio images for a worker
 * @param workerId - Worker UUID
 * @returns Array of portfolio images
 */
export async function getPortfolioImages(
  workerId: string
): Promise<PortfolioImage[]> {
  try {
    const response = await apiClient.get<
      ApiResponse<PortfolioImage[]> | PortfolioImage[]
    >(
      API_CONFIG.ENDPOINTS.WORKERS_PORTFOLIO(workerId)
    );

    return extractPayload(response) || [];
  } catch (error) {
    console.error(
      `Error fetching portfolio images for worker ${workerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Update portfolio image description
 * @param workerId - Worker UUID
 * @param portfolioId - Portfolio image UUID
 * @param updateData - Updated data
 * @returns Updated portfolio image
 */
export async function updatePortfolioImage(
  workerId: string,
  portfolioId: string,
  updateData: PortfolioUpdateData
): Promise<PortfolioImage> {
  try {
    if (!updateData.description) {
      throw new Error('Description is required');
    }

    const response = await apiClient.put<
      ApiResponse<PortfolioImage> | PortfolioImage
    >(
      API_CONFIG.ENDPOINTS.WORKERS_PORTFOLIO_ITEM(workerId, portfolioId),
      updateData
    );

    const portfolioImage = extractPayload(response);

    if (!portfolioImage) {
      throw new Error('Failed to update portfolio image');
    }

    return portfolioImage;
  } catch (error) {
    console.error(
      `Error updating portfolio image ${portfolioId} for worker ${workerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Delete a portfolio image
 * @param workerId - Worker UUID
 * @param portfolioId - Portfolio image UUID
 * @returns Delete confirmation
 */
export async function deletePortfolioImage(
  workerId: string,
  portfolioId: string
): Promise<PortfolioDeleteResponse> {
  try {
    const response = await apiClient.delete<
      ApiResponse<PortfolioDeleteResponse> | PortfolioDeleteResponse
    >(
      API_CONFIG.ENDPOINTS.WORKERS_PORTFOLIO_ITEM(workerId, portfolioId)
    );

    const deleteResult = extractPayload(response);

    if (!deleteResult) {
      throw new Error('Failed to delete portfolio image');
    }

    return deleteResult;
  } catch (error) {
    console.error(
      `Error deleting portfolio image ${portfolioId} for worker ${workerId}:`,
      error
    );
    throw error;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Prepare worker registration data with validation
 * @param formData - Raw form data
 * @returns Validated worker registration data
 */
export function prepareWorkerRegistrationData(
  formData: Record<string, unknown>
): WorkerRegistrationData {
  return {
    fullName: String(formData.fullName || '').trim(),
    phoneNumber: String(formData.phoneNumber || '').trim(),
    password: String(formData.password || ''),
    cnicNumber: String(formData.cnicNumber || '').replace(/\D/g, ''),
    cnicFrontUrl: String(formData.cnicFrontUrl || '').trim(),
    cnicBackUrl: String(formData.cnicBackUrl || '').trim(),
    homeAddress: String(formData.homeAddress || '').trim(),
    homeLat: formData.homeLat ? parseFloat(String(formData.homeLat)) : 0,
    homeLng: formData.homeLng ? parseFloat(String(formData.homeLng)) : 0,
    experienceYears: formData.experienceYears
      ? parseFloat(String(formData.experienceYears))
      : 0,
    visitingCharges: formData.visitingCharges
      ? parseFloat(String(formData.visitingCharges))
      : 0,
    serviceIds: Array.isArray(formData.serviceIds)
      ? (formData.serviceIds as number[])
      : [],
    portfolioImages: Array.isArray(formData.portfolioImages)
      ? (formData.portfolioImages as PortfolioImageInput[])
      : undefined,
  };
}

/**
 * Build FormData for file upload
 * @param files - Files to upload
 * @param fieldName - Field name in form
 * @returns FormData object
 */
export function buildFormData(
  files: File[],
  fieldName: string = 'files'
): FormData {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });
  return formData;
}

export default {
  registerWorker,
  getAllWorkers,
  getVerifiedWorkers,
  getWorkerDetails,
  getWorkerByUserId,
  updateWorkerProfile,
  addPortfolioImage,
  getPortfolioImages,
  updatePortfolioImage,
  deletePortfolioImage,
  prepareWorkerRegistrationData,
  buildFormData,
};
