import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingProviders = await ctx.db.query("providers").first();
    if (existingProviders) {
      return { message: "Database already seeded" };
    }

    // Create sample providers
    const providers = [
      {
        name: "GreenTech Auto Solutions",
        description: "Leading CNG conversion specialists with over 10 years of experience. We provide comprehensive conversion services with certified technicians and quality assurance.",
        location: {
          address: "15 Adeola Odeku Street, Victoria Island",
          city: "Lagos",
          state: "Lagos",
          coordinates: { lat: 6.4281, lng: 3.4219 }
        },
        services: ["CNG", "EV"],
        certifications: ["NMDPRA Certified", "ISO 9001", "NADDC Approved"],
        pricing: {
          cngConversion: 750000,
          evConversion: 3200000
        },
        images: [],
        verified: true,
        rating: 4.8,
        totalReviews: 127,
        ownerId: "temp_user_1" as any
      },
      {
        name: "EcoMotion Garage",
        description: "Specialized in electric vehicle conversions and hybrid systems. Our team of engineers ensures safe and efficient conversions.",
        location: {
          address: "Plot 45, Ahmadu Bello Way, Garki",
          city: "Abuja",
          state: "FCT",
          coordinates: { lat: 9.0579, lng: 7.4951 }
        },
        services: ["EV", "Hybrid"],
        certifications: ["NMDPRA Certified", "IEEE Member"],
        pricing: {
          evConversion: 3800000
        },
        images: [],
        verified: true,
        rating: 4.6,
        totalReviews: 89,
        ownerId: "temp_user_2" as any
      },
      {
        name: "CleanFuel Motors",
        description: "Affordable CNG conversion services with flexible payment plans. We make clean energy accessible to everyone.",
        location: {
          address: "12 Bompai Road, Kano",
          city: "Kano",
          state: "Kano",
          coordinates: { lat: 12.0022, lng: 8.5919 }
        },
        services: ["CNG"],
        certifications: ["NMDPRA Certified"],
        pricing: {
          cngConversion: 680000
        },
        images: [],
        verified: true,
        rating: 4.4,
        totalReviews: 156,
        ownerId: "temp_user_3" as any
      }
    ];

    for (const provider of providers) {
      await ctx.db.insert("providers", provider);
    }

    // Create sample stations
    const stations = [
      {
        name: "Total CNG Station Victoria Island",
        type: "CNG",
        location: {
          address: "Tiamiyu Savage Street, Victoria Island",
          city: "Lagos",
          state: "Lagos",
          coordinates: { lat: 6.4474, lng: 3.4044 }
        },
        pricing: {
          cngPrice: 230
        },
        amenities: ["ATM", "Convenience Store", "Restroom", "WiFi"],
        operatingHours: {
          open: "06:00",
          close: "22:00",
          is24Hours: false
        },
        status: "operational",
        availability: {
          cngAvailable: true
        },
        ownerId: "temp_user_4" as any,
        verified: true
      },
      {
        name: "Nipco EV Charging Hub",
        type: "EV",
        location: {
          address: "Lekki Phase 1, Lagos",
          city: "Lagos",
          state: "Lagos",
          coordinates: { lat: 6.4698, lng: 3.5852 }
        },
        pricing: {
          evPrice: 75
        },
        amenities: ["Fast Charging", "Cafe", "Parking", "Security"],
        operatingHours: {
          open: "00:00",
          close: "23:59",
          is24Hours: true
        },
        status: "operational",
        availability: {
          evChargers: {
            total: 8,
            available: 6,
            fastChargers: 4
          }
        },
        ownerId: "temp_user_5" as any,
        verified: true
      },
      {
        name: "Conoil Multi-Energy Station",
        type: "Both",
        location: {
          address: "Gwarinpa District, Abuja",
          city: "Abuja",
          state: "FCT",
          coordinates: { lat: 9.1092, lng: 7.4165 }
        },
        pricing: {
          cngPrice: 240,
          evPrice: 68
        },
        amenities: ["CNG", "EV Charging", "Petrol", "Diesel", "Shop"],
        operatingHours: {
          open: "00:00",
          close: "23:59",
          is24Hours: true
        },
        status: "operational",
        availability: {
          cngAvailable: true,
          evChargers: {
            total: 4,
            available: 3,
            fastChargers: 2
          }
        },
        ownerId: "temp_user_6" as any,
        verified: true
      }
    ];

    for (const station of stations) {
      await ctx.db.insert("stations", station);
    }

    // Create vehicle compatibility data
    const vehicleCompatibility = [
      {
        make: "Toyota",
        model: "Camry",
        yearRange: { start: 2010, end: 2024 },
        engineTypes: ["petrol"],
        conversionTypes: ["CNG", "EV"],
        estimatedCost: { cng: 750000, ev: 3200000 },
        notes: "Popular choice for CNG conversion. EV conversion requires battery pack upgrade."
      },
      {
        make: "Honda",
        model: "Accord",
        yearRange: { start: 2012, end: 2024 },
        engineTypes: ["petrol"],
        conversionTypes: ["CNG", "EV"],
        estimatedCost: { cng: 780000, ev: 3400000 },
        notes: "Excellent compatibility with both conversion types."
      },
      {
        make: "Nissan",
        model: "Altima",
        yearRange: { start: 2013, end: 2024 },
        engineTypes: ["petrol"],
        conversionTypes: ["CNG", "EV"],
        estimatedCost: { cng: 720000, ev: 3100000 },
        notes: "Good fuel efficiency makes it ideal for conversions."
      },
      {
        make: "Hyundai",
        model: "Elantra",
        yearRange: { start: 2011, end: 2024 },
        engineTypes: ["petrol"],
        conversionTypes: ["CNG"],
        estimatedCost: { cng: 680000 },
        notes: "CNG conversion only. Compact design limits EV battery placement."
      }
    ];

    for (const vehicle of vehicleCompatibility) {
      await ctx.db.insert("vehicleCompatibility", vehicle);
    }

    // Create sample articles
    const articles = [
      {
        title: "Understanding CNG Conversion: A Complete Guide",
        content: "Compressed Natural Gas (CNG) conversion is becoming increasingly popular in Nigeria as a cost-effective alternative to petrol...",
        category: "benefits",
        tags: ["CNG", "conversion", "savings", "environment"],
        authorId: "temp_user_1" as any,
        published: true,
        featured: true,
        readTime: 8
      },
      {
        title: "Government Incentives for Clean Vehicle Adoption",
        content: "The Nigerian government has introduced several incentives to encourage the adoption of clean vehicles...",
        category: "government",
        tags: ["incentives", "policy", "government", "subsidies"],
        authorId: "temp_user_1" as any,
        published: true,
        featured: true,
        readTime: 6
      },
      {
        title: "Safety Guidelines for CNG Vehicle Operation",
        content: "Operating a CNG vehicle requires understanding specific safety protocols to ensure safe and efficient use...",
        category: "safety",
        tags: ["safety", "CNG", "guidelines", "maintenance"],
        authorId: "temp_user_1" as any,
        published: true,
        featured: false,
        readTime: 10
      }
    ];

    for (const article of articles) {
      await ctx.db.insert("articles", article);
    }

    return { message: "Database seeded successfully" };
  }
});
