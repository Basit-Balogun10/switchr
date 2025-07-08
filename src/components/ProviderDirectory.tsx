import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FilterModal } from "./FilterModal";
import { ProviderProfileModal } from "./ProfileModals";

export function ProviderDirectory() {
    const [viewMode, setViewMode] = useState<"map" | "list">("list");
    const [filters, setFilters] = useState({
        city: "",
        services: [] as string[],
    });
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const cityAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
        null
    );

    const providers = useQuery(api.users.listProviders, {
        city: filters.city || undefined,
        services: filters.services.length > 0 ? filters.services : undefined,
    });
    const displayProviders = providers || [];

    // Initialize Google Places Autocomplete for city
    useEffect(() => {
        if (window.google && cityInputRef.current) {
            cityAutocompleteRef.current = new google.maps.places.Autocomplete(
                cityInputRef.current,
                {
                    componentRestrictions: { country: "ng" },
                    types: ["(cities)"],
                    fields: ["name"],
                }
            );

            cityAutocompleteRef.current.addListener("place_changed", () => {
                const place = cityAutocompleteRef.current?.getPlace();
                if (place && place.name) {
                    setFilters((prev) => ({ ...prev, city: place.name || "" }));
                }
            });
        }
    }, []);

    // Get user's current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });

                    // Reverse geocode to get city name
                    if (window.google) {
                        const geocoder = new google.maps.Geocoder();
                        geocoder.geocode(
                            { location: { lat: latitude, lng: longitude } },
                            (results, status) => {
                                if (status === "OK" && results?.[0]) {
                                    const cityComponent =
                                        results[0].address_components?.find(
                                            (component) =>
                                                component.types.includes(
                                                    "locality"
                                                )
                                        );
                                    if (cityComponent) {
                                        setFilters((prev) => ({
                                            ...prev,
                                            city: cityComponent.long_name,
                                        }));
                                        if (cityInputRef.current) {
                                            cityInputRef.current.value =
                                                cityComponent.long_name;
                                        }
                                    }
                                }
                            }
                        );
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    };

    // Auto-populate user location on page load
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Calculate distance between two coordinates
    const calculateDistance = (provider: any) => {
        if (!userLocation) return null;

        const R = 6371; // Earth's radius in km
        const dLat =
            ((provider.location.coordinates.lat - userLocation.lat) * Math.PI) /
            180;
        const dLon =
            ((provider.location.coordinates.lng - userLocation.lng) * Math.PI) /
            180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLocation.lat * Math.PI) / 180) *
                Math.cos((provider.location.coordinates.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const nearestProviders = userLocation
        ? displayProviders
              .map((provider) => ({
                  ...provider,
                  distance: calculateDistance(provider),
              }))
              .filter((provider) => provider.distance !== null)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 5)
        : [];

    const handleServiceToggle = (service: string) => {
        setFilters((prev) => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter((s) => s !== service)
                : [...prev.services, service],
        }));
    };

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                    Find Providers
                </h1>
                <p className="text-white/70">
                    Discover verified conversion service providers near you
                </p>
            </div>

            {/* Find Nearest Providers */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Find Nearest Providers
                        </h3>
                        <p className="text-white/70">
                            Locate the closest conversion service providers to
                            your location
                        </p>
                    </div>
                    <button
                        onClick={getCurrentLocation}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                    >
                        <span>Find Nearest</span>
                    </button>
                </div>

                {nearestProviders.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-white font-medium mb-3">
                            Nearest Providers:
                        </h4>
                        <div className="grid gap-3">
                            {nearestProviders.map((provider) => (
                                <div
                                    key={provider._id}
                                    className="bg-white/10 rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <span className="text-white font-medium">
                                            {provider.name}
                                        </span>
                                        <p className="text-white/60 text-sm">
                                            {provider.location.city},{" "}
                                            {provider.location.state}
                                        </p>
                                        <div className="flex space-x-2 mt-1">
                                            {provider.services
                                                .slice(0, 2)
                                                .map((service: string) => (
                                                    <span
                                                        key={service}
                                                        className={`px-2 py-1 rounded text-xs ${
                                                            service === "CNG"
                                                                ? "bg-blue-500/20 text-blue-300"
                                                                : service ===
                                                                    "EV"
                                                                  ? "bg-purple-500/20 text-purple-300"
                                                                  : "bg-green-500/20 text-green-300"
                                                        }`}
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-green-300 font-medium">
                                            {provider.distance?.toFixed(1)} km
                                        </span>
                                        <p className="text-white/60 text-sm">
                                            ⭐ {provider.rating.toFixed(1)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Filters
                    </h3>
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                        Advanced Filters
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            City
                        </label>
                        <input
                            ref={cityInputRef}
                            type="text"
                            value={filters.city}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                }))
                            }
                            className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                            placeholder="Enter city name"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Services
                        </label>
                        <div className="flex space-x-2">
                            {["CNG", "EV", "Hybrid"].map((service) => (
                                <button
                                    key={service}
                                    onClick={() => handleServiceToggle(service)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filters.services.includes(service)
                                            ? "bg-green-500 text-white"
                                            : "bg-white/10 text-white/70 hover:bg-white/20"
                                    }`}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-between items-center">
                <div className="flex bg-white/10 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === "list"
                                ? "bg-white/20 text-white"
                                : "text-white/60 hover:text-white"
                        }`}
                    >
                        📋 List View
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === "map"
                                ? "bg-white/20 text-white"
                                : "text-white/60 hover:text-white"
                        }`}
                    >
                        🗺️ Map View
                    </button>
                </div>

                <div className="text-white/60 text-sm">
                    Showing {displayProviders.length} providers
                </div>
            </div>

            {/* Content */}
            {viewMode === "map" ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="bg-gray-800/50 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🗺️</div>
                            <p className="text-white/70">
                                Interactive map will be displayed here
                            </p>
                            <p className="text-white/50 text-sm">
                                Integration with Google Maps or OpenStreetMap
                            </p>
                            <div className="mt-4 text-white/60 text-sm">
                                Showing {displayProviders.length} providers
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProviders.map((provider) => (
                        <div
                            key={provider._id}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all cursor-pointer"
                            onClick={() => setSelectedProvider(provider)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {provider.name}
                                </h3>
                                {provider.verified && (
                                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>

                            <p className="text-white/70 mb-4 line-clamp-3">
                                {provider.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-white/60 text-sm">
                                    <span className="mr-2">📍</span>
                                    {provider.location.city},{" "}
                                    {provider.location.state}
                                </div>
                                <div className="flex items-center text-white/60 text-sm">
                                    <span className="mr-2">⭐</span>
                                    {provider.rating.toFixed(1)} (
                                    {provider.totalReviews} reviews)
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {provider.services.map((service) => (
                                    <span
                                        key={service}
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            service === "CNG"
                                                ? "bg-blue-500/20 text-blue-300"
                                                : service === "EV"
                                                  ? "bg-purple-500/20 text-purple-300"
                                                  : "bg-green-500/20 text-green-300"
                                        }`}
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-1 mb-4">
                                {provider.pricing.cngConversion && (
                                    <div className="text-white/70 text-sm">
                                        CNG: ₦
                                        {provider.pricing.cngConversion.toLocaleString()}
                                    </div>
                                )}
                                {provider.pricing.evConversion && (
                                    <div className="text-white/70 text-sm">
                                        EV: ₦
                                        {provider.pricing.evConversion.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg transition-all font-medium">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {displayProviders.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-white/70 text-lg mb-2">
                        No providers found
                    </p>
                    <p className="text-white/50">
                        Try adjusting your search criteria or location
                    </p>
                </div>
            )}

            {/* Modals */}
            <FilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
                type="providers"
            />

            <ProviderProfileModal
                provider={selectedProvider}
                isOpen={!!selectedProvider}
                onClose={() => setSelectedProvider(null)}
            />

            {/* Load Google Places API */}
            <script
                src={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`}
                async
                defer
            ></script>
        </div>
    );
}
