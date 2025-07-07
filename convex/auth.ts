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
          userType: params.userType as "user" | "provider" | "admin",
          phone: params.phone as string,
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        // Update existing user if needed
        return args.existingUserId;
      }

      // Create new user with the profile data
      return await ctx.db.insert("users", {
        email: args.profile.email!,
        fullName: args.profile.name!,
        userType: args.profile.userType || "user",
        phone: args.profile.phone,
        isVerified: false,
        isEmailVerified: false,
        createdAt: Date.now(),
        preferences: {
          notifications: true,
          newsletter: false,
          language: "en",
        },
      });
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
