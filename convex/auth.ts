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
                    userType: params.userType as "user" | "provider" | "admin",
                    // Provider onboarding fields
                    description: params.description as string,
                    address: params.address as string,
                    city: params.city as string,
                    state: params.state as string,
                    coordinates: params.coordinates as { lat: number; lng: number } | null,
                    services: params.services as string[],
                    certifications: params.certifications as string[],
                    cngPrice: params.cngPrice as string,
                    evPrice: params.evPrice as string,
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
                
                // Add provider onboarding fields if provided
                if (args.profile.description) {
                    userData.description = args.profile.description;
                }
                
                if (args.profile.address && args.profile.city && args.profile.state) {
                    userData.location = {
                        address: args.profile.address,
                        city: args.profile.city,
                        state: args.profile.state,
                        coordinates: args.profile.coordinates || { lat: 0, lng: 0 },
                    };
                }
                
                if (args.profile.services && Array.isArray(args.profile.services) && args.profile.services.length > 0) {
                    userData.services = args.profile.services;
                }
                
                if (args.profile.certifications && Array.isArray(args.profile.certifications) && args.profile.certifications.length > 0) {
                    userData.certifications = args.profile.certifications;
                }
                
                if (args.profile.cngPrice || args.profile.evPrice) {
                    userData.pricing = {
                        cngConversion: args.profile.cngPrice && typeof args.profile.cngPrice === 'string' ? parseFloat(args.profile.cngPrice) : undefined,
                        evConversion: args.profile.evPrice && typeof args.profile.evPrice === 'string' ? parseFloat(args.profile.evPrice) : undefined,
                    };
                }
                
                // Set default rating for new providers
                userData.rating = 4.0;
                userData.totalReviews = 0;
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
