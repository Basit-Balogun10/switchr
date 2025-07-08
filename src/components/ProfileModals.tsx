import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ProviderProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: any;
}

interface StationProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    station: any;
}

export function ProviderProfileModal({
    isOpen,
    onClose,
    provider,
}: ProviderProfileModalProps) {
    const createBooking = useMutation(api.bookings.create);

    if (!isOpen || !provider) return null;

    const handleBookService = (conversionType: string) => {
        // This would typically open the booking system with pre-filled provider and conversion type
        // For now, we'll just close the modal and potentially navigate to booking
        console.log(
            `Booking ${conversionType} conversion with ${provider.name}`
        );
        onClose();
        // TODO: Navigate to booking system with prefilled data
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 max-w-2xl w-full mx-4 border border-white/20 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-semibold text-white">
                            {provider.name}
                        </h3>
                        {provider.verified && (
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-sm">
                                ✓ Verified
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Provider Details */}
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            About
                        </h4>
                        <p className="text-white/70">{provider.description}</p>
                    </div>

                    {/* Location */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Location
                        </h4>
                        <div className="space-y-1">
                            <p className="text-white/70">
                                {provider.location.address}
                            </p>
                            <p className="text-white/60">
                                {provider.location.city},{" "}
                                {provider.location.state}
                            </p>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {provider.services.map((service: string) => (
                                <span
                                    key={service}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                    </div>

                    {/* Certifications */}
                    {provider.certifications &&
                        provider.certifications.length > 0 && (
                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">
                                    Certifications
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {provider.certifications.map(
                                        (cert: string) => (
                                            <span
                                                key={cert}
                                                className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm"
                                            >
                                                {cert}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Pricing */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Pricing
                        </h4>
                        <div className="space-y-2">
                            {provider.pricing.cngConversion && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">
                                        CNG Conversion:
                                    </span>
                                    <span className="text-white font-medium">
                                        ₦
                                        {provider.pricing.cngConversion.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {provider.pricing.evConversion && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">
                                        EV Conversion:
                                    </span>
                                    <span className="text-white font-medium">
                                        ₦
                                        {provider.pricing.evConversion.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Rating
                        </h4>
                        <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white">
                                {provider.rating.toFixed(1)}
                            </span>
                            <span className="text-white/60">
                                ({provider.totalReviews} reviews)
                            </span>
                        </div>
                    </div>

                    {/* Book Service Buttons */}
                    <div className="border-t border-white/20 pt-6">
                        <h4 className="text-lg font-medium text-white mb-4">
                            Book a Service
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            {provider.services.includes("CNG") && (
                                <button
                                    onClick={() => handleBookService("CNG")}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-lg transition-all font-medium"
                                >
                                    Book CNG Conversion
                                </button>
                            )}
                            {provider.services.includes("EV") && (
                                <button
                                    onClick={() => handleBookService("EV")}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all font-medium"
                                >
                                    Book EV Conversion
                                </button>
                            )}
                            {provider.services.includes("Hybrid") && (
                                <button
                                    onClick={() => handleBookService("Hybrid")}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg transition-all font-medium"
                                >
                                    Book Hybrid Conversion
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StationProfileModal({
    isOpen,
    onClose,
    station,
}: StationProfileModalProps) {
    if (!isOpen || !station) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-xl p-6 max-w-2xl w-full mx-4 border border-white/20 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-semibold text-white">
                            {station.name}
                        </h3>
                        <span
                            className={`px-2 py-1 rounded-full text-sm ${
                                station.status === "operational"
                                    ? "bg-green-500/20 text-green-300"
                                    : station.status === "maintenance"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-red-500/20 text-red-300"
                            }`}
                        >
                            {station.status}
                        </span>
                        {station.verified && (
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm">
                                ✓ Verified
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Station Details */}
                <div className="space-y-6">
                    {/* Location */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Location
                        </h4>
                        <div className="space-y-1">
                            <p className="text-white/70">
                                {station.location.address}
                            </p>
                            <p className="text-white/60">
                                {station.location.city},{" "}
                                {station.location.state}
                            </p>
                        </div>
                    </div>

                    {/* Type & Availability */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Services Available
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">
                                    Station Type:
                                </span>
                                <span
                                    className={`px-2 py-1 rounded text-sm font-medium ${
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

                            {station.availability.cngAvailable !==
                                undefined && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">
                                        CNG Available:
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${
                                            station.availability.cngAvailable
                                                ? "text-green-300"
                                                : "text-red-300"
                                        }`}
                                    >
                                        {station.availability.cngAvailable
                                            ? "Yes"
                                            : "No"}
                                    </span>
                                </div>
                            )}

                            {station.availability.evChargers && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">
                                        EV Chargers:
                                    </span>
                                    <span className="text-green-300 text-sm font-medium">
                                        {
                                            station.availability.evChargers
                                                .available
                                        }
                                        /{station.availability.evChargers.total}{" "}
                                        available
                                        {station.availability.evChargers
                                            .fastChargers &&
                                            ` (${station.availability.evChargers.fastChargers} fast)`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Pricing
                        </h4>
                        <div className="space-y-2">
                            {station.pricing.cngPrice && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">CNG:</span>
                                    <span className="text-white font-medium">
                                        ₦{station.pricing.cngPrice}/SCM
                                    </span>
                                </div>
                            )}
                            {station.pricing.evPrice && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">
                                        EV Charging:
                                    </span>
                                    <span className="text-white font-medium">
                                        ₦{station.pricing.evPrice}/kWh
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Operating Hours
                        </h4>
                        <div className="bg-white/5 rounded-lg p-3">
                            {station.operatingHours.is24Hours ? (
                                <span className="text-green-300 font-medium">
                                    24/7 Available
                                </span>
                            ) : (
                                <span className="text-white/70">
                                    {station.operatingHours.open} -{" "}
                                    {station.operatingHours.close}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Amenities */}
                    {station.amenities && station.amenities.length > 0 && (
                        <div>
                            <h4 className="text-lg font-medium text-white mb-2">
                                Amenities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {station.amenities.map((amenity: string) => (
                                    <span
                                        key={amenity}
                                        className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="border-t border-white/20 pt-6">
                        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 rounded-lg transition-all font-medium">
                            Get Directions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
