import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.fullName as string, // Use 'name' instead of 'fullName'
          userType: params.userType as "user" | "provider" | "station_partner" | "admin",
          phone: params.phone as string,
        };
      },
    }),
  ],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    // First try to find user by email
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    
    // If user doesn't exist in our custom table, create from identity
    if (!user && identity.name) {
      const userId = await ctx.db.insert("users", {
        email: identity.email!,
        fullName: identity.name,
        userType: "user", // Default to user type
        isVerified: false,
        isEmailVerified: false,
        createdAt: Date.now(),
        preferences: {
          notifications: true,
          newsletter: false,
          language: "en",
        },
      });
      
      user = await ctx.db.get(userId);
    }
    
    return user;
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    fullName: v.string(),
    userType: v.union(
      v.literal("user"),
      v.literal("provider"),
      v.literal("station_partner"),
      v.literal("admin")
    ),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      fullName: args.fullName,
      userType: args.userType,
      phone: args.phone,
      isVerified: false,
      isEmailVerified: false,
      createdAt: Date.now(),
      preferences: {
        notifications: true,
        newsletter: false,
        language: "en",
      },
    });
    return userId;
  },
});

export const updateLastLogin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      lastLoginAt: Date.now(),
    });
  },
});
