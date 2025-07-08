import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if data already exists
        const existingProviders = await ctx.db
            .query("users")
            .withIndex("by_userType", (q) => q.eq("userType", "provider"))
            .first();
        if (existingProviders) {
            return { message: "Database already seeded" };
        }

        // Create sample provider users (expanded to 20 entries)
        const providerData = [
            {
                email: "greentechautosolutions@switchr.ng",
                companyName: "GreenTech Auto Solutions",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Leading CNG conversion specialists with over 10 years of experience. We provide comprehensive conversion services with certified technicians and quality assurance.",
                location: {
                    address: "15 Adeola Odeku Street, Victoria Island",
                    city: "Lagos",
                    state: "Lagos",
                    coordinates: { lat: 6.4281, lng: 3.4219 },
                },
                services: ["CNG", "EV"],
                certifications: [
                    "NMDPRA Certified",
                    "ISO 9001",
                    "NADDC Approved",
                ],
                pricing: {
                    cngConversion: 750000,
                    evConversion: 3200000,
                },
                images: [],
                rating: 4.8,
                totalReviews: 127,
            },
            {
                email: "ecomotiongarage@switchr.ng",
                companyName: "EcoMotion Garage",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Specialized in electric vehicle conversions and hybrid systems. Our team of engineers ensures safe and efficient conversions.",
                location: {
                    address: "Plot 45, Ahmadu Bello Way, Garki",
                    city: "Abuja",
                    state: "FCT",
                    coordinates: { lat: 9.0579, lng: 7.4951 },
                },
                services: ["EV", "Hybrid"],
                certifications: ["NMDPRA Certified", "IEEE Member"],
                pricing: {
                    evConversion: 3800000,
                },
                images: [],
                rating: 4.6,
                totalReviews: 89,
            },
            {
                email: "cleanfuelmotors@switchr.ng",
                companyName: "CleanFuel Motors",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Affordable CNG conversion services with flexible payment plans. We make clean energy accessible to everyone.",
                location: {
                    address: "12 Bompai Road, Kano",
                    city: "Kano",
                    state: "Kano",
                    coordinates: { lat: 12.0022, lng: 8.5919 },
                },
                services: ["CNG"],
                certifications: ["NMDPRA Certified"],
                pricing: {
                    cngConversion: 680000,
                },
                images: [],
                rating: 4.4,
                totalReviews: 156,
            },
            {
                email: "powerdrivetechnologies@switchr.ng",
                companyName: "PowerDrive Technologies",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Premium electric vehicle conversion specialists. We transform your conventional vehicle into a powerful, eco-friendly electric machine.",
                location: {
                    address: "23 Opebi Road, Ikeja",
                    city: "Lagos",
                    state: "Lagos",
                    coordinates: { lat: 6.6018, lng: 3.3515 },
                },
                services: ["EV"],
                certifications: ["IEEE Member", "NADDC Approved"],
                pricing: {
                    evConversion: 4200000,
                },
                images: [],
                rating: 4.9,
                totalReviews: 73,
            },
            {
                email: "energymaxconversions@switchr.ng",
                companyName: "EnergyMax Conversions",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Full-service CNG and hybrid conversion center. Quality workmanship with 3-year warranty on all conversions.",
                location: {
                    address: "156 Aba Road, Port Harcourt",
                    city: "Port Harcourt",
                    state: "Rivers",
                    coordinates: { lat: 4.8156, lng: 7.0498 },
                },
                services: ["CNG", "Hybrid"],
                certifications: ["NMDPRA Certified", "ISO 9001"],
                pricing: {
                    cngConversion: 720000,
                },
                images: [],
                rating: 4.5,
                totalReviews: 142,
            },
            {
                email: "metrocleandrive@switchr.ng",
                companyName: "Metro Clean Drive",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Urban mobility solutions specializing in compact vehicle conversions. Perfect for city driving and commercial fleets.",
                location: {
                    address: "34 Ring Road, Ibadan",
                    city: "Ibadan",
                    state: "Oyo",
                    coordinates: { lat: 7.3775, lng: 3.947 },
                },
                services: ["CNG", "EV"],
                certifications: ["NMDPRA Certified"],
                pricing: {
                    cngConversion: 700000,
                    evConversion: 3600000,
                },
                images: [],
                rating: 4.3,
                totalReviews: 98,
            },
            {
                email: "techautosolutions@switchr.ng",
                companyName: "TechAuto Solutions",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Advanced automotive technology center. Cutting-edge equipment and expert technicians for all conversion types.",
                location: {
                    address: "67 Zaria Road, Kaduna",
                    city: "Kaduna",
                    state: "Kaduna",
                    coordinates: { lat: 10.5105, lng: 7.4165 },
                },
                services: ["CNG", "EV", "Hybrid"],
                certifications: [
                    "NMDPRA Certified",
                    "IEEE Member",
                    "NADDC Approved",
                ],
                pricing: {
                    cngConversion: 740000,
                    evConversion: 3900000,
                },
                images: [],
                rating: 4.7,
                totalReviews: 156,
            },
            {
                email: "gasplusautocenter@switchr.ng",
                companyName: "GasPlus Auto Center",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Nigeria's fastest growing CNG conversion network. Quick turnaround time and competitive pricing.",
                location: {
                    address: "89 Murtala Mohammed Way, Katsina",
                    city: "Katsina",
                    state: "Katsina",
                    coordinates: { lat: 12.9908, lng: 7.6017 },
                },
                services: ["CNG"],
                certifications: ["NMDPRA Certified"],
                pricing: {
                    cngConversion: 650000,
                },
                images: [],
                rating: 4.2,
                totalReviews: 87,
            },
            {
                email: "electrivehiclepro@switchr.ng",
                companyName: "ElectriVehicle Pro",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Professional electric vehicle conversion and maintenance services. Specializing in Tesla-grade battery systems.",
                location: {
                    address: "12 Independence Way, Enugu",
                    city: "Enugu",
                    state: "Enugu",
                    coordinates: { lat: 6.2649, lng: 7.3882 },
                },
                services: ["EV"],
                certifications: ["IEEE Member", "NADDC Approved"],
                pricing: {
                    evConversion: 4500000,
                },
                images: [],
                rating: 4.8,
                totalReviews: 62,
            },
            {
                email: "flexifuelsystems@switchr.ng",
                companyName: "FlexiFuel Systems",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Dual-fuel and hybrid vehicle specialists. Convert your car to run on multiple fuel types for maximum flexibility.",
                location: {
                    address: "78 Benin-Sapele Road, Benin City",
                    city: "Benin City",
                    state: "Edo",
                    coordinates: { lat: 6.335, lng: 5.6037 },
                },
                services: ["CNG", "Hybrid"],
                certifications: ["NMDPRA Certified", "ISO 9001"],
                pricing: {
                    cngConversion: 710000,
                },
                images: [],
                rating: 4.4,
                totalReviews: 134,
            },
            {
                email: "cleanmotionworkshop@switchr.ng",
                companyName: "CleanMotion Workshop",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Eco-friendly vehicle conversions with solar charging integration. Sustainable mobility solutions for the future.",
                location: {
                    address: "45 Calabar Road, Uyo",
                    city: "Uyo",
                    state: "Akwa Ibom",
                    coordinates: { lat: 5.0104, lng: 7.8737 },
                },
                services: ["EV", "Hybrid"],
                certifications: ["IEEE Member", "NADDC Approved"],
                pricing: {
                    evConversion: 3700000,
                },
                images: [],
                rating: 4.6,
                totalReviews: 91,
            },
            {
                email: "autogreenigeria@switchr.ng",
                companyName: "AutoGreen Nigeria",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Comprehensive green vehicle solutions. From conversion to maintenance, we handle all your clean mobility needs.",
                location: {
                    address: "23 Lokoja Road, Ilorin",
                    city: "Ilorin",
                    state: "Kwara",
                    coordinates: { lat: 8.5378, lng: 4.5518 },
                },
                services: ["CNG", "EV"],
                certifications: ["NMDPRA Certified", "ISO 9001"],
                pricing: {
                    cngConversion: 690000,
                    evConversion: 3400000,
                },
                images: [],
                rating: 4.3,
                totalReviews: 78,
            },
            {
                email: "megadriveconversions@switchr.ng",
                companyName: "MegaDrive Conversions",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Heavy-duty vehicle conversion specialists. Converting trucks, buses, and commercial vehicles to clean energy.",
                location: {
                    address: "156 Warri-Sapele Road, Warri",
                    city: "Warri",
                    state: "Delta",
                    coordinates: { lat: 5.5557, lng: 5.7826 },
                },
                services: ["CNG"],
                certifications: ["NMDPRA Certified", "NADDC Approved"],
                pricing: {
                    cngConversion: 890000,
                },
                images: [],
                rating: 4.5,
                totalReviews: 112,
            },
            {
                email: "electromobilehub@switchr.ng",
                companyName: "ElectroMobile Hub",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Modern electric vehicle conversion facility with state-of-the-art equipment and certified technicians.",
                location: {
                    address: "67 Ogbomoso Road, Osogbo",
                    city: "Osogbo",
                    state: "Osun",
                    coordinates: { lat: 7.7719, lng: 4.5407 },
                },
                services: ["EV"],
                certifications: ["IEEE Member"],
                pricing: {
                    evConversion: 3300000,
                },
                images: [],
                rating: 4.4,
                totalReviews: 59,
            },
            {
                email: "greenlinemotors@switchr.ng",
                companyName: "GreenLine Motors",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Budget-friendly CNG conversions without compromising on quality. Flexible payment plans available.",
                location: {
                    address: "34 Minna Road, Suleja",
                    city: "Suleja",
                    state: "Niger",
                    coordinates: { lat: 9.1801, lng: 7.1799 },
                },
                services: ["CNG"],
                certifications: ["NMDPRA Certified"],
                pricing: {
                    cngConversion: 620000,
                },
                images: [],
                rating: 4.1,
                totalReviews: 95,
            },
            {
                email: "powershifttechnologies@switchr.ng",
                companyName: "PowerShift Technologies",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Advanced hybrid and electric vehicle solutions. Smart charging systems and energy management integration.",
                location: {
                    address: "89 Jos Road, Bauchi",
                    city: "Bauchi",
                    state: "Bauchi",
                    coordinates: { lat: 10.3157, lng: 9.8442 },
                },
                services: ["EV", "Hybrid"],
                certifications: ["IEEE Member", "NADDC Approved"],
                pricing: {
                    evConversion: 4100000,
                },
                images: [],
                rating: 4.7,
                totalReviews: 83,
            },
            {
                email: "ecodriveworkshop@switchr.ng",
                companyName: "EcoDrive Workshop",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Community-focused conversion center offering affordable clean vehicle solutions for everyday Nigerians.",
                location: {
                    address: "12 Sokoto Road, Kebbi",
                    city: "Birnin Kebbi",
                    state: "Kebbi",
                    coordinates: { lat: 12.4492, lng: 4.1975 },
                },
                services: ["CNG"],
                certifications: ["NMDPRA Certified"],
                pricing: {
                    cngConversion: 640000,
                },
                images: [],
                rating: 4.0,
                totalReviews: 67,
            },
            {
                email: "voltdrivesystems@switchr.ng",
                companyName: "VoltDrive Systems",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Premium electric vehicle conversions with luxury features. High-performance battery systems and smart connectivity.",
                location: {
                    address: "45 Gombe Road, Yola",
                    city: "Yola",
                    state: "Adamawa",
                    coordinates: { lat: 9.2004, lng: 12.4903 },
                },
                services: ["EV"],
                certifications: ["IEEE Member", "ISO 9001"],
                pricing: {
                    evConversion: 4800000,
                },
                images: [],
                rating: 4.9,
                totalReviews: 41,
            },
            {
                email: "cleanfuelexpress@switchr.ng",
                companyName: "CleanFuel Express",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Fast and reliable CNG conversion services. Same-day conversions available for most vehicle types.",
                location: {
                    address: "78 Maiduguri Road, Damaturu",
                    city: "Damaturu",
                    state: "Yobe",
                    coordinates: { lat: 11.7479, lng: 11.9608 },
                },
                services: ["CNG"],
                certifications: ["NMDPRA Certified"],
                pricing: {
                    cngConversion: 670000,
                },
                images: [],
                rating: 4.2,
                totalReviews: 104,
            },
            {
                email: "smartmobilitysolutions@switchr.ng",
                companyName: "SmartMobility Solutions",
                userType: "provider" as const,
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
                description:
                    "Integrated mobility solutions combining CNG, EV, and smart vehicle technology for the connected future.",
                location: {
                    address: "23 Dutse Road, Kano",
                    city: "Kano",
                    state: "Kano",
                    coordinates: { lat: 11.9804, lng: 8.5201 },
                },
                services: ["CNG", "EV", "Hybrid"],
                certifications: [
                    "NMDPRA Certified",
                    "IEEE Member",
                    "NADDC Approved",
                ],
                pricing: {
                    cngConversion: 760000,
                    evConversion: 3950000,
                },
                images: [],
                rating: 4.8,
                totalReviews: 167,
            },
        ];

        // Create sample stations (expanded to 20 entries)
        const stations = [
            {
                name: "Total CNG Station Victoria Island",
                type: "CNG",
                location: {
                    address: "Tiamiyu Savage Street, Victoria Island",
                    city: "Lagos",
                    state: "Lagos",
                    coordinates: { lat: 6.4474, lng: 3.4044 },
                },
                pricing: {
                    cngPrice: 230,
                },
                amenities: ["ATM", "Convenience Store", "Restroom", "WiFi"],
                operatingHours: {
                    open: "06:00",
                    close: "22:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
                verified: true,
            },
            {
                name: "Nipco EV Charging Hub",
                type: "EV",
                location: {
                    address: "Lekki Phase 1, Lagos",
                    city: "Lagos",
                    state: "Lagos",
                    coordinates: { lat: 6.4698, lng: 3.5852 },
                },
                pricing: {
                    evPrice: 75,
                },
                amenities: ["Fast Charging", "Cafe", "Parking", "Security"],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 8,
                        available: 6,
                        fastChargers: 4,
                    },
                },
            },
            {
                name: "Conoil Multi-Energy Station",
                type: "Both",
                location: {
                    address: "Gwarinpa District, Abuja",
                    city: "Abuja",
                    state: "FCT",
                    coordinates: { lat: 9.1092, lng: 7.4165 },
                },
                pricing: {
                    cngPrice: 240,
                    evPrice: 68,
                },
                amenities: ["CNG", "EV Charging", "Petrol", "Diesel", "Shop"],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                    evChargers: {
                        total: 4,
                        available: 3,
                        fastChargers: 2,
                    },
                },
            },
            {
                name: "Shell CNG Ikeja",
                type: "CNG",
                location: {
                    address: "Oba Akran Avenue, Ikeja",
                    city: "Lagos",
                    state: "Lagos",
                    coordinates: { lat: 6.6018, lng: 3.3515 },
                },
                pricing: {
                    cngPrice: 225,
                },
                amenities: ["ATM", "Restroom", "Car Wash"],
                operatingHours: {
                    open: "05:30",
                    close: "23:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
            },
            {
                name: "Mobil SuperCharger Abuja",
                type: "EV",
                location: {
                    address: "Central Business District, Abuja",
                    city: "Abuja",
                    state: "FCT",
                    coordinates: { lat: 9.0579, lng: 7.4951 },
                },
                pricing: {
                    evPrice: 80,
                },
                amenities: [
                    "Ultra Fast Charging",
                    "VIP Lounge",
                    "WiFi",
                    "Restaurant",
                ],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 12,
                        available: 9,
                        fastChargers: 8,
                    },
                },
            },
            {
                name: "NNPC CNG Port Harcourt",
                type: "CNG",
                location: {
                    address: "Aba Road, Port Harcourt",
                    city: "Port Harcourt",
                    state: "Rivers",
                    coordinates: { lat: 4.8156, lng: 7.0498 },
                },
                pricing: {
                    cngPrice: 235,
                },
                amenities: ["ATM", "Convenience Store", "Security"],
                operatingHours: {
                    open: "06:00",
                    close: "22:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
            },
            {
                name: "Tesla Supercharger Lekki",
                type: "EV",
                location: {
                    address: "Admiralty Way, Lekki Phase 1",
                    city: "Lagos",
                    state: "Lagos",
                    coordinates: { lat: 6.4698, lng: 3.5852 },
                },
                pricing: {
                    evPrice: 85,
                },
                amenities: ["Ultra Fast Charging", "Tesla Exclusive", "Lounge"],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 16,
                        available: 12,
                        fastChargers: 16,
                    },
                },
            },
            {
                name: "Oando Energy Hub Kano",
                type: "Both",
                location: {
                    address: "Bompai Road, Kano",
                    city: "Kano",
                    state: "Kano",
                    coordinates: { lat: 12.0022, lng: 8.5919 },
                },
                pricing: {
                    cngPrice: 245,
                    evPrice: 70,
                },
                amenities: ["CNG", "EV Charging", "Restaurant", "Prayer Room"],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                    evChargers: {
                        total: 6,
                        available: 4,
                        fastChargers: 3,
                    },
                },
            },
            {
                name: "Forte Oil CNG Ibadan",
                type: "CNG",
                location: {
                    address: "Ring Road, Ibadan",
                    city: "Ibadan",
                    state: "Oyo",
                    coordinates: { lat: 7.3775, lng: 3.947 },
                },
                pricing: {
                    cngPrice: 220,
                },
                amenities: ["ATM", "Restroom", "Convenience Store"],
                operatingHours: {
                    open: "05:00",
                    close: "23:30",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
            },
            {
                name: "Bolt Charging Station Kaduna",
                type: "EV",
                location: {
                    address: "Constitution Road, Kaduna",
                    city: "Kaduna",
                    state: "Kaduna",
                    coordinates: { lat: 10.5105, lng: 7.4165 },
                },
                pricing: {
                    evPrice: 65,
                },
                amenities: ["Fast Charging", "WiFi", "Security", "Parking"],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 6,
                        available: 5,
                        fastChargers: 4,
                    },
                },
            },
            {
                name: "Petrocam Multi-Station Enugu",
                type: "Both",
                location: {
                    address: "Ogui Road, Enugu",
                    city: "Enugu",
                    state: "Enugu",
                    coordinates: { lat: 6.2649, lng: 7.3882 },
                },
                pricing: {
                    cngPrice: 238,
                    evPrice: 72,
                },
                amenities: ["CNG", "EV Charging", "ATM", "Restaurant"],
                operatingHours: {
                    open: "06:00",
                    close: "22:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                    evChargers: {
                        total: 5,
                        available: 3,
                        fastChargers: 2,
                    },
                },
            },
            {
                name: "AP CNG Station Warri",
                type: "CNG",
                location: {
                    address: "Warri-Sapele Road, Warri",
                    city: "Warri",
                    state: "Delta",
                    coordinates: { lat: 5.5557, lng: 5.7826 },
                },
                pricing: {
                    cngPrice: 242,
                },
                amenities: ["ATM", "Restroom", "Security"],
                operatingHours: {
                    open: "06:00",
                    close: "22:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
            },
            {
                name: "EVHub Charging Center Benin",
                type: "EV",
                location: {
                    address: "Airport Road, Benin City",
                    city: "Benin City",
                    state: "Edo",
                    coordinates: { lat: 6.335, lng: 5.6037 },
                },
                pricing: {
                    evPrice: 73,
                },
                amenities: ["Fast Charging", "Cafe", "WiFi"],
                operatingHours: {
                    open: "07:00",
                    close: "21:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 4,
                        available: 4,
                        fastChargers: 2,
                    },
                },
            },
            {
                name: "MRS CNG Ilorin",
                type: "CNG",
                location: {
                    address: "Ilorin-Lagos Road, Ilorin",
                    city: "Ilorin",
                    state: "Kwara",
                    coordinates: { lat: 8.5378, lng: 4.5518 },
                },
                pricing: {
                    cngPrice: 228,
                },
                amenities: ["ATM", "Convenience Store", "Car Wash"],
                operatingHours: {
                    open: "05:30",
                    close: "23:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
            },
            {
                name: "PowerMax EV Station Uyo",
                type: "EV",
                location: {
                    address: "Ikot Ekpene Road, Uyo",
                    city: "Uyo",
                    state: "Akwa Ibom",
                    coordinates: { lat: 5.0104, lng: 7.8737 },
                },
                pricing: {
                    evPrice: 68,
                },
                amenities: ["Fast Charging", "Security", "Parking"],
                operatingHours: {
                    open: "08:00",
                    close: "20:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 3,
                        available: 2,
                        fastChargers: 1,
                    },
                },
            },
            {
                name: "Integrated Energy Hub Jos",
                type: "Both",
                location: {
                    address: "Yakubu Gowon Way, Jos",
                    city: "Jos",
                    state: "Plateau",
                    coordinates: { lat: 9.8965, lng: 8.8583 },
                },
                pricing: {
                    cngPrice: 250,
                    evPrice: 78,
                },
                amenities: ["CNG", "EV Charging", "Restaurant", "ATM"],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                    evChargers: {
                        total: 7,
                        available: 5,
                        fastChargers: 4,
                    },
                },
            },
            {
                name: "Northwest CNG Sokoto",
                type: "CNG",
                location: {
                    address: "Sultan Abubakar Road, Sokoto",
                    city: "Sokoto",
                    state: "Sokoto",
                    coordinates: { lat: 13.0059, lng: 5.2476 },
                },
                pricing: {
                    cngPrice: 255,
                },
                amenities: ["ATM", "Restroom", "Security"],
                operatingHours: {
                    open: "06:00",
                    close: "22:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
            },
            {
                name: "CleanCharge EV Maiduguri",
                type: "EV",
                location: {
                    address: "Bama Road, Maiduguri",
                    city: "Maiduguri",
                    state: "Borno",
                    coordinates: { lat: 11.8469, lng: 13.1571 },
                },
                pricing: {
                    evPrice: 69,
                },
                amenities: ["Fast Charging", "Security", "WiFi"],
                operatingHours: {
                    open: "07:00",
                    close: "19:00",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    evChargers: {
                        total: 4,
                        available: 3,
                        fastChargers: 2,
                    },
                },
            },
            {
                name: "Total Energy Complex Asaba",
                type: "Both",
                location: {
                    address: "Nnebisi Road, Asaba",
                    city: "Asaba",
                    state: "Delta",
                    coordinates: { lat: 6.2104, lng: 6.7693 },
                },
                pricing: {
                    cngPrice: 240,
                    evPrice: 74,
                },
                amenities: [
                    "CNG",
                    "EV Charging",
                    "Restaurant",
                    "ATM",
                    "Restroom",
                ],
                operatingHours: {
                    open: "00:00",
                    close: "23:59",
                    is24Hours: true,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                    evChargers: {
                        total: 8,
                        available: 6,
                        fastChargers: 5,
                    },
                },
            },
            {
                name: "GreenFuel Station Gombe",
                type: "CNG",
                location: {
                    address: "Bauchi Road, Gombe",
                    city: "Gombe",
                    state: "Gombe",
                    coordinates: { lat: 10.2897, lng: 11.1689 },
                },
                pricing: {
                    cngPrice: 248,
                },
                amenities: ["ATM", "Convenience Store", "Prayer Room"],
                operatingHours: {
                    open: "05:30",
                    close: "22:30",
                    is24Hours: false,
                },
                status: "operational",
                availability: {
                    cngAvailable: true,
                },
                verified: true,
            },
        ];

        // Create provider users
        for (const provider of providerData) {
            await ctx.db.insert("users", provider);
        }

        // Create stations with proper user association
        for (const station of stations) {
            // Create a sample station owner user for each station
            const stationOwnerId = await ctx.db.insert("users", {
                email: `${station.name.toLowerCase().replace(/\s+/g, "")}@energy.ng`,
                companyName: station.name,
                userType: "provider",
                isVerified: true,
                isEmailVerified: true,
                createdAt: Date.now(),
                preferences: {
                    notifications: true,
                    newsletter: false,
                    language: "en",
                },
            });

            await ctx.db.insert("stations", {
                ...station,
                ownerId: stationOwnerId,
                verified: station.verified ?? true, // Default to true if not specified
            });
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
                notes: "Popular choice for CNG conversion. EV conversion requires battery pack upgrade.",
            },
            {
                make: "Honda",
                model: "Accord",
                yearRange: { start: 2012, end: 2024 },
                engineTypes: ["petrol"],
                conversionTypes: ["CNG", "EV"],
                estimatedCost: { cng: 780000, ev: 3400000 },
                notes: "Excellent compatibility with both conversion types.",
            },
            {
                make: "Nissan",
                model: "Altima",
                yearRange: { start: 2013, end: 2024 },
                engineTypes: ["petrol"],
                conversionTypes: ["CNG", "EV"],
                estimatedCost: { cng: 720000, ev: 3100000 },
                notes: "Good fuel efficiency makes it ideal for conversions.",
            },
            {
                make: "Hyundai",
                model: "Elantra",
                yearRange: { start: 2011, end: 2024 },
                engineTypes: ["petrol"],
                conversionTypes: ["CNG"],
                estimatedCost: { cng: 680000 },
                notes: "CNG conversion only. Compact design limits EV battery placement.",
            },
        ];

        for (const vehicle of vehicleCompatibility) {
            await ctx.db.insert("vehicleCompatibility", vehicle);
        }

        return { message: "Database seeded successfully" };
    },
});
