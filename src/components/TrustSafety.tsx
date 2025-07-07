import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function TrustSafety() {
    const user = useQuery(api.auth.getCurrentUser);
    const bookings = useQuery(api.bookings.getUserBookings);
    const documents = useQuery(
        api.documents?.list,
        user ? { userId: user._id } : "skip"
    );

    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [checklistItems, setChecklistItems] = useState({
        preConversion: [
            { item: "Vehicle inspection completed", completed: false },
            { item: "Customer consent form signed", completed: false },
            { item: "Insurance verification", completed: false },
            { item: "Parts availability confirmed", completed: false },
        ],
        postConversion: [
            { item: "System functionality test", completed: false },
            { item: "Safety inspection passed", completed: false },
            { item: "Customer training completed", completed: false },
            { item: "Warranty documentation provided", completed: false },
        ],
    });

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                    Trust & Safety
                </h1>
                <p className="text-white/70">
                    Digital checklists, certificates, and safety protocols
                </p>
            </div>

            {/* Digital Vault */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Digital Vault
                </h2>
                <p className="text-white/70 mb-6">
                    Secure storage for your conversion certificates and
                    warranties
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            type: "certificate",
                            title: "CNG Conversion Certificate",
                            date: "2024-01-15",
                            icon: "📜",
                        },
                        {
                            type: "warranty",
                            title: "5-Year System Warranty",
                            date: "2024-01-15",
                            icon: "🛡️",
                        },
                        {
                            type: "inspection",
                            title: "Safety Inspection Report",
                            date: "2024-01-20",
                            icon: "🔍",
                        },
                    ].map((doc, index) => (
                        <div
                            key={index}
                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="text-2xl">{doc.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">
                                        {doc.title}
                                    </h3>
                                    <p className="text-white/60 text-xs">
                                        {doc.date}
                                    </p>
                                </div>
                            </div>
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors">
                                View Document
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Checklists */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Service Checklists
                </h2>
                <p className="text-white/70 mb-6">
                    Track conversion progress with digital checklists
                </p>

                {bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.slice(0, 3).map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white/5 rounded-lg p-4 border border-white/10"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            {booking.vehicleInfo.make}{" "}
                                            {booking.vehicleInfo.model} -{" "}
                                            {booking.conversionType}
                                        </h3>
                                        <p className="text-white/70 text-sm">
                                            {booking.provider?.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSelectedBooking(booking)
                                        }
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm transition-colors"
                                    >
                                        View Checklist
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white/70">
                        No active conversions to track.
                    </p>
                )}
            </div>

            {/* Safety Alerts */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Safety Alerts
                </h2>

                <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <span className="text-yellow-400 text-xl">⚠️</span>
                            <div>
                                <h3 className="font-semibold text-yellow-300">
                                    Maintenance Reminder
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Your CNG system is due for 6-month
                                    inspection
                                </p>
                                <button className="text-yellow-300 text-sm hover:underline mt-2">
                                    Schedule Inspection
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-400 text-xl">ℹ️</span>
                            <div>
                                <h3 className="font-semibold text-blue-300">
                                    Safety Update
                                </h3>
                                <p className="text-white/70 text-sm">
                                    New safety guidelines for CNG vehicle
                                    operation
                                </p>
                                <button className="text-blue-300 text-sm hover:underline mt-2">
                                    Read Guidelines
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-white/20 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Service Checklist
                        </h3>
                        <p className="text-white/70 mb-6">
                            {selectedBooking.vehicleInfo.make}{" "}
                            {selectedBooking.vehicleInfo.model} -{" "}
                            {selectedBooking.conversionType}
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-white mb-3">
                                    Pre-Conversion Checklist
                                </h4>
                                <div className="space-y-2">
                                    {checklistItems.preConversion.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 p-2 bg-white/5 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.completed}
                                                    onChange={(e) => {
                                                        const newItems = [
                                                            ...checklistItems.preConversion,
                                                        ];
                                                        newItems[
                                                            index
                                                        ].completed =
                                                            e.target.checked;
                                                        setChecklistItems({
                                                            ...checklistItems,
                                                            preConversion:
                                                                newItems,
                                                        });
                                                    }}
                                                    className="rounded"
                                                />
                                                <span
                                                    className={`text-sm ${item.completed ? "text-green-300" : "text-white/70"}`}
                                                >
                                                    {item.item}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-3">
                                    Post-Conversion Checklist
                                </h4>
                                <div className="space-y-2">
                                    {checklistItems.postConversion.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 p-2 bg-white/5 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.completed}
                                                    onChange={(e) => {
                                                        const newItems = [
                                                            ...checklistItems.postConversion,
                                                        ];
                                                        newItems[
                                                            index
                                                        ].completed =
                                                            e.target.checked;
                                                        setChecklistItems({
                                                            ...checklistItems,
                                                            postConversion:
                                                                newItems,
                                                        });
                                                    }}
                                                    className="rounded"
                                                />
                                                <span
                                                    className={`text-sm ${item.completed ? "text-green-300" : "text-white/70"}`}
                                                >
                                                    {item.item}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                                Save Progress
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
