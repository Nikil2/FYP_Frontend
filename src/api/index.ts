/**
 * Main API Index
 * Central export point for all API functionality
 */

// Configuration
export * from './config';

// Types
export * from './types';

// Client
export { apiClient, default as ApiClient } from './client';

// Services
export * from './services';

// Convenience imports
export { default as API_CONFIG } from './config';
