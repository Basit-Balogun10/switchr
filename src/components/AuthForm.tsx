import React, { useState, useRef, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { UserType } from "../lib/types";

interface AuthFormProps {
    onClose: () => void;
}

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string; // For users
    companyName: string; // For providers
    agreeToTerms: boolean;
    // Provider onboarding fields
    description: string;
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number } | null;
    services: string[];
    certifications: string[];
    cngPrice: string;
    evPrice: string;
}

const serviceOptions = [
    { value: "CNG", label: "CNG Conversion" },
    { value: "EV", label: "Electric Vehicle Conversion" },
    { value: "Hybrid", label: "Hybrid Systems" },
];

const certificationOptions = [
    "NMDPRA Certified",
    "ISO 9001", 
    "NADDC Approved",
    "IEEE Member",
];

export function AuthForm({ onClose }: AuthFormProps) {
    const { signIn } = useAuthActions();
    const [isSignUp, setIsSignUp] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState<UserType>("user");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        companyName: "",
        agreeToTerms: false,
        description: "",
        address: "",
        city: "",
        state: "",
        coordinates: null,
        services: [],
        certifications: [],
        cngPrice: "",
        evPrice: "",
    });

    // Initialize Google Places Autocomplete
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).google && addressInputRef.current && selectedUserType === "provider") {
            autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(
                addressInputRef.current,
                {
                    componentRestrictions: { country: "ng" },
                    fields: ["address_components", "formatted_address", "geometry"],
                }
            );

            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current?.getPlace();
                if (place && place.geometry) {
                    setFormData(prev => ({
                        ...prev,
                        address: place.formatted_address || "",
                        coordinates: {
                            lat: place.geometry!.location!.lat(),
                            lng: place.geometry!.location!.lng(),
                        },
                    }));

                    // Extract city and state from address components
                    if (place.address_components) {
                        let city = "";
                        let state = "";

                        place.address_components.forEach((component: any) => {
                            if (component.types.includes("locality")) {
                                city = component.long_name;
                            }
                            if (component.types.includes("administrative_area_level_1")) {
                                state = component.long_name;
                            }
                        });

                        setFormData(prev => ({
                            ...prev,
                            city: city,
                            state: state,
                        }));
                    }
                }
            });
        }
    }, [selectedUserType, currentStep]);

    const validateStep = (step: number): string | null => {
        switch (step) {
            case 1:
                if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    return "Please enter a valid email address";
                }
                if (!formData.password || formData.password.length < 8) {
                    return "Password must be at least 8 characters long";
                }
                if (isSignUp && formData.password !== formData.confirmPassword) {
                    return "Passwords do not match";
                }
                if (isSignUp && selectedUserType === "user" && (!formData.fullName || formData.fullName.trim().length < 2)) {
                    return "Please enter your full name";
                }
                if (isSignUp && selectedUserType === "provider" && (!formData.companyName || formData.companyName.trim().length < 2)) {
                    return "Please enter your company name";
                }
                break;
            
            case 2:
                if (selectedUserType === "provider") {
                    if (!formData.description || formData.description.trim().length < 10) {
                        return "Please provide a description of at least 10 characters";
                    }
                    if (!formData.address) {
                        return "Please enter your business address";
                    }
                    if (!formData.city) {
                        return "Please enter your city";
                    }
                    if (!formData.state) {
                        return "Please enter your state";
                    }
                }
                break;
            
            case 3:
                if (selectedUserType === "provider") {
                    if (formData.services.length === 0) {
                        return "Please select at least one service";
                    }
                    // Terms validation only for the final step of provider signup
                    if (isSignUp && !formData.agreeToTerms) {
                        return "Please agree to the terms and conditions";
                    }
                }
                break;
        }
        
        // Terms validation for single-step user signup
        if (isSignUp && selectedUserType === "user" && !formData.agreeToTerms) {
            return "Please agree to the terms and conditions";
        }
        
        return null;
    };

    const getTotalSteps = () => {
        return selectedUserType === "provider" && isSignUp ? 3 : 1;
    };

    const handleNext = () => {
        const validationError = validateStep(currentStep);
        if (validationError) {
            setError(validationError);
            return;
        }
        
        setError("");
        if (currentStep < getTotalSteps()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError("");
        }
    };

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const toggleCertification = (cert: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate final step
        const validationError = validateStep(getTotalSteps());
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        
        const performSignIn = async () => {
            try {
                const signInData: any = {
                    email: formData.email,
                    password: formData.password,
                    flow: isSignUp ? "signUp" : "signIn",
                };

                if (isSignUp) {
                    signInData.userType = selectedUserType;

                    if (selectedUserType === "provider") {
                        signInData.companyName = formData.companyName;
                        
                        // Add provider onboarding fields
                        signInData.description = formData.description;
                        signInData.address = formData.address;
                        signInData.city = formData.city;
                        signInData.state = formData.state;
                        signInData.coordinates = formData.coordinates;
                        signInData.services = formData.services;
                        signInData.certifications = formData.certifications;
                        signInData.cngPrice = formData.cngPrice;
                        signInData.evPrice = formData.evPrice;
                    } else {
                        signInData.fullName = formData.fullName;
                    }
                }

                await signIn("password", signInData);
                onClose();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Authentication failed");
            } finally {
                setIsLoading(false);
            }
        };

        void performSignIn();
    };

    const resetForm = () => {
        setCurrentStep(1);
        setError("");
        setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            companyName: "",
            agreeToTerms: false,
            description: "",
            address: "",
            city: "",
            state: "",
            coordinates: null,
            services: [],
            certifications: [],
            cngPrice: "",
            evPrice: "",
        });
    };

    return (
        <div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-lg mx-4 relative max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Sticky Header */}
            <div className="p-6 pb-4 border-b border-white/10 rounded-t-2xl flex-shrink-0">
                <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-white/70">
                        {isSignUp
                            ? selectedUserType === "provider" 
                                ? `Join as a Service Provider (Step ${currentStep}/${getTotalSteps()})`
                                : "Join Nigeria's clean mobility platform"
                            : "Sign in to your account"}
                    </p>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* User Type Tabs - Only show during signup */}
                {isSignUp && currentStep === 1 && (
                    <div className="mb-6">
                        <div className="flex bg-white/5 rounded-lg p-1 mb-4 space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedUserType("user");
                                    resetForm();
                                }}
                                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                                    selectedUserType === "user"
                                        ? "bg-green-500 text-white shadow-sm"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                Vehicle Owner
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedUserType("provider");
                                    resetForm();
                                }}
                                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                                    selectedUserType === "provider"
                                        ? "bg-green-500 text-white shadow-sm"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                Service Provider
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <>
                            {isSignUp && (
                                <>
                                    {/* Name field - changes based on user type */}
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                            {selectedUserType === "provider" ? "Company Name" : "Full Name"}
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedUserType === "provider" ? formData.companyName : formData.fullName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [selectedUserType === "provider" ? "companyName" : "fullName"]: e.target.value,
                                                })
                                            }
                                            className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                            placeholder={selectedUserType === "provider" ? "Enter your company name" : "Enter your full name"}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {isSignUp && (
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Step 2: Provider Details */}
                    {currentStep === 2 && selectedUserType === "provider" && isSignUp && (
                        <>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                    Business Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                    placeholder="Describe your services and expertise..."
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                    Business Address
                                </label>
                                <input
                                    ref={addressInputRef}
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                    placeholder="Enter your business address"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                        placeholder="State"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 3: Services & Pricing */}
                    {currentStep === 3 && selectedUserType === "provider" && isSignUp && (
                        <>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3 text-left">
                                    Services Offered
                                </label>
                                <div className="space-y-3">
                                    {serviceOptions.map((service) => (
                                        <label key={service.value} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.services.includes(service.value)}
                                                onChange={() => toggleService(service.value)}
                                                className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400 focus:ring-offset-0"
                                            />
                                            <span className="text-white/80">{service.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3 text-left">
                                    Certifications
                                </label>
                                <div className="space-y-3">
                                    {certificationOptions.map((cert) => (
                                        <label key={cert} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.certifications.includes(cert)}
                                                onChange={() => toggleCertification(cert)}
                                                className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400 focus:ring-offset-0"
                                            />
                                            <span className="text-white/80">{cert}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                        CNG Conversion Price (₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.cngPrice}
                                        onChange={(e) => setFormData({ ...formData, cngPrice: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                        placeholder="150000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                        EV Conversion Price (₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.evPrice}
                                        onChange={(e) => setFormData({ ...formData, evPrice: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                        placeholder="800000"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                    className="mt-1 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400 focus:ring-offset-0"
                                />
                                <label htmlFor="agreeToTerms" className="text-white/80 text-sm text-left">
                                    I agree to the{" "}
                                    <button type="button" className="text-green-400 hover:text-green-300 underline">
                                        Terms of Service
                                    </button>{" "}
                                    and{" "}
                                    <button type="button" className="text-green-400 hover:text-green-300 underline">
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>
                        </>
                    )}

                    {/* Terms for single-step signup (users) */}
                    {isSignUp && selectedUserType === "user" && (
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                className="mt-1 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400 focus:ring-offset-0"
                            />
                            <label htmlFor="agreeToTerms" className="text-white/80 text-sm text-left">
                                I agree to the{" "}
                                <button type="button" className="text-green-400 hover:text-green-300 underline">
                                    Terms of Service
                                </button>{" "}
                                and{" "}
                                <button type="button" className="text-green-400 hover:text-green-300 underline">
                                    Privacy Policy
                                </button>
                            </label>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex space-x-4 mt-6">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                            >
                                Previous
                            </button>
                        )}
                        
                        {currentStep < getTotalSteps() ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            resetForm();
                        }}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
