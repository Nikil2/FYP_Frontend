/**
 * Notifications API Service
 * REST endpoints for notification management (real-time via Socket.IO)
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(
  skip: number = 0,
  take: number = 20
): Promise<{ data: Notification[]; total: number }> {
  return apiClient.get<{ data: Notification[]; total: number }>(
    `${API_CONFIG.ENDPOINTS.NOTIFICATIONS}?skip=${skip}&take=${take}`
  );
}

export async function getUnreadCount(): Promise<{ unreadCount: number }> {
  return apiClient.get<{ unreadCount: number }>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_UNREAD);
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  return apiClient.put<Notification>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_READ(notificationId), {});
}

export async function markAllAsRead(): Promise<{ message: string }> {
  return apiClient.put<{ message: string }>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_READ_ALL, {});
}

export async function deleteNotification(notificationId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_DELETE(notificationId));
}

export async function deleteAllNotifications(): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_DELETE_ALL);
}

export async function updateFcmToken(fcmToken: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.NOTIFICATIONS_FCM_TOKEN, { fcmToken });
}

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  updateFcmToken,
};
