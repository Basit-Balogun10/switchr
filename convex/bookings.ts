import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    providerId: v.id("providers"),
    vehicleInfo: v.object({
      make: v.string(),
      model: v.string(),
      year: v.number(),
      engineType: v.string(),
    }),
    conversionType: v.string(),
    scheduledDate: v.number(),
    totalCost: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a booking");
    }

    return await ctx.db.insert("bookings", {
      userId,
      ...args,
      status: "pending",
    });
  },
});

export const getUserBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get provider details for each booking
    const bookingsWithProviders = await Promise.all(
      bookings.map(async (booking) => {
        const provider = await ctx.db.get(booking.providerId);
        return {
          ...booking,
          provider,
        };
      })
    );

    return bookingsWithProviders;
  },
});

export const getProviderBookings = query({
  args: { providerId: v.id("providers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Verify the user owns this provider
    const provider = await ctx.db.get(args.providerId);
    if (!provider || provider.ownerId !== userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("bookings")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Verify the user owns the provider for this booking
    const provider = await ctx.db.get(booking.providerId);
    if (!provider || provider.ownerId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.bookingId, {
      status: args.status,
    });
  },
});
