import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function ProviderDirectory() {
  const [filters, setFilters] = useState({
    city: "",
    service: "",
    verified: true,
  });

  const providers = useQuery(api.providers.list, filters);

  if (providers === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Verified Providers</h1>
        <p className="text-white/70">Find trusted conversion specialists near you</p>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="grid md:grid-cols-3 gap-4">
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
            <label className="block text-white/70 text-sm mb-2">Service Type</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="">All Services</option>
              <option value="CNG">CNG Conversion</option>
              <option value="EV">EV Conversion</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                className="rounded"
              />
              <span>Verified Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div key={provider._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
              {provider.verified && (
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                  ✓ Verified
                </span>
              )}
            </div>
            
            <p className="text-white/70 mb-4 line-clamp-3">{provider.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-white/60 text-sm">
                <span className="mr-2">📍</span>
                {provider.location.city}, {provider.location.state}
              </div>
              <div className="flex items-center text-white/60 text-sm">
                <span className="mr-2">⭐</span>
                {provider.rating.toFixed(1)} ({provider.totalReviews} reviews)
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {provider.services.map((service) => (
                <span key={service} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                  {service}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              {provider.pricing.cngConversion && (
                <div className="text-white/70 text-sm">
                  CNG: ₦{provider.pricing.cngConversion.toLocaleString()}
                </div>
              )}
              {provider.pricing.evConversion && (
                <div className="text-white/70 text-sm">
                  EV: ₦{provider.pricing.evConversion.toLocaleString()}
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No providers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
