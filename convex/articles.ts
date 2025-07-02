import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let articles;

    if (args.category) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else if (args.featured !== undefined) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured!))
        .collect();
    } else if (args.published !== undefined) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_published", (q) => q.eq("published", args.published!))
        .collect();
    } else {
      articles = await ctx.db.query("articles").collect();
    }

    return articles
      .filter((article) => {
        if (args.published !== undefined && article.published !== args.published) return false;
        if (args.featured !== undefined && article.featured !== args.featured) return false;
        return true;
      })
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
