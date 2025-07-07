import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { api } from "../convex/_generated/api";
import { AuthForm } from "./components/AuthForm";
import { useAuthActions } from "@convex-dev/auth/react";
import { Sidebar } from "./components/layout/Sidebar";
import { useUserRole } from "./hooks/useUserRole";
import { Toaster } from "sonner";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ProviderDirectory } from "./components/ProviderDirectory";
import { StationMap } from "./components/StationMap";
import { VehicleChecker } from "./components/VehicleChecker";
import { CostCalculator } from "./components/CostCalculator";
import { BookingSystem } from "./components/BookingSystem";
import { LearningHub } from "./components/LearningHub";
import { ProviderOnboarding } from "./components/ProviderOnboarding";
import { ProviderDashboard } from "./components/ProviderDashboard";
import { TrustSafety } from "./components/TrustSafety";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 font-sans">
      <main>
        <Content />
      </main>
      
      <Toaster />
    </div>
  );
}

function Content() {
  const user = useQuery(api.auth.getCurrentUser);
  const userRole = useUserRole();
  const { signOut } = useAuthActions();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Switch to Clean
                <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Mobility
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Nigeria's trusted platform for CNG and EV conversions. Find verified providers, 
                book services, and navigate your clean energy transition with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 my-12">
              {[
                {
                  title: "Verified Providers",
                  description: "KYC-verified garages with certified technicians",
                  icon: "🔧"
                },
                {
                  title: "Live Station Map",
                  description: "Real-time CNG/EV station availability and pricing",
                  icon: "🗺️"
                },
                {
                  title: "Digital Vault",
                  description: "Secure storage for certificates and warranties",
                  icon: "🔒"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Standalone Get Started Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setShowAuthForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-friendly"
              >
                Get Started
              </button>
            </div>

            {showAuthForm && (
              <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAuthForm(false)}
              >
                <AuthForm onClose={() => setShowAuthForm(false)} />
              </div>
            )}
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="flex h-screen">
          {/* Sidebar */}
          {user && userRole && (
            <Sidebar
              userRole={userRole.type}
              user={{
                fullName: user.fullName || "",
                email: user.email || "",
                profileImage: user.profileImage,
              }}
              onSignOut={handleSignOut}
            />
          )}

          {/* Main Content - Adjusted for sidebar */}
          <div className="flex-1 overflow-auto ml-0 lg:ml-72 transition-all duration-300">
            <div className="p-4 lg:p-8 pt-16 lg:pt-8">
              <Routes>
                {/* User Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vehicle-checker" element={<VehicleChecker />} />
                <Route path="/providers" element={<ProviderDirectory />} />
                <Route path="/stations" element={<StationMap />} />
                <Route path="/bookings" element={<BookingSystem />} />
                <Route path="/learning" element={<LearningHub />} />
                <Route path="/documents" element={<TrustSafety />} />
                <Route path="/calculator" element={<CostCalculator />} />

                {/* Provider Routes */}
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                <Route path="/manage-bookings" element={<ProviderDashboard />} />
                <Route path="/customers" element={<div className="text-white">Customers Page - Coming Soon</div>} />
                <Route path="/analytics" element={<div className="text-white">Analytics Page - Coming Soon</div>} />
                <Route path="/checklists" element={<TrustSafety />} />
                <Route path="/provider-onboard" element={<ProviderOnboarding />} />

                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<div className="text-white">Admin Dashboard - Coming Soon</div>} />
                <Route path="/admin/providers" element={<ProviderDirectory />} />
                <Route path="/admin/stations" element={<StationMap />} />
                <Route path="/admin/users" element={<div className="text-white">User Management - Coming Soon</div>} />
                <Route path="/admin/analytics" element={<div className="text-white">Platform Analytics - Coming Soon</div>} />

                {/* Default redirect based on user role */}
                <Route path="/" element={
                  <Navigate to={userRole?.defaultRoute || "/dashboard"} replace />
                } />
                
                {/* Fallback for unknown routes */}
                <Route path="*" element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
                    <p className="text-white/70">The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </Authenticated>
    </>
  );
}
