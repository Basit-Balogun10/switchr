import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function ProviderDashboard() {
    const user = useQuery(api.auth.getCurrentUser);
    const currentProvider = useQuery(api.users.getCurrentProvider);
    const bookings = useQuery(api.bookings.getProviderBookings);
    const updateProfile = useMutation(api.users.updateProfile);

    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!currentProvider) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Provider Dashboard
                </h2>
                <p className="text-white/70 mb-6">
                    You don't have a provider account yet.
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
                    Apply to Become a Provider
                </button>
            </div>
        );
    }

    const stats = [
        { label: "Total Bookings", value: bookings?.length || 0, icon: "📅" },
        {
            label: "Pending",
            value: bookings?.filter((b) => b.status === "pending").length || 0,
            icon: "⏳",
        },
        {
            label: "Completed",
            value:
                bookings?.filter((b) => b.status === "completed").length || 0,
            icon: "✅",
        },
        { label: "Rating", value: currentProvider.rating.toFixed(1), icon: "⭐" },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Provider Dashboard
                </h1>
                <p className="text-white/70">{currentProvider.name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center"
                    >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white">
                            {stat.value}
                        </div>
                        <div className="text-white/70 text-sm">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Recent Bookings
                </h2>
                {!bookings || bookings.length === 0 ? (
                    <p className="text-white/70">No bookings yet.</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white/5 rounded-lg p-4 border border-white/10"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            {booking.vehicleInfo.make}{" "}
                                            {booking.vehicleInfo.model} -{" "}
                                            {booking.conversionType}
                                        </h3>
                                        <p className="text-white/70">
                                            ₦
                                            {booking.totalCost.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-white/60">
                                            {new Date(
                                                booking.scheduledDate
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                booking.status === "completed"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : booking.status ===
                                                        "confirmed"
                                                      ? "bg-blue-500/20 text-blue-300"
                                                      : booking.status ===
                                                          "in_progress"
                                                        ? "bg-yellow-500/20 text-yellow-300"
                                                        : "bg-gray-500/20 text-gray-300"
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setSelectedBooking(booking)
                                            }
                                            className="text-blue-300 hover:text-blue-200 text-sm"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Management Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Manage Booking
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-white/70">Vehicle:</span>
                                <span className="text-white">
                                    {selectedBooking.vehicleInfo.make}{" "}
                                    {selectedBooking.vehicleInfo.model}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Type:</span>
                                <span className="text-white">
                                    {selectedBooking.conversionType}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Date:</span>
                                <span className="text-white">
                                    {new Date(
                                        selectedBooking.scheduledDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Cost:</span>
                                <span className="text-white">
                                    ₦
                                    {selectedBooking.totalCost.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <label className="block text-white/70 text-sm">
                                Update Status:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "confirmed",
                                    "in_progress",
                                    "completed",
                                    "cancelled",
                                ].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateProfile({
                                                bookingId: selectedBooking._id,
                                                status,
                                            });
                                            setSelectedBooking(null);
                                        }}
                                        className={`p-2 rounded text-sm transition-colors ${
                                            selectedBooking.status === status
                                                ? "bg-green-500/20 text-green-300"
                                                : "bg-white/10 text-white/70 hover:bg-white/20"
                                        }`}
                                    >
                                        {status.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
