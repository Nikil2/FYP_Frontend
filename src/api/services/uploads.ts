/**
 * File Uploads API Service
 * Handles file uploads to Cloudinary via backend
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface UploadResult {
  url: string;
  publicId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: string;
}

export async function uploadProfilePicture(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.upload<UploadResult>(API_CONFIG.ENDPOINTS.UPLOADS_PROFILE_PICTURE, formData);
}

export async function uploadCnic(file: File, side: 'front' | 'back'): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('side', side);
  return apiClient.upload<UploadResult>(API_CONFIG.ENDPOINTS.UPLOADS_CNIC, formData);
}

export async function uploadPortfolio(file: File, workerId: string, description?: string): Promise<UploadResult & { portfolioId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('workerId', workerId);
  if (description) formData.append('description', description);
  return apiClient.upload<UploadResult & { portfolioId: string }>(API_CONFIG.ENDPOINTS.UPLOADS_PORTFOLIO, formData);
}

export async function uploadEvidence(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.upload<UploadResult>(API_CONFIG.ENDPOINTS.UPLOADS_EVIDENCE, formData);
}

export default {
  uploadProfilePicture,
  uploadCnic,
  uploadPortfolio,
  uploadEvidence,
};
