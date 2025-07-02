import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Dashboard() {
  const user = useQuery(api.auth.loggedInUser);
  const bookings = useQuery(api.bookings.getUserBookings);
  const providers = useQuery(api.providers.list, { verified: true });
  const stations = useQuery(api.stations.list, { status: "operational" });
  const seedDatabase = useMutation(api.sampleData.seedDatabase);

  if (!user || bookings === undefined || providers === undefined || stations === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const recentBookings = bookings.slice(0, 3);
  const stats = [
    { label: "Verified Providers", value: providers.length, icon: "🔧" },
    { label: "Active Stations", value: stations.length, icon: "⛽" },
    { label: "Your Bookings", value: bookings.length, icon: "📅" },
    { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: "✅" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Your clean mobility journey overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-white/70 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-white/70">No bookings yet. Start by checking vehicle compatibility!</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">
                      {booking.vehicleInfo.make} {booking.vehicleInfo.model} - {booking.conversionType}
                    </h3>
                    <p className="text-white/70">{booking.provider?.name}</p>
                    <p className="text-sm text-white/60">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "completed" ? "bg-green-500/20 text-green-300" :
                    booking.status === "confirmed" ? "bg-blue-500/20 text-blue-300" :
                    booking.status === "in_progress" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-gray-500/20 text-gray-300"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <h3 className="text-xl font-semibold text-white mb-2">Check Vehicle Compatibility</h3>
          <p className="text-white/70 mb-4">See if your vehicle is eligible for CNG or EV conversion</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            Check Now
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-semibold text-white mb-2">Find Nearby Stations</h3>
          <p className="text-white/70 mb-4">Locate CNG and EV charging stations near you</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            View Map
          </button>
        </div>
      </div>

      {/* Seed Database Button (for demo purposes) */}
      {providers?.length === 0 && (
        <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Demo Data</h3>
          <p className="text-white/70 mb-4">Load sample providers, stations, and articles to explore the platform</p>
          <button 
            onClick={() => seedDatabase()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Load Demo Data
          </button>
        </div>
      )}
    </div>
  );
}
