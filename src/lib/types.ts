// Types
export type UserType = "user" | "provider" | "station_partner" | "admin";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  userType: UserType;
  profileImage?: string;
  phone?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  createdAt: number;
  lastLoginAt?: number;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
}

export interface UserRole {
  type: UserType;
  permissions: string[];
  defaultRoute: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  roles: UserType[];
  badge?: number;
}

// Utility functions
export const getUserPermissions = (userType: UserType): string[] => {
  switch (userType) {
    case "admin":
      return ["*"]; // All permissions
    case "provider":
      return ["bookings:manage", "customers:view", "analytics:view", "profile:edit"];
    case "station_partner":
      return ["stations:manage", "availability:update", "analytics:view", "profile:edit"];
    case "user":
      return ["bookings:view", "profile:edit", "documents:view"];
    default:
      return [];
  }
};

export const getDefaultRoute = (userType: UserType): string => {
  switch (userType) {
    case "admin":
      return "admin-dashboard";
    case "provider":
      return "provider-dash";
    case "station_partner":
      return "station-dash";
    case "user":
    default:
      return "dashboard";
  }
};