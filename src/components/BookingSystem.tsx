import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function BookingSystem() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    providerId: "",
    vehicleInfo: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      engineType: "",
    },
    conversionType: "",
    scheduledDate: "",
    notes: "",
  });

  const providers = useQuery(api.providers.list, { verified: true });
  const createBooking = useMutation(api.bookings.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bookingData.providerId || !bookingData.conversionType || !bookingData.scheduledDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      const provider = providers?.find(p => p._id === bookingData.providerId);
      const cost = bookingData.conversionType === "CNG" 
        ? provider?.pricing.cngConversion || 800000
        : provider?.pricing.evConversion || 3500000;

      await createBooking({
        providerId: bookingData.providerId as any,
        vehicleInfo: bookingData.vehicleInfo,
        conversionType: bookingData.conversionType,
        scheduledDate: new Date(bookingData.scheduledDate).getTime(),
        totalCost: cost,
        notes: bookingData.notes,
      });

      // Reset form
      setStep(1);
      setBookingData({
        providerId: "",
        vehicleInfo: { make: "", model: "", year: new Date().getFullYear(), engineType: "" },
        conversionType: "",
        scheduledDate: "",
        notes: "",
      });
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-4xl font-bold text-white mb-2">Book Conversion Service</h1>
        <p className="text-white/70">Schedule your vehicle conversion with verified providers</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? "bg-green-500 text-white" : "bg-white/20 text-white/60"
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNum ? "bg-green-500" : "bg-white/20"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Vehicle Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Make</label>
                  <input
                    type="text"
                    placeholder="e.g., Toyota"
                    value={bookingData.vehicleInfo.make}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      vehicleInfo: { ...bookingData.vehicleInfo, make: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Model</label>
                  <input
                    type="text"
                    placeholder="e.g., Camry"
                    value={bookingData.vehicleInfo.model}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      vehicleInfo: { ...bookingData.vehicleInfo, model: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Year</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={bookingData.vehicleInfo.year}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      vehicleInfo: { ...bookingData.vehicleInfo, year: parseInt(e.target.value) }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Engine Type</label>
                  <select
                    value={bookingData.vehicleInfo.engineType}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      vehicleInfo: { ...bookingData.vehicleInfo, engineType: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Select Engine Type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Conversion Type</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {["CNG", "EV"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setBookingData({ ...bookingData, conversionType: type })}
                      className={`p-4 rounded-lg border transition-all ${
                        bookingData.conversionType === type
                          ? "border-green-500 bg-green-500/20 text-green-300"
                          : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-lg font-semibold">{type} Conversion</div>
                      <div className="text-sm">
                        {type === "CNG" ? "₦800,000 avg" : "₦3,500,000 avg"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.vehicleInfo.make || !bookingData.vehicleInfo.model || !bookingData.conversionType}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
              >
                Next: Select Provider
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Select Provider</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {providers
                  .filter(p => p.services.includes(bookingData.conversionType))
                  .map((provider) => (
                    <button
                      key={provider._id}
                      onClick={() => setBookingData({ ...bookingData, providerId: provider._id })}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        bookingData.providerId === provider._id
                          ? "border-green-500 bg-green-500/20"
                          : "border-white/20 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{provider.name}</h3>
                          <p className="text-white/70 text-sm">{provider.location.city}, {provider.location.state}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white/70 text-sm ml-1">
                              {provider.rating.toFixed(1)} ({provider.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            ₦{(bookingData.conversionType === "CNG" 
                              ? provider.pricing.cngConversion 
                              : provider.pricing.evConversion
                            )?.toLocaleString()}
                          </div>
                          {provider.verified && (
                            <span className="text-green-300 text-xs">✓ Verified</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!bookingData.providerId}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                >
                  Next: Schedule
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Schedule Appointment</h2>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Preferred Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.scheduledDate}
                  onChange={(e) => setBookingData({ ...bookingData, scheduledDate: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Additional Notes (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Any specific requirements or questions..."
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Vehicle:</span>
                    <span className="text-white">
                      {bookingData.vehicleInfo.make} {bookingData.vehicleInfo.model} {bookingData.vehicleInfo.year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Conversion:</span>
                    <span className="text-white">{bookingData.conversionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Provider:</span>
                    <span className="text-white">
                      {providers?.find(p => p._id === bookingData.providerId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Date:</span>
                    <span className="text-white">
                      {bookingData.scheduledDate ? new Date(bookingData.scheduledDate).toLocaleDateString() : "Not selected"}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Estimated Cost:</span>
                      <span className="text-green-300">
                        ₦{(bookingData.conversionType === "CNG" ? 800000 : 3500000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!bookingData.scheduledDate || isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
