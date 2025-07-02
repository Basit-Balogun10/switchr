import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    userId: v.id("users"),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId || currentUserId !== args.userId) {
      throw new Error("Unauthorized");
    }

    let documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (args.type) {
      documents = documents.filter(doc => doc.type === args.type);
    }

    return documents.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const create = mutation({
  args: {
    bookingId: v.optional(v.id("bookings")),
    type: v.string(),
    title: v.string(),
    fileId: v.id("_storage"),
    issueDate: v.number(),
    expiryDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a document");
    }

    return await ctx.db.insert("documents", {
      userId,
      ...args,
      verified: false,
    });
  },
});
