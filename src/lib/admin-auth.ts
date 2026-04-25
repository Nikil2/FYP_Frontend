/**
 * Admin Authentication Utilities
 * Handles admin session management and API authentication
 */

import { adminLogin } from '@/api/services/admin';

export type AdminLevel = "MODERATOR" | "SENIOR_MODERATOR" | "SUPER_ADMIN";

export interface AdminSession {
  email: string;
  name: string;
  adminLevel: AdminLevel;
  loggedInAt: string;
  userId?: string;
  adminId?: string;
}

export const ADMIN_SESSION_KEY = "adminSession";

export const getAdminDemoAccounts = () => [];

/**
 * Login admin via backend API
 */
export const loginAdminViaApi = async (
  username: string,
  password: string,
): Promise<Omit<AdminSession, "loggedInAt"> | null> => {
  const response = await adminLogin({ username, password });

  if (!response.data) {
    return null;
  }

  return {
    email: response.data.phoneNumber,
    name: response.data.fullName,
    adminLevel: response.data.adminLevel as AdminLevel,
    userId: response.data.userId,
    adminId: response.data.id,
  };
};

export const setAdminSession = (session: Omit<AdminSession, "loggedInAt">): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: AdminSession = {
    ...session,
    loggedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(payload));
};

export const getAdminSession = (): AdminSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(ADMIN_SESSION_KEY);

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as AdminSession;

    if (!parsed?.email || !parsed?.name || !parsed?.adminLevel) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const isAdminLoggedIn = (): boolean => Boolean(getAdminSession());

export const clearAdminSession = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};
