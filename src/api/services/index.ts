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
export * from './worker-dashboard';

// Bookings API
export * from './bookings';

// Messages API
export * from './messages';

// Feedback API
export * from './feedback';

// Complaints API
export * from './complaints';

// Notifications API
export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  updateFcmToken,
} from './notifications';

// Locations API
export {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from './locations';

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
  getAdminJobs,
  getAdminJobById,
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
export { default as bookingsService } from './bookings';
export { default as messagesService } from './messages';
export { default as feedbackService } from './feedback';
export { default as complaintsService } from './complaints';
export { default as notificationsService } from './notifications';
export { default as locationsService } from './locations';
export { default as adminService } from './admin';
