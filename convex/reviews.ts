import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const create = mutation({
    args: {
        targetId: v.string(),
        targetType: v.string(),
        rating: v.number(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be logged in to create a review");
        }

        // Check if user has already reviewed this target
        const existingReview = await ctx.db
            .query("reviews")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.and(
                    q.eq(q.field("targetId"), args.targetId),
                    q.eq(q.field("targetType"), args.targetType)
                )
            )
            .first();

        if (existingReview) {
            throw new Error(
                "You have already reviewed this " + args.targetType
            );
        }

        const reviewId = await ctx.db.insert("reviews", {
            userId,
            ...args,
            verified: false, // Will be verified based on actual bookings/visits
        });

        // Update the target's rating
        if (args.targetType === "provider") {
            await ctx.runMutation(api.providers.updateRating, {
                providerId: args.targetId as any,
                newRating: args.rating,
            });
        }

        return reviewId;
    },
});

export const getByTarget = query({
    args: {
        targetId: v.string(),
        targetType: v.string(),
    },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_target", (q) =>
                q
                    .eq("targetId", args.targetId)
                    .eq("targetType", args.targetType)
            )
            .order("desc")
            .collect();

        // Get user details for each review
        const reviewsWithUsers = await Promise.all(
            reviews.map(async (review) => {
                const user = await ctx.db.get(review.userId);
                return {
                    ...review,
                    user: user
                        ? { name: user.fullName, email: user.email }
                        : null,
                };
            })
        );

        return reviewsWithUsers;
    },
});
