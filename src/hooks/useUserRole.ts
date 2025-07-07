import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    UserType,
    UserRole,
    getUserPermissions,
    getDefaultRoute,
} from "../lib/types";

export const useUserRole = (): UserRole | null => {
    const user = useQuery(api.auth.getCurrentUser);

    if (!user) return null;

    return {
        type: user.userType || "user",
        permissions: getUserPermissions(user.userType || "user"),
        defaultRoute: getDefaultRoute(user.userType || "user"),
    };
};

export const useHasPermission = (permission: string): boolean => {
    const userRole = useUserRole();

    if (!userRole) return false;

    // Admin has all permissions
    if (userRole.permissions.includes("*")) return true;

    return userRole.permissions.includes(permission);
};
