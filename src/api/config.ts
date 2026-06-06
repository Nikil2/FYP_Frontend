/**
 * API Configuration
 * Centralized configuration for API client
 */

export const API_CONFIG = {
  // Backend API URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',

  // Request timeout (ms)
  TIMEOUT: 30000,

  // CORS settings
  CORS: {
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },

  // API endpoints
  ENDPOINTS: {
    // ==================== CUSTOMERS (USERS) ====================
    USERS_REGISTER: '/users/register',
    USERS_LOGIN: '/users/login',
    USERS_ME: '/users/me',
    USERS_GET_ALL: '/users',
    USERS_DETAIL: (userId: string) => `/users/${userId}`,
    USERS_UPDATE: (userId: string) => `/users/${userId}`,
    USERS_UPDATE_ME: '/users/me',
    USERS_VERIFY: (userId: string) => `/users/${userId}/verify`,
    USERS_BLOCK: (userId: string) => `/users/${userId}/block`,
    USERS_UNBLOCK: (userId: string) => `/users/${userId}/unblock`,
    USERS_DELETE: (userId: string) => `/users/${userId}`,

    // ==================== WORKERS ====================
    WORKERS_REGISTER: '/workers/register',
    WORKERS_GET_ALL: '/workers',
    WORKERS_GET_VERIFIED: '/workers/verified',
    WORKERS_DETAIL: (workerId: string) => `/workers/${workerId}`,
    WORKERS_BY_USER: (userId: string) => `/workers/user/${userId}`,
    WORKERS_ME_PROFILE: '/workers/me/profile',
    WORKERS_UPDATE: (workerId: string) => `/workers/${workerId}`,
    WORKERS_ONLINE_STATUS: (workerId: string) => `/workers/${workerId}/online-status`,
    WORKERS_ORDERS: (workerId: string) => `/workers/${workerId}/orders`,
    WORKERS_WALLET_SUMMARY: (workerId: string) => `/workers/${workerId}/wallet/summary`,
    WORKERS_WALLET_TRANSACTIONS: (workerId: string) => `/workers/${workerId}/wallet/transactions`,
    WORKERS_SERVICES: (workerId: string) => `/workers/${workerId}/services`,
    WORKERS_PORTFOLIO: (workerId: string) => `/workers/${workerId}/portfolio`,
    WORKERS_PORTFOLIO_ADD: (workerId: string) => `/workers/${workerId}/portfolio`,
    WORKERS_PORTFOLIO_ITEM: (workerId: string, portfolioId: string) =>
      `/workers/${workerId}/portfolio/${portfolioId}`,
    WORKERS_PORTFOLIO_UPDATE: (workerId: string, portfolioId: string) =>
      `/workers/${workerId}/portfolio/${portfolioId}`,
    WORKERS_PORTFOLIO_DELETE: (workerId: string, portfolioId: string) =>
      `/workers/${workerId}/portfolio/${portfolioId}`,

    // ==================== SERVICES ====================
    SERVICES: '/services',
    SERVICES_ACTIVE: '/services/active',
    SERVICES_LIST: '/services/list/all',
    SERVICES_DETAIL: (serviceId: number) => `/services/${serviceId}`,
    SERVICES_CREATE: '/services',

    // ==================== BOOKINGS ====================
    BOOKINGS_CREATE: '/bookings',
    BOOKINGS_MY: '/bookings/my',
    BOOKINGS_GET_ALL: '/bookings',
    BOOKINGS_DETAIL: (bookingId: string) => `/bookings/${bookingId}`,
    BOOKINGS_CUSTOMER: (customerId: string) => `/bookings/customer/${customerId}`,
    BOOKINGS_WORKER: (workerId: string) => `/bookings/worker/${workerId}`,
    BOOKINGS_UPDATE_STATUS: (bookingId: string) => `/bookings/${bookingId}/status`,
    BOOKINGS_CANCEL: (bookingId: string) => `/bookings/${bookingId}/cancel`,
    BOOKINGS_PROPOSALS: (bookingId: string) => `/bookings/${bookingId}/proposals`,
    BOOKINGS_ACCEPT_PROPOSAL: (bookingId: string, proposalId: string) =>
      `/bookings/${bookingId}/proposals/${proposalId}/accept`,

    // ==================== MESSAGES ====================
    MESSAGES_SEND: '/messages',
    MESSAGES_BOOKING: (bookingId: string) => `/messages/booking/${bookingId}`,
    MESSAGES_DETAIL: (messageId: string) => `/messages/${messageId}`,

    // ==================== FEEDBACK ====================
    FEEDBACK_SUBMIT: '/feedback',
    FEEDBACK_WORKER: (workerId: string) => `/feedback/worker/${workerId}`,
    FEEDBACK_WORKER_STATS: (workerId: string) => `/feedback/worker/${workerId}/stats`,
    FEEDBACK_BOOKING: (bookingId: string) => `/feedback/booking/${bookingId}`,

    // ==================== COMPLAINTS ====================
    COMPLAINTS_FILE: '/complaints',
    COMPLAINTS_GET_ALL: '/complaints',
    COMPLAINTS_BOOKING: (bookingId: string) => `/complaints/booking/${bookingId}`,
    COMPLAINTS_DETAIL: (complaintId: string) => `/complaints/${complaintId}`,
    COMPLAINTS_RESOLVE: (complaintId: string) => `/complaints/${complaintId}/resolve`,

    // ==================== NOTIFICATIONS ====================
    NOTIFICATIONS: '/notifications',
    NOTIFICATIONS_UNREAD: '/notifications/unread',
    NOTIFICATIONS_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
    NOTIFICATIONS_READ_ALL: '/notifications/read-all',
    NOTIFICATIONS_DELETE: (notificationId: string) => `/notifications/${notificationId}`,
    NOTIFICATIONS_DELETE_ALL: '/notifications/all',
    NOTIFICATIONS_FCM_TOKEN: '/notifications/fcm-token',

    // ==================== SAVED LOCATIONS ====================
    LOCATIONS: '/locations',
    LOCATIONS_DETAIL: (locationId: string) => `/locations/${locationId}`,

    // ==================== WORKER SCHEDULE ====================
    SCHEDULE: (workerId: string) => `/workers/${workerId}/schedule`,
    SCHEDULE_DAY: (workerId: string, day: number) => `/workers/${workerId}/schedule/${day}`,

    // ==================== FILE UPLOADS ====================
    UPLOADS_PROFILE_PICTURE: '/uploads/profile-picture',
    UPLOADS_CNIC: '/uploads/cnic',
    UPLOADS_PORTFOLIO: '/uploads/portfolio',
    UPLOADS_EVIDENCE: '/uploads/evidence',

    // ==================== ADMIN ====================
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_BLOCK_USER: (userId: string) => `/admin/users/${userId}/block`,
    ADMIN_UNBLOCK_USER: (userId: string) => `/admin/users/${userId}/unblock`,
    ADMIN_DELETE_USER: (userId: string) => `/admin/users/${userId}`,
    ADMIN_WORKERS: '/admin/workers',
    ADMIN_VERIFICATION: '/admin/workers/verification',
    ADMIN_APPROVE_WORKER: (workerId: string) => `/admin/workers/${workerId}/approve`,
    ADMIN_REJECT_WORKER: (workerId: string) => `/admin/workers/${workerId}/reject`,
    ADMIN_JOBS: '/admin/jobs',
    ADMIN_JOB_DETAIL: (jobId: string) => `/admin/jobs/${jobId}`,
    ADMIN_COMPLAINTS: '/admin/complaints',
    ADMIN_RESOLVE_COMPLAINT: (complaintId: string) => `/admin/complaints/${complaintId}/resolve`,
    ADMIN_ASSIGN_COMPLAINT: (complaintId: string) => `/admin/complaints/${complaintId}/assign`,
    ADMIN_REVIEWS: '/admin/reviews',
    ADMIN_HIDE_REVIEW: (reviewId: string) => `/admin/reviews/${reviewId}/hide`,
    ADMIN_SERVICES: '/admin/services',
    ADMIN_UPDATE_SERVICE: (serviceId: number) => `/admin/services/${serviceId}`,
    ADMIN_DEACTIVATE_SERVICE: (serviceId: number) => `/admin/services/${serviceId}/deactivate`,
    ADMIN_ACTIVATE_SERVICE: (serviceId: number) => `/admin/services/${serviceId}/activate`,
    ADMIN_REVENUE: '/admin/revenue',
    ADMIN_ANALYTICS: '/admin/analytics',
  },
};

export default API_CONFIG;
