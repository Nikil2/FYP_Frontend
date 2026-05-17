/**
 * Feedback API Service
 * Handles review submission and worker rating retrieval
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface SubmitFeedbackData {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface FeedbackItem {
  id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
  user: { id: string; fullName: string; profilePicUrl?: string };
  booking: { id: string; description: string; service: { name: string } };
  createdAt: string;
}

export interface WorkerRatingStats {
  workerId: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
}

export async function submitFeedback(data: SubmitFeedbackData): Promise<FeedbackItem> {
  return apiClient.post<FeedbackItem>(API_CONFIG.ENDPOINTS.FEEDBACK_SUBMIT, data);
}

export async function getWorkerReviews(
  workerId: string,
  skip: number = 0,
  take: number = 10
): Promise<{ data: FeedbackItem[]; total: number }> {
  return apiClient.get<{ data: FeedbackItem[]; total: number }>(
    `${API_CONFIG.ENDPOINTS.FEEDBACK_WORKER(workerId)}?skip=${skip}&take=${take}`
  );
}

export async function getWorkerStats(workerId: string): Promise<WorkerRatingStats> {
  return apiClient.get<WorkerRatingStats>(API_CONFIG.ENDPOINTS.FEEDBACK_WORKER_STATS(workerId));
}

export async function getBookingFeedback(bookingId: string): Promise<FeedbackItem> {
  return apiClient.get<FeedbackItem>(API_CONFIG.ENDPOINTS.FEEDBACK_BOOKING(bookingId));
}

export default {
  submitFeedback,
  getWorkerReviews,
  getWorkerStats,
  getBookingFeedback,
};
