import React, { useState } from "react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: any;
    onApplyFilters: (filters: any) => void;
    type: "providers" | "stations";
}

export function FilterModal({
    isOpen,
    onClose,
    filters,
    onApplyFilters,
    type,
}: FilterModalProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    if (!isOpen) return null;

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters =
            type === "providers"
                ? { city: "", services: [] }
                : { city: "", type: "" };
        setLocalFilters(resetFilters);
        onApplyFilters(resetFilters);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {type === "providers"
                            ? "Provider Filters"
                            : "Station Filters"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* City Filter */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            value={localFilters.city}
                            onChange={(e) =>
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                }))
                            }
                            className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                            placeholder="Enter city name"
                        />
                    </div>

                    {type === "providers" ? (
                        <>
                            {/* Services Filter */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Services
                                </label>
                                <div className="space-y-2">
                                    {["CNG", "EV", "Hybrid"].map((service) => (
                                        <label
                                            key={service}
                                            className="flex items-center space-x-3 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    localFilters.services?.includes(
                                                        service
                                                    ) || false
                                                }
                                                onChange={(e) => {
                                                    const services =
                                                        localFilters.services ||
                                                        [];
                                                    if (e.target.checked) {
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                services: [
                                                                    ...services,
                                                                    service,
                                                                ],
                                                            })
                                                        );
                                                    } else {
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                services:
                                                                    services.filter(
                                                                        (s) =>
                                                                            s !==
                                                                            service
                                                                    ),
                                                            })
                                                        );
                                                    }
                                                }}
                                                className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400"
                                            />
                                            <span className="text-white">
                                                {service}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Minimum Rating
                                </label>
                                <div className="relative">
                                    <select
                                        value={localFilters.minRating || ""}
                                        onChange={(e) =>
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                minRating: e.target.value,
                                            }))
                                        }
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer"
                                    >
                                        <option
                                            value=""
                                            className="bg-gray-800 text-white"
                                        >
                                            Any Rating
                                        </option>
                                        <option
                                            value="4"
                                            className="bg-gray-800 text-white"
                                        >
                                            4+ Stars
                                        </option>
                                        <option
                                            value="4.5"
                                            className="bg-gray-800 text-white"
                                        >
                                            4.5+ Stars
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
                        </>
                    ) : (
                        <>
                            {/* Station Type Filter */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Station Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={localFilters.type || ""}
                                        onChange={(e) =>
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer"
                                    >
                                        <option
                                            value=""
                                            className="bg-gray-800 text-white"
                                        >
                                            All Types
                                        </option>
                                        <option
                                            value="CNG"
                                            className="bg-gray-800 text-white"
                                        >
                                            CNG Only
                                        </option>
                                        <option
                                            value="EV"
                                            className="bg-gray-800 text-white"
                                        >
                                            EV Only
                                        </option>
                                        <option
                                            value="Both"
                                            className="bg-gray-800 text-white"
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

                            {/* Amenities Filter */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Amenities
                                </label>
                                <div className="space-y-2">
                                    {[
                                        "ATM",
                                        "Convenience Store",
                                        "Restroom",
                                        "WiFi",
                                        "24/7 Access",
                                    ].map((amenity) => (
                                        <label
                                            key={amenity}
                                            className="flex items-center space-x-3 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    localFilters.amenities?.includes(
                                                        amenity
                                                    ) || false
                                                }
                                                onChange={(e) => {
                                                    const amenities =
                                                        localFilters.amenities ||
                                                        [];
                                                    if (e.target.checked) {
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                amenities: [
                                                                    ...amenities,
                                                                    amenity,
                                                                ],
                                                            })
                                                        );
                                                    } else {
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                amenities:
                                                                    amenities.filter(
                                                                        (a) =>
                                                                            a !==
                                                                            amenity
                                                                    ),
                                                            })
                                                        );
                                                    }
                                                }}
                                                className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400"
                                            />
                                            <span className="text-white text-sm">
                                                {amenity}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={handleReset}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg transition-all font-medium"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
