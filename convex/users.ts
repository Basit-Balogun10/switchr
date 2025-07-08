import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all providers (users with userType: "provider")
export const listProviders = query({
    args: {
        city: v.optional(v.string()),
        services: v.optional(v.array(v.string())),
        verified: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query("users")
            .withIndex("by_userType", (q) => q.eq("userType", "provider"));

        const providers = await query.collect();

        return providers.filter((provider) => {
            // Filter by city if provided
            if (args.city && provider.location?.city.toLowerCase() !== args.city.toLowerCase()) {
                return false;
            }

            // Filter by services if provided
            if (args.services && args.services.length > 0) {
                if (!provider.services || !args.services.some(service => provider.services!.includes(service))) {
                    return false;
                }
            }

            // Filter by verified status if provided
            if (args.verified !== undefined && provider.isVerified !== args.verified) {
                return false;
            }

            return true;
        });
    },
});

// Update provider profile
export const updateProfile = mutation({
    args: {
        description: v.optional(v.string()),
        location: v.optional(
            v.object({
                address: v.string(),
                city: v.string(),
                state: v.string(),
                coordinates: v.object({
                    lat: v.number(),
                    lng: v.number(),
                }),
            })
        ),
        services: v.optional(v.array(v.string())),
        certifications: v.optional(v.array(v.string())),
        pricing: v.optional(
            v.object({
                cngConversion: v.optional(v.number()),
                evConversion: v.optional(v.number()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db.get(userId);
        if (!user || user.userType !== "provider") {
            throw new Error("Only providers can update provider profiles");
        }

        await ctx.db.patch(userId, {
            ...args,
            // Set default rating if this is the first time setting up profile
            rating: user.rating || 4.0,
            totalReviews: user.totalReviews || 0,
        });

        return userId;
    },
});

// Update provider rating
export const updateRating = mutation({
    args: {
        providerId: v.id("users"),
        newRating: v.number(),
        newTotalReviews: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.providerId, {
            rating: args.newRating,
            totalReviews: args.newTotalReviews,
        });
    },
});

// Get provider by ID
export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const provider = await ctx.db.get(args.id);
        if (!provider || provider.userType !== "provider") {
            return null;
        }
        return provider;
    },
});

// Get current user's provider profile
export const getCurrentProvider = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user || user.userType !== "provider") return null;

        return user;
    },
});
