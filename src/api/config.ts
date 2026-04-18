/**
 * API Configuration
 * Centralized configuration for API client
 */

export const API_CONFIG = {
  // Backend API URL
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000',

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
    USERS_GET_ALL: '/users',
    USERS_DETAIL: (userId: string) => `/users/${userId}`,
    USERS_UPDATE: (userId: string) => `/users/${userId}`,
    USERS_VERIFY: (userId: string) => `/users/${userId}/verify`,
    USERS_BLOCK: (userId: string) => `/users/${userId}/block`,
    USERS_UNBLOCK: (userId: string) => `/users/${userId}/unblock`,
    USERS_DELETE: (userId: string) => `/users/${userId}`,

    // ==================== WORKERS ====================
    WORKERS_REGISTER: '/workers/register',
    WORKERS_GET_ALL: '/workers',
    WORKERS_GET_VERIFIED: '/workers/verified',
    WORKERS_DETAIL: (workerId: string) => `/workers/${workerId}`,
    WORKERS_UPDATE: (workerId: string) => `/workers/${workerId}`,
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
  },
};

export default API_CONFIG;
