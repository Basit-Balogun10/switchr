import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FilterModal } from "./FilterModal";
import { StationProfileModal } from "./ProfileModals";

export function StationMap() {
    const [viewMode, setViewMode] = useState<"map" | "list">("list");
    const [filters, setFilters] = useState({
        type: "",
        city: "",
    });
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedStation, setSelectedStation] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const cityAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
        null
    );

    const stations = useQuery(api.stations.list, filters);
    const displayStations = stations || [];

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
    const calculateDistance = (station: any) => {
        if (!userLocation) return null;

        const R = 6371; // Earth's radius in km
        const dLat =
            ((station.location.coordinates.lat - userLocation.lat) * Math.PI) /
            180;
        const dLon =
            ((station.location.coordinates.lng - userLocation.lng) * Math.PI) /
            180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLocation.lat * Math.PI) / 180) *
                Math.cos((station.location.coordinates.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const nearestStations = userLocation
        ? displayStations
              .map((station) => ({
                  ...station,
                  distance: calculateDistance(station),
              }))
              .filter((station) => station.distance !== null)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 5)
        : [];

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                    Station Locator
                </h1>
                <p className="text-white/70">
                    Find CNG and EV charging stations near you
                </p>
            </div>

            {/* Find Nearest Stations */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Find Nearest Stations
                        </h3>
                        <p className="text-white/70">
                            Locate the closest CNG and EV stations to your
                            location
                        </p>
                    </div>
                    <button
                        onClick={getCurrentLocation}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                    >
                        <span>Find Nearest</span>
                    </button>
                </div>

                {nearestStations.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-white font-medium mb-3">
                            Nearest Stations:
                        </h4>
                        <div className="grid gap-3">
                            {nearestStations.map((station) => (
                                <div
                                    key={station._id}
                                    className="bg-white/10 rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <span className="text-white font-medium">
                                            {station.name}
                                        </span>
                                        <p className="text-white/60 text-sm">
                                            {station.location.address}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-green-300 font-medium">
                                            {station.distance?.toFixed(1)} km
                                        </span>
                                        <p className="text-white/60 text-sm">
                                            {station.type}
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
                            Station Type
                        </label>
                        <div className="relative">
                            <select
                                value={filters.type}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        type: e.target.value,
                                    }))
                                }
                                className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer backdrop-blur-sm hover:bg-white/10 transition-colors"
                                style={{
                                    backgroundImage: 'none',
                                    color: 'white',
                                }}
                            >
                                <option
                                    value=""
                                    className="bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    All Types
                                </option>
                                <option
                                    value="CNG"
                                    className="bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    CNG Only
                                </option>
                                <option
                                    value="EV"
                                    className="bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    EV Only
                                </option>
                                <option
                                    value="Both"
                                    className="bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    Both CNG & EV
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-white/60"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
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
                    Showing {displayStations.length} stations
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
                                Showing {displayStations.length} stations
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayStations.map((station) => (
                        <div
                            key={station._id}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all cursor-pointer"
                            onClick={() => setSelectedStation(station)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {station.name}
                                </h3>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        station.status === "operational"
                                            ? "bg-green-500/20 text-green-300"
                                            : station.status === "maintenance"
                                              ? "bg-yellow-500/20 text-yellow-300"
                                              : "bg-red-500/20 text-red-300"
                                    }`}
                                >
                                    {station.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-white/60 text-sm">
                                    <span className="mr-2">📍</span>
                                    {station.location.address}
                                </div>
                                <div className="flex items-center text-white/60 text-sm">
                                    <span className="mr-2">🕒</span>
                                    {station.operatingHours.is24Hours
                                        ? "24/7"
                                        : `${station.operatingHours.open} - ${station.operatingHours.close}`}
                                </div>
                                {station.verified && (
                                    <span className="text-green-300 text-sm">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>

                            {/* Station Type */}
                            <div className="mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        station.type === "CNG"
                                            ? "bg-blue-500/20 text-blue-300"
                                            : station.type === "EV"
                                              ? "bg-purple-500/20 text-purple-300"
                                              : "bg-green-500/20 text-green-300"
                                    }`}
                                >
                                    {station.type}
                                </span>
                            </div>

                            {/* Availability Status */}
                            <div className="space-y-2 mb-4">
                                {station.availability.cngAvailable !==
                                    undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70 text-sm">
                                            CNG
                                        </span>
                                        <span
                                            className={`text-sm ${
                                                station.availability
                                                    .cngAvailable
                                                    ? "text-green-300"
                                                    : "text-red-300"
                                            }`}
                                        >
                                            {station.availability.cngAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </div>
                                )}
                                {station.availability.evChargers && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70 text-sm">
                                            EV Chargers
                                        </span>
                                        <span className="text-green-300 text-sm">
                                            {
                                                station.availability.evChargers
                                                    .available
                                            }
                                            /
                                            {
                                                station.availability.evChargers
                                                    .total
                                            }{" "}
                                            available
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="space-y-1 mb-4">
                                {station.pricing.cngPrice && (
                                    <div className="text-white/70 text-sm">
                                        CNG: ₦{station.pricing.cngPrice}/SCM
                                    </div>
                                )}
                                {station.pricing.evPrice && (
                                    <div className="text-white/70 text-sm">
                                        EV: ₦{station.pricing.evPrice}/kWh
                                    </div>
                                )}
                            </div>

                            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-2 rounded-lg transition-all font-medium">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {displayStations.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-white/70 text-lg mb-2">
                        No stations found
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
                type="stations"
            />

            <StationProfileModal
                station={selectedStation}
                isOpen={!!selectedStation}
                onClose={() => setSelectedStation(null)}
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
