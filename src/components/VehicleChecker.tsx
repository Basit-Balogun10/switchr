import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function VehicleChecker() {
  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
  });

  const [result, setResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Get vehicle compatibility data from the database
  const compatibilityData = useQuery(api.compatibility.checkVehicle, 
    vehicleData.make && vehicleData.model ? vehicleData : "skip"
  );

  const checkCompatibility = async () => {
    if (!vehicleData.make || !vehicleData.model) {
      return;
    }

    setIsChecking(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      if (compatibilityData) {
        setResult(compatibilityData);
      } else {
        setResult({
          compatible: false,
          message: "Vehicle compatibility data not available. Please contact a certified provider for assessment.",
        });
      }
      setIsChecking(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Vehicle Compatibility Checker</h1>
        <p className="text-white/70">Check if your vehicle is eligible for clean energy conversion</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Vehicle Make</label>
                <input
                  type="text"
                  placeholder="e.g., Toyota, Honda, Nissan"
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Vehicle Model</label>
                <input
                  type="text"
                  placeholder="e.g., Camry, Accord, Altima"
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Year</label>
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={vehicleData.year}
                onChange={(e) => setVehicleData({ ...vehicleData, year: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <button
              onClick={checkCompatibility}
              disabled={!vehicleData.make || !vehicleData.model || isChecking}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-semibold"
            >
              {isChecking ? "Checking..." : "Check Compatibility"}
            </button>
          </div>
        </div>

        {result && (
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border ${
            result.compatible ? "border-green-500/50" : "border-red-500/50"
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`text-3xl ${result.compatible ? "text-green-400" : "text-red-400"}`}>
                {result.compatible ? "✅" : "❌"}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 ${
                  result.compatible ? "text-green-300" : "text-red-300"
                }`}>
                  {result.compatible ? "Compatible!" : "Not Compatible"}
                </h3>
                <p className="text-white/70 mb-4">{result.message}</p>

                {result.compatible && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Available Conversion Types:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.conversionTypes?.map((type: string) => (
                          <span key={type} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {result.estimatedCost && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Estimated Conversion Costs:</h4>
                        <div className="space-y-2">
                          {result.estimatedCost.cng && (
                            <div className="flex justify-between">
                              <span className="text-white/70">CNG Conversion:</span>
                              <span className="text-white">₦{result.estimatedCost.cng.toLocaleString()}</span>
                            </div>
                          )}
                          {result.estimatedCost.ev && (
                            <div className="flex justify-between">
                              <span className="text-white/70">EV Conversion:</span>
                              <span className="text-white">₦{result.estimatedCost.ev.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {result.notes && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-2">Additional Notes:</h4>
                        <p className="text-white/70 text-sm">{result.notes}</p>
                      </div>
                    )}

                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                      Find Providers
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">CNG Conversion</h3>
            <ul className="space-y-2 text-white/70">
              <li>• 30-40% fuel cost savings</li>
              <li>• Lower emissions</li>
              <li>• Dual fuel capability</li>
              <li>• Government incentives available</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">EV Conversion</h3>
            <ul className="space-y-2 text-white/70">
              <li>• 80-90% operating cost reduction</li>
              <li>• Zero direct emissions</li>
              <li>• Low maintenance</li>
              <li>• Future-proof technology</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
