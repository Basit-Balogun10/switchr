import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        type: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let stations = ctx.db.query("stations");

        if (args.city) {
            stations = stations.filter((q) =>
                q.eq(q.field("location.city"), args.city)
            );
        }

        if (args.state) {
            stations = stations.filter((q) =>
                q.eq(q.field("location.state"), args.state)
            );
        }

        if (args.type) {
            stations = stations.filter((q) => q.eq(q.field("type"), args.type));
        }

        if (args.status) {
            stations = stations.filter((q) =>
                q.eq(q.field("status"), args.status)
            );
        }

        return await stations.collect();
    },
});

export const getById = query({
    args: { id: v.id("stations") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getNearby = query({
    args: {
        lat: v.number(),
        lng: v.number(),
        radiusKm: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const stations = await ctx.db.query("stations").collect();
        const radius = args.radiusKm || 50; // Default 50km radius

        // Calculate distance using Haversine formula
        const calculateDistance = (
            lat1: number,
            lng1: number,
            lat2: number,
            lng2: number
        ) => {
            const R = 6371; // Earth's radius in km
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLng = ((lng2 - lng1) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                    Math.cos((lat2 * Math.PI) / 180) *
                    Math.sin(dLng / 2) *
                    Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        return stations
            .map((station) => ({
                ...station,
                distance: calculateDistance(
                    args.lat,
                    args.lng,
                    station.location.coordinates.lat,
                    station.location.coordinates.lng
                ),
            }))
            .filter((station) => station.distance <= radius)
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
                cngAvailable:
                    args.type === "CNG" || args.type === "Both"
                        ? true
                        : undefined,
                evChargers:
                    args.type === "EV" || args.type === "Both"
                        ? {
                              total: 4,
                              available: 4,
                              fastChargers: 2,
                          }
                        : undefined,
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
            evChargers: v.optional(
                v.object({
                    total: v.number(),
                    available: v.number(),
                    fastChargers: v.number(),
                })
            ),
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
