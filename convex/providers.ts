import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        location: v.object({
            address: v.string(),
            city: v.string(),
            state: v.string(),
            coordinates: v.object({
                lat: v.number(),
                lng: v.number(),
            }),
        }),
        services: v.array(v.string()),
        certifications: v.array(v.string()),
        pricing: v.object({
            cngConversion: v.optional(v.number()),
            evConversion: v.optional(v.number()),
        }),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db.get(userId);
        if (!user || user.userType !== "provider") {
            throw new Error("Only providers can create provider profiles");
        }

        const providerId = await ctx.db.insert("providers", {
            name: args.name,
            description: args.description,
            location: args.location,
            services: args.services,
            certifications: args.certifications,
            pricing: args.pricing,
            images: [],
            verified: false, // Requires admin approval
            rating: 0,
            totalReviews: 0,
            ownerId: userId,
        });

        return providerId;
    },
});

export const list = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        services: v.optional(v.array(v.string())),
        verified: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let providers = ctx.db.query("providers");

        if (args.city) {
            providers = providers.filter((q) =>
                q.eq(q.field("location.city"), args.city)
            );
        }

        if (args.state) {
            providers = providers.filter((q) =>
                q.eq(q.field("location.state"), args.state)
            );
        }

        if (args.verified !== undefined) {
            providers = providers.filter((q) =>
                q.eq(q.field("verified"), args.verified)
            );
        }

        const results = await providers.collect();

        // Filter by services if provided
        if (args.services && args.services.length > 0) {
            return results.filter((provider) =>
                args.services!.some((service) =>
                    provider.services.includes(service)
                )
            );
        }

        return results;
    },
});

export const getById = query({
    args: { id: v.id("providers") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByOwner = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        return await ctx.db
            .query("providers")
            .filter((q) => q.eq(q.field("ownerId"), userId))
            .first();
    },
});

export const updateRating = mutation({
    args: {
        providerId: v.id("providers"),
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
