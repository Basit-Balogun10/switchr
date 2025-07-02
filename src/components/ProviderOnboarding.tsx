import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function ProviderOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      coordinates: { lat: 0, lng: 0 }
    },
    services: [] as string[],
    certifications: [] as string[],
    pricing: {
      cngConversion: 0,
      evConversion: 0
    }
  });

  const createProvider = useMutation(api.providers.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createProvider(formData);
      // Reset form and show success
      setStep(1);
      setFormData({
        name: "",
        description: "",
        location: { address: "", city: "", state: "", coordinates: { lat: 0, lng: 0 } },
        services: [],
        certifications: [],
        pricing: { cngConversion: 0, evConversion: 0 }
      });
    } catch (error) {
      console.error("Provider registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Become a Provider</h1>
        <p className="text-white/70">Join Nigeria's leading clean mobility platform</p>
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
              <h2 className="text-2xl font-semibold text-white">Business Information</h2>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Business Name</label>
                <input
                  type="text"
                  placeholder="e.g., GreenTech Auto Solutions"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Business Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your services and experience..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Lagos"
                    value={formData.location.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">State</label>
                  <input
                    type="text"
                    placeholder="e.g., Lagos"
                    value={formData.location.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Full Address</label>
                <input
                  type="text"
                  placeholder="Complete business address"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.description || !formData.location.city}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
              >
                Next: Services & Certifications
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Services & Certifications</h2>
              
              <div>
                <label className="block text-white/70 text-sm mb-4">Services Offered</label>
                <div className="grid grid-cols-2 gap-4">
                  {["CNG", "EV", "Hybrid"].map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-lg border transition-all ${
                        formData.services.includes(service)
                          ? "border-green-500 bg-green-500/20 text-green-300"
                          : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-semibold">{service} Conversion</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-4">Certifications</label>
                <div className="space-y-2">
                  {["NMDPRA Certified", "ISO 9001", "NADDC Approved", "IEEE Member"].map((cert) => (
                    <button
                      key={cert}
                      onClick={() => handleCertificationToggle(cert)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        formData.certifications.includes(cert)
                          ? "border-green-500 bg-green-500/20 text-green-300"
                          : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
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
                  disabled={formData.services.length === 0}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                >
                  Next: Pricing
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Pricing Information</h2>
              
              {formData.services.includes("CNG") && (
                <div>
                  <label className="block text-white/70 text-sm mb-2">CNG Conversion Price (₦)</label>
                  <input
                    type="number"
                    placeholder="e.g., 750000"
                    value={formData.pricing.cngConversion || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, cngConversion: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                  />
                </div>
              )}

              {formData.services.includes("EV") && (
                <div>
                  <label className="block text-white/70 text-sm mb-2">EV Conversion Price (₦)</label>
                  <input
                    type="number"
                    placeholder="e.g., 3200000"
                    value={formData.pricing.evConversion || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, evConversion: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                  />
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">Verification Process</h3>
                <p className="text-white/70 text-sm">
                  After submission, our team will review your application and verify your certifications. 
                  This process typically takes 2-3 business days. You'll receive an email once approved.
                </p>
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
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
