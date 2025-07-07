import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { UserType } from "../lib/types";

interface AuthFormProps {
    onClose: () => void;
}

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    userType: UserType;
    phone: string;
    agreeToTerms: boolean;
}

export function AuthForm({ onClose }: AuthFormProps) {
    const { signIn } = useAuthActions();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        userType: "user",
        phone: "",
        agreeToTerms: false,
    });

    const validateForm = (): string | null => {
        if (
            !formData.email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            return "Please enter a valid email address";
        }
        if (!formData.password || formData.password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (isSignUp) {
            if (!formData.fullName || formData.fullName.trim().length < 2) {
                return "Please enter your full name";
            }
            if (formData.password !== formData.confirmPassword) {
                return "Passwords do not match";
            }
            if (!formData.agreeToTerms) {
                return "Please agree to the terms and conditions";
            }
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn("password", {
                email: formData.email,
                password: formData.password,
                flow: isSignUp ? "signUp" : "signIn",
                ...(isSignUp && {
                    fullName: formData.fullName,
                    userType: formData.userType,
                    phone: formData.phone,
                }),
            });

            if (result) {
                onClose();
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Authentication failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const userTypeOptions = [
        {
            value: "user",
            label: "Vehicle Owner",
            icon: "🚗",
            description: "Access mobility services and resources",
        },
        {
            value: "provider",
            label: "Service Provider",
            icon: "🔧",
            description: "Offering conversion services",
        },
    ];

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
                            ? "Join Nigeria's clean mobility platform"
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                    Sign up as
                                </label>
                                <div className="space-y-2">
                                    {userTypeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    userType:
                                                        option.value as UserType,
                                                })
                                            }
                                            className={`w-full p-3 rounded-lg border transition-all text-left ${
                                                formData.userType ===
                                                option.value
                                                    ? "border-green-500 bg-green-500/20 text-white"
                                                    : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">
                                                    {option.icon}
                                                </span>
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {option.label}
                                                    </div>
                                                    <div className="text-xs opacity-70">
                                                        {option.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
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
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                placeholder="+234 xxx xxx xxxx"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2 text-left">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
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
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                className="w-full bg-white/5 border border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg px-4 py-3 text-white placeholder-white/50 transition-all"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    {isSignUp && (
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        agreeToTerms: e.target.checked,
                                    })
                                }
                                className="mt-1 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400 focus:ring-offset-0"
                            />
                            <label
                                htmlFor="agreeToTerms"
                                className="text-white/80 text-sm text-left"
                            >
                                I agree to the{" "}
                                <button
                                    type="button"
                                    className="text-green-400 hover:text-green-300 underline"
                                >
                                    Terms of Service
                                </button>{" "}
                                and{" "}
                                <button
                                    type="button"
                                    className="text-green-400 hover:text-green-300 underline"
                                >
                                    Privacy Policy
                                </button>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                    >
                        {isLoading
                            ? "Processing..."
                            : isSignUp
                              ? "Create Account"
                              : "Sign In"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        {isSignUp
                            ? "Already have an account? Sign in"
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}
