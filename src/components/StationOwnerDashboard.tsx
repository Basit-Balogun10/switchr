import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function StationOwnerDashboard() {
  const user = useQuery(api.auth.loggedInUser);
  const stations = useQuery(api.stations.list, {});
  const userStations = stations?.filter(s => s.ownerId === user?._id) || [];
  const updateAvailability = useMutation(api.stations.updateAvailability);

  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    cngAvailable: true,
    evChargers: { total: 4, available: 4, fastChargers: 2 }
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (userStations.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Station Owner Dashboard</h2>
        <p className="text-white/70 mb-6">You don't have any stations registered yet.</p>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
          Register a Station
        </button>
      </div>
    );
  }

  const totalStations = userStations.length;
  const operationalStations = userStations.filter(s => s.status === "operational").length;
  const cngStations = userStations.filter(s => s.type === "CNG" || s.type === "Both").length;
  const evStations = userStations.filter(s => s.type === "EV" || s.type === "Both").length;

  const stats = [
    { label: "Total Stations", value: totalStations, icon: "⛽" },
    { label: "Operational", value: operationalStations, icon: "✅" },
    { label: "CNG Stations", value: cngStations, icon: "🔵" },
    { label: "EV Stations", value: evStations, icon: "🔌" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Station Owner Dashboard</h1>
        <p className="text-white/70">Manage your charging and refueling stations</p>
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

      {/* Stations List */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-4">Your Stations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {userStations.map((station) => (
            <div key={station._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{station.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  station.status === "operational" ? "bg-green-500/20 text-green-300" :
                  station.status === "maintenance" ? "bg-yellow-500/20 text-yellow-300" :
                  "bg-red-500/20 text-red-300"
                }`}>
                  {station.status}
                </span>
              </div>
              
              <p className="text-white/70 text-sm mb-3">{station.location.address}</p>
              
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
                      {station.availability.evChargers.available}/{station.availability.evChargers.total}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedStation(station);
                  setAvailabilityForm({
                    cngAvailable: station.availability.cngAvailable || false,
                    evChargers: station.availability.evChargers || { total: 4, available: 4, fastChargers: 2 }
                  });
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Update Availability
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Update Availability Modal */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Update Availability</h3>
            <p className="text-white/70 mb-6">{selectedStation.name}</p>
            
            <div className="space-y-4 mb-6">
              {selectedStation.type === "CNG" || selectedStation.type === "Both" ? (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={availabilityForm.cngAvailable}
                      onChange={(e) => setAvailabilityForm({
                        ...availabilityForm,
                        cngAvailable: e.target.checked
                      })}
                      className="rounded"
                    />
                    <span className="text-white">CNG Available</span>
                  </label>
                </div>
              ) : null}

              {selectedStation.type === "EV" || selectedStation.type === "Both" ? (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">EV Chargers</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Total</label>
                      <input
                        type="number"
                        min="1"
                        value={availabilityForm.evChargers.total}
                        onChange={(e) => setAvailabilityForm({
                          ...availabilityForm,
                          evChargers: {
                            ...availabilityForm.evChargers,
                            total: parseInt(e.target.value)
                          }
                        })}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Available</label>
                      <input
                        type="number"
                        min="0"
                        max={availabilityForm.evChargers.total}
                        value={availabilityForm.evChargers.available}
                        onChange={(e) => setAvailabilityForm({
                          ...availabilityForm,
                          evChargers: {
                            ...availabilityForm.evChargers,
                            available: parseInt(e.target.value)
                          }
                        })}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedStation(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateAvailability({
                    stationId: selectedStation._id,
                    availability: {
                      cngAvailable: selectedStation.type === "CNG" || selectedStation.type === "Both" 
                        ? availabilityForm.cngAvailable : undefined,
                      evChargers: selectedStation.type === "EV" || selectedStation.type === "Both"
                        ? availabilityForm.evChargers : undefined
                    }
                  });
                  setSelectedStation(null);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
