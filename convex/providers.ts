import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    service: v.optional(v.string()),
    verified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let providers;

    if (args.verified !== undefined) {
      providers = await ctx.db
        .query("providers")
        .withIndex("by_verified", (q) => q.eq("verified", args.verified!))
        .collect();
    } else {
      providers = await ctx.db.query("providers").collect();
    }

    return providers
      .filter((provider) => {
        if (args.city && provider.location.city !== args.city) return false;
        if (args.state && provider.location.state !== args.state) return false;
        if (args.service && !provider.services.includes(args.service)) return false;
        return true;
      })
      .sort((a, b) => b.rating - a.rating);
  },
});

export const getById = query({
  args: { id: v.id("providers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

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
      throw new Error("Must be logged in to create a provider");
    }

    return await ctx.db.insert("providers", {
      ...args,
      images: [],
      verified: false,
      rating: 0,
      totalReviews: 0,
      ownerId: userId,
    });
  },
});

export const updateRating = mutation({
  args: {
    providerId: v.id("providers"),
    newRating: v.number(),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) {
      throw new Error("Provider not found");
    }

    const totalRating = provider.rating * provider.totalReviews + args.newRating;
    const newTotalReviews = provider.totalReviews + 1;
    const newAverageRating = totalRating / newTotalReviews;

    await ctx.db.patch(args.providerId, {
      rating: newAverageRating,
      totalReviews: newTotalReviews,
    });
  },
});
