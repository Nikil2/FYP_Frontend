/**
 * Complaints API Service
 * Handles filing and viewing complaints
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface FileComplaintData {
  bookingId: string;
  description: string;
  evidenceUrls?: string[];
}

export interface Complaint {
  id: string;
  bookingId: string;
  description: string;
  evidenceUrls: string[];
  isResolved: boolean;
  adminId?: string;
  booking: {
    id: string;
    customer: { fullName: string };
    worker: { user: { fullName: string } };
    service: { name: string };
    status: string;
  };
  createdAt: string;
}

export async function fileComplaint(data: FileComplaintData): Promise<Complaint> {
  return apiClient.post<Complaint>(API_CONFIG.ENDPOINTS.COMPLAINTS_FILE, data);
}

export async function getBookingComplaints(bookingId: string): Promise<Complaint[]> {
  return apiClient.get<Complaint[]>(API_CONFIG.ENDPOINTS.COMPLAINTS_BOOKING(bookingId));
}

export async function getComplaintById(complaintId: string): Promise<Complaint> {
  return apiClient.get<Complaint>(API_CONFIG.ENDPOINTS.COMPLAINTS_DETAIL(complaintId));
}

export default {
  fileComplaint,
  getBookingComplaints,
  getComplaintById,
};
