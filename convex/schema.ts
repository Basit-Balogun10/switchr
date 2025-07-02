import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Enhanced users table with user types
  users: defineTable({
    email: v.string(),
    fullName: v.string(),
    userType: v.union(
      v.literal("user"),
      v.literal("provider"), 
      v.literal("station_partner"),
      v.literal("admin")
    ),
    profileImage: v.optional(v.id("_storage")),
    phone: v.optional(v.string()),
    isVerified: v.boolean(),
    isEmailVerified: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    preferences: v.optional(v.object({
      notifications: v.boolean(),
      newsletter: v.boolean(),
      language: v.string(),
    })),
  })
    .index("by_email", ["email"])
    .index("by_userType", ["userType"])
    .index("by_verified", ["isVerified"]),

  // Vehicle conversion providers
  providers: defineTable({
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
    services: v.array(v.string()), // ["CNG", "EV", "Hybrid"]
    certifications: v.array(v.string()),
    pricing: v.object({
      cngConversion: v.optional(v.number()),
      evConversion: v.optional(v.number()),
    }),
    images: v.array(v.id("_storage")),
    verified: v.boolean(),
    rating: v.number(),
    totalReviews: v.number(),
    ownerId: v.id("users"),
  })
    .index("by_location", ["location.city", "location.state"])
    .index("by_verified", ["verified"])
    .index("by_rating", ["rating"])
    .index("by_owner", ["ownerId"]),

  // Conversion bookings
  bookings: defineTable({
    userId: v.id("users"),
    providerId: v.id("providers"),
    vehicleInfo: v.object({
      make: v.string(),
      model: v.string(),
      year: v.number(),
      engineType: v.string(),
    }),
    conversionType: v.string(), // "CNG" | "EV" | "Hybrid"
    scheduledDate: v.number(),
    status: v.string(), // "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
    totalCost: v.number(),
    notes: v.optional(v.string()),
    checklist: v.optional(v.object({
      preConversion: v.array(v.object({
        item: v.string(),
        completed: v.boolean(),
        technicianSignature: v.optional(v.string()),
      })),
      postConversion: v.array(v.object({
        item: v.string(),
        completed: v.boolean(),
        technicianSignature: v.optional(v.string()),
      })),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["providerId"])
    .index("by_status", ["status"])
    .index("by_date", ["scheduledDate"]),

  // CNG/EV stations
  stations: defineTable({
    name: v.string(),
    type: v.string(), // "CNG" | "EV" | "Both"
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
    status: v.string(), // "operational" | "maintenance" | "offline"
    availability: v.object({
      cngAvailable: v.optional(v.boolean()),
      evChargers: v.optional(v.object({
        total: v.number(),
        available: v.number(),
        fastChargers: v.number(),
      })),
    }),
    ownerId: v.id("users"),
    verified: v.boolean(),
  })
    .index("by_location", ["location.city", "location.state"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_owner", ["ownerId"]),

  // Reviews for providers and stations
  reviews: defineTable({
    userId: v.id("users"),
    targetId: v.string(), // provider or station ID
    targetType: v.string(), // "provider" | "station"
    rating: v.number(),
    comment: v.string(),
    images: v.optional(v.array(v.id("_storage"))),
    verified: v.boolean(), // verified purchase/visit
  })
    .index("by_target", ["targetId", "targetType"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"]),

  // Digital vault for certificates and documents
  documents: defineTable({
    userId: v.id("users"),
    bookingId: v.optional(v.id("bookings")),
    type: v.string(), // "certificate" | "warranty" | "receipt" | "inspection"
    title: v.string(),
    fileId: v.id("_storage"),
    issueDate: v.number(),
    expiryDate: v.optional(v.number()),
    verified: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_booking", ["bookingId"])
    .index("by_type", ["type"]),

  // Vehicle compatibility data
  vehicleCompatibility: defineTable({
    make: v.string(),
    model: v.string(),
    yearRange: v.object({
      start: v.number(),
      end: v.number(),
    }),
    engineTypes: v.array(v.string()),
    conversionTypes: v.array(v.string()), // ["CNG", "EV", "Hybrid"]
    estimatedCost: v.object({
      cng: v.optional(v.number()),
      ev: v.optional(v.number()),
    }),
    notes: v.optional(v.string()),
  })
    .index("by_make", ["make"])
    .index("by_model", ["make", "model"]),

  // Educational content
  articles: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(), // "benefits" | "safety" | "government" | "maintenance"
    tags: v.array(v.string()),
    authorId: v.id("users"),
    published: v.boolean(),
    featured: v.boolean(),
    readTime: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
