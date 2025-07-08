import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ProviderFormData {
    description: string;
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number } | null;
    services: string[];
    certifications: string[];
    cngPrice: string;
    evPrice: string;
}

const serviceOptions = [
    { value: "CNG", label: "CNG Conversion" },
    { value: "EV", label: "Electric Vehicle Conversion" },
    { value: "Hybrid", label: "Hybrid Systems" },
];

const certificationOptions = [
    "NMDPRA Certified",
    "ISO 9001",
    "NADDC Approved",
    "IEEE Member",
];

export function ProviderOnboarding() {
    const updateProfile = useMutation(api.users.updateProfile);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
        null
    );

    const [formData, setFormData] = useState<ProviderFormData>({
        description: "",
        address: "",
        city: "",
        state: "",
        coordinates: null,
        services: [],
        certifications: [],
        cngPrice: "",
        evPrice: "",
    });

    // Initialize Google Places Autocomplete
    useEffect(() => {
        if (window.google && addressInputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(
                addressInputRef.current,
                {
                    componentRestrictions: { country: "ng" },
                    fields: [
                        "address_components",
                        "formatted_address",
                        "geometry",
                    ],
                }
            );

            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current?.getPlace();
                if (place && place.geometry) {
                    setFormData((prev) => ({
                        ...prev,
                        address: place.formatted_address || "",
                        coordinates: {
                            lat: place.geometry!.location!.lat(),
                            lng: place.geometry!.location!.lng(),
                        },
                    }));

                    // Extract city and state from address components
                    if (place.address_components) {
                        let city = "";
                        let state = "";

                        place.address_components.forEach((component) => {
                            if (component.types.includes("locality")) {
                                city = component.long_name;
                            }
                            if (
                                component.types.includes(
                                    "administrative_area_level_1"
                                )
                            ) {
                                state = component.long_name;
                            }
                        });

                        setFormData((prev) => ({
                            ...prev,
                            city: city,
                            state: state,
                        }));
                    }
                }
            });
        }
    }, []);

    const handleServiceToggle = (service: string) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter((s) => s !== service)
                : [...prev.services, service],
        }));
    };

    const handleCertificationToggle = (certification: string) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications.includes(certification)
                ? prev.certifications.filter((c) => c !== certification)
                : [...prev.certifications, certification],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const pricing: any = {};
            if (formData.cngPrice)
                pricing.cngConversion = parseInt(formData.cngPrice);
            if (formData.evPrice)
                pricing.evConversion = parseInt(formData.evPrice);

            await updateProfile({
                description: formData.description,
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    coordinates: formData.coordinates || { lat: 0, lng: 0 },
                },
                services: formData.services,
                certifications: formData.certifications,
                pricing,
            });

            setSuccess(true);
        } catch (error) {
            console.error("Failed to update provider profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                    Application Submitted!
                </h2>
                <p className="text-white/70 mb-6">
                    Your provider application has been submitted successfully.
                    Our team will review your application and get back to you
                    within 2-3 business days.
                </p>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Next Steps:
                    </h3>
                    <ul className="text-white/70 text-left space-y-2">
                        <li>• Background verification and document review</li>
                        <li>• Technical capability assessment</li>
                        <li>• Profile approval and platform activation</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Provider Onboarding
                </h1>
                <p className="text-white/70">
                    Join our network of verified conversion service providers
                </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                            Company Information
                        </h3>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                placeholder="Enter your company name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Company Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={4}
                                className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                placeholder="Describe your services, experience, and what makes your company unique"
                                required
                            />
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                            Location Information
                        </h3>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Office Address *
                            </label>
                            <input
                                ref={addressInputRef}
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))
                                }
                                className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                placeholder="Start typing your address..."
                                required
                            />
                            <p className="text-white/50 text-sm mt-1">
                                Start typing to get address suggestions
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }))
                                    }
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                    placeholder="City"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }))
                                    }
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                    placeholder="State"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                            Services Offered *
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {serviceOptions.map((service) => (
                                <label
                                    key={service.value}
                                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        formData.services.includes(
                                            service.value
                                        )
                                            ? "border-green-400 bg-green-400/10"
                                            : "border-white/20 bg-white/5 hover:bg-white/10"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.services.includes(
                                            service.value
                                        )}
                                        onChange={() =>
                                            handleServiceToggle(service.value)
                                        }
                                        className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400"
                                    />
                                    <span className="text-white font-medium">
                                        {service.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                            Certifications
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {certificationOptions.map((cert) => (
                                <label
                                    key={cert}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        formData.certifications.includes(cert)
                                            ? "border-green-400 bg-green-400/10"
                                            : "border-white/20 bg-white/5 hover:bg-white/10"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.certifications.includes(
                                            cert
                                        )}
                                        onChange={() =>
                                            handleCertificationToggle(cert)
                                        }
                                        className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400"
                                    />
                                    <span className="text-white text-sm">
                                        {cert}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                            Pricing (Optional)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    CNG Conversion Price (₦)
                                </label>
                                <input
                                    type="number"
                                    value={formData.cngPrice}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            cngPrice: e.target.value,
                                        }))
                                    }
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                    placeholder="650000"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    EV Conversion Price (₦)
                                </label>
                                <input
                                    type="number"
                                    value={formData.evPrice}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            evPrice: e.target.value,
                                        }))
                                    }
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                                    placeholder="3200000"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || formData.services.length === 0}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-all"
                    >
                        {isLoading
                            ? "Submitting Application..."
                            : "Submit Application"}
                    </button>
                </form>
            </div>

            {/* Load Google Places API */}
            <script
                src={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`}
                async
                defer
            ></script>
        </div>
    );
}
