import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store } = convexAuth({
    providers: [
        Password({
            profile(params) {
                return {
                    email: params.email as string,
                    name: params.fullName as string,
                    companyName: params.companyName as string,
                    officeAddress: params.officeAddress as string,
                    userType: params.userType as "user" | "provider" | "admin",
                };
            },
        }),
    ],
    callbacks: {
        async createOrUpdateUser(ctx, args) {
            if (args.existingUserId) {
                return args.existingUserId;
            }

            // Create new user with different fields based on user type
            const userData: any = {
                email: args.profile.email!,
                userType: args.profile.userType || "user",
                isVerified: false,
                isEmailVerified: false,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
            };

            // Add specific fields based on user type
            if (args.profile.userType === "provider") {
                userData.companyName = args.profile.companyName;
                userData.officeAddress = args.profile.officeAddress;
            } else {
                userData.fullName = args.profile.name;
            }

            return await ctx.db.insert("users", userData);
        },
    },
});

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user) return null;

        return user;
    },
});

export const loggedInUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        return user;
    },
});
