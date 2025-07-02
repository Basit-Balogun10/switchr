import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkVehicle = query({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const compatibility = await ctx.db
      .query("vehicleCompatibility")
      .withIndex("by_model", (q) => 
        q.eq("make", args.make).eq("model", args.model)
      )
      .first();

    if (!compatibility) {
      return {
        compatible: false,
        message: "Vehicle compatibility data not available. Please contact a certified provider for assessment.",
      };
    }

    const isYearInRange = 
      args.year >= compatibility.yearRange.start && 
      args.year <= compatibility.yearRange.end;

    if (!isYearInRange) {
      return {
        compatible: false,
        message: `${args.make} ${args.model} ${args.year} is outside the supported year range (${compatibility.yearRange.start}-${compatibility.yearRange.end}).`,
      };
    }

    return {
      compatible: true,
      conversionTypes: compatibility.conversionTypes,
      estimatedCost: compatibility.estimatedCost,
      notes: compatibility.notes,
      message: `Your ${args.make} ${args.model} ${args.year} is compatible with ${compatibility.conversionTypes.join(", ")} conversion.`,
    };
  },
});

export const calculateSavings = query({
  args: {
    currentFuelType: v.string(), // "petrol" | "diesel"
    monthlyDistance: v.number(), // in km
    fuelEfficiency: v.number(), // km per liter
    conversionType: v.string(), // "CNG" | "EV"
  },
  handler: async (ctx, args) => {
    // Current fuel prices in Nigeria (example rates)
    const fuelPrices = {
      petrol: 617, // NGN per liter
      diesel: 1100, // NGN per liter
      cng: 230, // NGN per SCM (equivalent)
      electricity: 68, // NGN per kWh
    };

    const monthlyFuelConsumption = args.monthlyDistance / args.fuelEfficiency;
    const currentMonthlyCost = monthlyFuelConsumption * fuelPrices[args.currentFuelType as keyof typeof fuelPrices];

    let newMonthlyCost = 0;
    let conversionCost = 0;

    if (args.conversionType === "CNG") {
      // CNG efficiency is typically 20-30% better than petrol
      const cngEfficiency = args.fuelEfficiency * 1.25;
      const cngConsumption = args.monthlyDistance / cngEfficiency;
      newMonthlyCost = cngConsumption * fuelPrices.cng;
      conversionCost = 800000; // Average CNG conversion cost in NGN
    } else if (args.conversionType === "EV") {
      // EV efficiency: approximately 6 km per kWh
      const evEfficiency = 6;
      const electricityConsumption = args.monthlyDistance / evEfficiency;
      newMonthlyCost = electricityConsumption * fuelPrices.electricity;
      conversionCost = 3500000; // Average EV conversion cost in NGN
    }

    const monthlySavings = currentMonthlyCost - newMonthlyCost;
    const annualSavings = monthlySavings * 12;
    const paybackPeriod = conversionCost / monthlySavings; // in months

    return {
      currentMonthlyCost: Math.round(currentMonthlyCost),
      newMonthlyCost: Math.round(newMonthlyCost),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      conversionCost,
      paybackPeriod: Math.round(paybackPeriod),
      fiveYearSavings: Math.round(annualSavings * 5 - conversionCost),
    };
  },
});
