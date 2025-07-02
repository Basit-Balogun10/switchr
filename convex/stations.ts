import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    type: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let stations;

    if (args.type) {
      stations = await ctx.db
        .query("stations")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    } else if (args.status) {
      stations = await ctx.db
        .query("stations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      stations = await ctx.db.query("stations").collect();
    }

    return stations.filter((station) => {
      if (args.city && station.location.city !== args.city) return false;
      if (args.state && station.location.state !== args.state) return false;
      return true;
    });
  },
});

export const getNearby = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radius: v.optional(v.number()), // in km
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const radius = args.radius || 50; // default 50km
    const stations = await ctx.db.query("stations").collect();

    return stations
      .filter((station) => {
        if (args.type && station.type !== args.type && station.type !== "Both") {
          return false;
        }

        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = ((station.location.coordinates.lat - args.lat) * Math.PI) / 180;
        const dLng = ((station.location.coordinates.lng - args.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((args.lat * Math.PI) / 180) *
            Math.cos((station.location.coordinates.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance <= radius;
      })
      .map((station) => {
        // Calculate distance for sorting
        const R = 6371;
        const dLat = ((station.location.coordinates.lat - args.lat) * Math.PI) / 180;
        const dLng = ((station.location.coordinates.lng - args.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((args.lat * Math.PI) / 180) *
            Math.cos((station.location.coordinates.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...station, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    location: v.object({
      address: v.string(),
      city: v.string(),
      state: v.string(),
      coordinates: v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    }),
    pricing: v.object({
      cngPrice: v.optional(v.number()),
      evPrice: v.optional(v.number()),
    }),
    amenities: v.array(v.string()),
    operatingHours: v.object({
      open: v.string(),
      close: v.string(),
      is24Hours: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a station");
    }

    return await ctx.db.insert("stations", {
      ...args,
      status: "operational",
      availability: {
        cngAvailable: args.type === "CNG" || args.type === "Both" ? true : undefined,
        evChargers: args.type === "EV" || args.type === "Both" ? {
          total: 4,
          available: 4,
          fastChargers: 2,
        } : undefined,
      },
      ownerId: userId,
      verified: false,
    });
  },
});

export const updateAvailability = mutation({
  args: {
    stationId: v.id("stations"),
    availability: v.object({
      cngAvailable: v.optional(v.boolean()),
      evChargers: v.optional(v.object({
        total: v.number(),
        available: v.number(),
        fastChargers: v.number(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const station = await ctx.db.get(args.stationId);
    if (!station || station.ownerId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.stationId, {
      availability: args.availability,
    });
  },
});
