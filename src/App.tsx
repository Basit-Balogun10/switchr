import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AuthForm } from "./components/AuthForm";
import { useAuthActions } from "@convex-dev/auth/react";
import { Sidebar } from "./components/layout/Sidebar";
import { useUserRole } from "./hooks/useUserRole";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { ProviderDirectory } from "./components/ProviderDirectory";
import { StationMap } from "./components/StationMap";
import { VehicleChecker } from "./components/VehicleChecker";
import { CostCalculator } from "./components/CostCalculator";
import { BookingSystem } from "./components/BookingSystem";
import { LearningHub } from "./components/LearningHub";
import { ProviderOnboarding } from "./components/ProviderOnboarding";
import { ProviderDashboard } from "./components/ProviderDashboard";
import { StationOwnerDashboard } from "./components/StationOwnerDashboard";
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
  const user = useQuery(api.auth.loggedInUser);
  const userRole = useUserRole();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Set default route based on user role
  useEffect(() => {
    if (userRole && !activeTab) {
      setActiveTab(userRole.defaultRoute);
    }
  }, [userRole, activeTab]);

  const handleSignOut = () => {
    signOut();
    setActiveTab("");
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
          {/* Debug info - remove after fixing */}
          <div className="fixed top-0 right-0 z-50 bg-black/80 text-white p-2 text-xs">
            <div>User: {user ? 'Found' : 'None'}</div>
            <div>UserRole: {userRole ? userRole.type : 'None'}</div>
            <div>ActiveTab: {activeTab}</div>
          </div>

          {/* Sidebar */}
          {user && userRole && (
            <Sidebar
              userRole={userRole.type}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              user={{
                fullName: user.fullName,
                email: user.email,
                profileImage: user.profileImage,
              }}
              onSignOut={handleSignOut}
            />
          )}

          {/* Main Content */}
          <div className={`flex-1 overflow-auto ${userRole ? 'lg:ml-72' : ''}`}>
            <div className="p-4 lg:p-8 pt-16 lg:pt-8">
              {/* Content based on active tab and user role */}
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "provider-dash" && <ProviderDashboard />}
              {activeTab === "station-dash" && <StationOwnerDashboard />}
              {activeTab === "providers" && <ProviderDirectory />}
              {activeTab === "stations" && <StationMap />}
              {activeTab === "checker" && <VehicleChecker />}
              {activeTab === "calculator" && <CostCalculator />}
              {activeTab === "booking" && <BookingSystem />}
              {activeTab === "learning" && <LearningHub />}
              {activeTab === "trust-safety" && <TrustSafety />}
              {activeTab === "provider-onboard" && <ProviderOnboarding />}
              
              {/* Fallback content */}
              {!activeTab && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-white mb-4">Welcome to Switchr!</h2>
                  <p className="text-white/70">Select an option from the sidebar to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Authenticated>
    </>
  );
}
