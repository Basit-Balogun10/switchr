import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function StationMap() {
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    status: "operational",
  });

  const stations = useQuery(api.stations.list, filters);

  if (stations === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Station Locator</h1>
        <p className="text-white/70">Find CNG and EV charging stations with real-time availability</p>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Station Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="">All Types</option>
              <option value="CNG">CNG Only</option>
              <option value="EV">EV Only</option>
              <option value="Both">CNG & EV</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="">All Status</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="bg-gray-800/50 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-white/70">Interactive map will be displayed here</p>
            <p className="text-white/50 text-sm">Integration with Google Maps or OpenStreetMap</p>
          </div>
        </div>
      </div>

      {/* Stations List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div key={station._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">{station.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                station.status === "operational" ? "bg-green-500/20 text-green-300" :
                station.status === "maintenance" ? "bg-yellow-500/20 text-yellow-300" :
                "bg-red-500/20 text-red-300"
              }`}>
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
                {station.operatingHours.is24Hours ? "24/7" : 
                  `${station.operatingHours.open} - ${station.operatingHours.close}`}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                station.type === "CNG" ? "bg-blue-500/20 text-blue-300" :
                station.type === "EV" ? "bg-purple-500/20 text-purple-300" :
                "bg-green-500/20 text-green-300"
              }`}>
                {station.type}
              </span>
              {station.verified && (
                <span className="text-green-300 text-sm">✓ Verified</span>
              )}
            </div>

            {/* Availability Status */}
            <div className="space-y-2 mb-4">
              {station.availability.cngAvailable !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">CNG</span>
                  <span className={`text-sm ${
                    station.availability.cngAvailable ? "text-green-300" : "text-red-300"
                  }`}>
                    {station.availability.cngAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              )}
              {station.availability.evChargers && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">EV Chargers</span>
                  <span className="text-green-300 text-sm">
                    {station.availability.evChargers.available}/{station.availability.evChargers.total} available
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

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
              Get Directions
            </button>
          </div>
        ))}
      </div>

      {stations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No stations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
