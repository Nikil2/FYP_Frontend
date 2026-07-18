/**
 * Socket.IO Client
 * Real-time connection for messaging and notifications
 *
 * Usage:
 *   import { socketClient } from '@/lib/socket';
 *
 *   // Connect after login
 *   socketClient.connect();
 *
 *   // Join a booking chat room
 *   socketClient.joinBooking(bookingId);
 *
 *   // Listen for new messages
 *   socketClient.onNewMessage((message) => { ... });
 *
 *   // Listen for notifications
 *   socketClient.onNotification((notification) => { ... });
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(
  /\/+$/,
  '',
);

class SocketClient {
  private socket: Socket | null = null;
  private messageListeners: ((message: any) => void)[] = [];
  private notificationListeners: ((notification: any) => void)[] = [];
  private bookingStatusListeners: ((data: any) => void)[] = [];
  private proposalListeners: ((proposal: any) => void)[] = [];
  private typingListeners: ((data: any) => void)[] = [];
  private workerLocationListeners: ((data: any) => void)[] = [];

  /**
   * Connect to Socket.IO server with JWT authentication.
   * Call this after successful login.
   */
  connect(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Socket: No auth token, skipping connection');
      return;
    }

    // Disconnect existing connection if any
    if (this.socket?.connected) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
    });

    // Register event listeners
    this.socket.on('new_message', (message) => {
      this.messageListeners.forEach((cb) => cb(message));
    });

    this.socket.on('new_notification', (notification) => {
      this.notificationListeners.forEach((cb) => cb(notification));
    });

    this.socket.on('booking_status_updated', (data) => {
      this.bookingStatusListeners.forEach((cb) => cb(data));
    });

    this.socket.on('new_proposal', (proposal) => {
      this.proposalListeners.forEach((cb) => cb(proposal));
    });

    this.socket.on('user_typing', (data) => {
      this.typingListeners.forEach((cb) => cb(data));
    });

    this.socket.on('user_stopped_typing', (data) => {
      this.typingListeners.forEach((cb) => cb({ ...data, stopped: true }));
    });

    this.socket.on('worker_location_updated', (data) => {
      this.workerLocationListeners.forEach((cb) => cb(data));
    });

    this.socket.on('tracking_stopped', (data) => {
      this.workerLocationListeners.forEach((cb) =>
        cb({ ...data, stopped: true }),
      );
    });
  }

  /**
   * Disconnect from Socket.IO server.
   * Call this on logout.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageListeners = [];
    this.notificationListeners = [];
    this.bookingStatusListeners = [];
    this.proposalListeners = [];
    this.typingListeners = [];
    this.workerLocationListeners = [];
  }

  /**
   * Check if connected.
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ==================== ROOM MANAGEMENT ====================

  joinBooking(bookingId: string): void {
    this.socket?.emit('join_booking', { bookingId });
  }

  leaveBooking(bookingId: string): void {
    this.socket?.emit('leave_booking', { bookingId });
  }

  sendMessage(bookingId: string, content: string, type: 'TEXT' | 'IMAGE' = 'TEXT'): void {
    this.socket?.emit('send_message', { bookingId, content, type });
  }

  startTyping(bookingId: string): void {
    this.socket?.emit('typing_start', { bookingId });
  }

  stopTyping(bookingId: string): void {
    this.socket?.emit('typing_stop', { bookingId });
  }

  // ==================== EVENT LISTENERS ====================

  onNewMessage(callback: (message: any) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter((cb) => cb !== callback);
    };
  }

  onNotification(callback: (notification: any) => void): () => void {
    this.notificationListeners.push(callback);
    return () => {
      this.notificationListeners = this.notificationListeners.filter((cb) => cb !== callback);
    };
  }

  onBookingStatusUpdate(callback: (data: any) => void): () => void {
    this.bookingStatusListeners.push(callback);
    return () => {
      this.bookingStatusListeners = this.bookingStatusListeners.filter((cb) => cb !== callback);
    };
  }

  onNewProposal(callback: (proposal: any) => void): () => void {
    this.proposalListeners.push(callback);
    return () => {
      this.proposalListeners = this.proposalListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Worker: broadcast current position for an active booking.
   */
  updateLocation(
    bookingId: string,
    lat: number,
    lng: number,
    heading?: number,
    speed?: number
  ): void {
    this.socket?.emit('update_location', { bookingId, lat, lng, heading, speed });
  }

  /**
   * Customer: subscribe to the assigned worker's live position.
   */
  onWorkerLocation(callback: (data: any) => void): () => void {
    this.workerLocationListeners.push(callback);
    return () => {
      this.workerLocationListeners = this.workerLocationListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  onTyping(callback: (data: any) => void): () => void {
    this.typingListeners.push(callback);
    return () => {
      this.typingListeners = this.typingListeners.filter((cb) => cb !== callback);
    };
  }
}

// Export singleton instance
export const socketClient = new SocketClient();

export default socketClient;
