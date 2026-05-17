/**
 * Messages API Service
 * REST endpoints for message history (real-time via Socket.IO)
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface SendMessageData {
  bookingId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'SYSTEM';
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
  sender: {
    id: string;
    fullName: string;
    profilePicUrl?: string;
    role: string;
  };
  createdAt: string;
}

export async function sendMessage(data: SendMessageData): Promise<ChatMessage> {
  return apiClient.post<ChatMessage>(API_CONFIG.ENDPOINTS.MESSAGES_SEND, data);
}

export async function getBookingMessages(
  bookingId: string,
  skip: number = 0,
  take: number = 50
): Promise<{ data: ChatMessage[]; total: number }> {
  return apiClient.get<{ data: ChatMessage[]; total: number }>(
    `${API_CONFIG.ENDPOINTS.MESSAGES_BOOKING(bookingId)}?skip=${skip}&take=${take}`
  );
}

export default {
  sendMessage,
  getBookingMessages,
};
