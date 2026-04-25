export type AdminLevel = "MODERATOR" | "SENIOR_MODERATOR" | "SUPER_ADMIN";

export interface AdminSession {
  email: string;
  name: string;
  adminLevel: AdminLevel;
  loggedInAt: string;
}

interface DemoAdminCredentials {
  email: string;
  password: string;
  name: string;
  adminLevel: AdminLevel;
}

export const ADMIN_SESSION_KEY = "adminSession";

const DEMO_ADMINS: DemoAdminCredentials[] = [
  {
    email: "admin@mehnati.pk",
    password: "admin123",
    name: "Noman Siddiqui",
    adminLevel: "SUPER_ADMIN",
  },
  {
    email: "moderator@mehnati.pk",
    password: "mod123",
    name: "Fatima Aslam",
    adminLevel: "MODERATOR",
  },
];

export const getAdminDemoAccounts = () =>
  DEMO_ADMINS.map((admin) => ({
    email: admin.email,
    name: admin.name,
    adminLevel: admin.adminLevel,
  }));

export const validateAdminCredentials = (
  email: string,
  password: string,
): Omit<AdminSession, "loggedInAt"> | null => {
  const normalizedEmail = email.trim().toLowerCase();

  const matchedAdmin = DEMO_ADMINS.find(
    (admin) => admin.email === normalizedEmail && admin.password === password,
  );

  if (!matchedAdmin) {
    return null;
  }

  return {
    email: matchedAdmin.email,
    name: matchedAdmin.name,
    adminLevel: matchedAdmin.adminLevel,
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
