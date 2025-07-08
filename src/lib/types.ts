// Types
export type UserType = "user" | "provider" | "admin";

export interface User {
    _id: string;
    email: string;
    fullName?: string; // For vehicle owners
    companyName?: string; // For service providers
    officeAddress?: string; // For service providers
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

// Utility function to get display name based on user type
export const getDisplayName = (user: User): string => {
    if (user.userType === "provider") {
        return user.companyName || "Company";
    }
    return user.fullName || "User";
};

// Utility function to get initials for avatar
export const getInitials = (user: User): string => {
    const name = getDisplayName(user);
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

// User roles and permissions
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
            return [
                "bookings:manage",
                "customers:view",
                "analytics:view",
                "profile:edit",
            ];
        case "user":
            return ["bookings:view", "profile:edit", "documents:view"];
        default:
            return [];
    }
};

export const getDefaultRoute = (userType: UserType): string => {
    switch (userType) {
        case "admin":
            return "/admin-dashboard";
        case "provider":
            return "/provider-dash";
        case "user":
        default:
            return "/dashboard";
    }
};
