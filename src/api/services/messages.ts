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

/** Compress image to max 1024px / JPEG 82% — reduces 4MB phone photo to ~150KB */
async function compressImage(file: File): Promise<Blob> {
  const MAX_PX = 1024;
  const QUALITY = 0.82;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      const { width, height } = img;
      const scale = Math.min(1, MAX_PX / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        QUALITY
      );
    };

    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error("Image load failed")); };
    img.src = blobUrl;
  });
}

export async function uploadChatImage(file: File): Promise<{ url: string }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const compressed = await compressImage(file);

  const formData = new FormData();
  formData.append("file", compressed, "chat.jpg");
  formData.append("upload_preset", preset!);
  formData.append("folder", "mehnati/message");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return { url: data.secure_url };
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
