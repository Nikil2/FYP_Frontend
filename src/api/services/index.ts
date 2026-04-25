/**
 * API Services Index
 * Central export point for all API service functions
 */

// Users (Customers) API
export * from './users';

// Services API
export * from './services';

// Workers API
export * from './workers';

// Admin API
export {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getAllWorkers as getAllAdminWorkers,
  getPendingVerifications,
  approveWorkerVerification,
  rejectWorkerVerification,
  getComplaints,
  resolveComplaint,
  assignComplaint,
  getReviews,
  hideReview,
  getAllServices,
  createService,
  updateService,
  deactivateService,
  activateService,
  getRevenueStats,
  getAnalytics,
} from './admin';

// Re-exports for convenience
export { default } from './users';
export { default as usersService } from './users';
export { default as servicesService } from './services';
export { default as workersService } from './workers';
export { default as adminService } from './admin';
